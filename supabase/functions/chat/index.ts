import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ============================================================
// LAYER 1 — SYSTEM ROLE & NEUTRALITY RULES
// ============================================================
const SYSTEM_PROMPT = `You are SignMaker.ai — a neutral manufacturing intelligence assistant for the sign industry.

CORE IDENTITY:
- You provide practical, experience-backed guidance on sign fabrication, installation, materials, codes, and best practices.
- You are a decision-support tool, not a decision-maker.
- You never express brand preference, vendor favoritism, or subjective opinion unless explicitly citing a user's saved memory.

NEUTRALITY RULES:
- Present options by suitability, never by popularity or trend.
- If multiple valid approaches exist, present them with trade-offs.
- Never invent user preferences. If you do not have saved context about a user's preference, say so.
- Never fabricate specifications, codes, or certifications. If uncertain, say "I'd recommend verifying this with your local authority having jurisdiction (AHJ)."

MEMORY BEHAVIOR:
- You may receive injected context from the user's personal decision memory and their company's approved knowledge.
- Memory marked "strict" is NON-NEGOTIABLE — always follow it unless it would create a safety hazard.
- Memory marked "standard" is ADVISORY — follow it by default but you may suggest alternatives with explanation.
- Memory marked "tentative" is INFORMATIONAL — consider it but feel free to suggest better approaches.
- If your advice conflicts with any saved memory, you MUST explicitly explain why you are diverging.
- When memory influences your response, disclose it clearly using this format:
  📋 **Based on your saved knowledge:** [brief reference to the memory used]

RESPONSE STYLE:
- Be direct and practical. Sign professionals value clarity over verbosity.
- Use bullet points for specifications and step-by-step for procedures.
- Include relevant safety callouts when applicable.
- Always note when local codes or AHJ approval should be verified.`;

// ============================================================
// LAYER 2 — GLOBAL INDUSTRY KNOWLEDGE (STATIC, READ-ONLY)
// ============================================================
const INDUSTRY_CONTEXT = `REFERENCE KNOWLEDGE (General sign industry standards):
- UL 48 covers electric signs
- NEC Article 600 governs electric sign installation
- IBC Chapter 31 and local amendments govern sign structures
- Common substrate types: aluminum composite (ACM/ACP), HDU, MDO, acrylic, polycarbonate, dibond
- Channel letter standard depths: 3.5", 5", 8" (varies by face size)
- LED module spacing typically 2-3 modules per linear foot depending on depth and brightness requirements
- Wind load calculations per ASCE 7 are required for most freestanding and projecting signs
- Always verify local sign codes — they override national standards`;

// ============================================================
// HELPER: Fetch user memories (LAYER 3)
// ============================================================
async function fetchUserMemories(supabase: any, userId: string): Promise<string> {
  const { data, error } = await supabase
    .from("user_memories")
    .select("content, memory_type, confidence, tags")
    .eq("user_id", userId)
    .eq("memory_scope", "personal")
    .order("updated_at", { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) return "";

  const formatted = data.map((m: any) => {
    const tagStr = m.tags?.length ? ` [tags: ${m.tags.join(", ")}]` : "";
    return `- [${m.confidence.toUpperCase()}] (${m.memory_type}) ${m.content}${tagStr}`;
  }).join("\n");

  return `\nUSER PERSONAL MEMORY (apply according to confidence level):\n${formatted}`;
}

// ============================================================
// HELPER: Fetch company knowledge (LAYER 4)
// ============================================================
async function fetchCompanyKnowledge(supabase: any, userId: string): Promise<string> {
  // First get user's company
  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (!membership) return "";

  const { data, error } = await supabase
    .from("company_knowledge")
    .select("content, memory_type, tags")
    .eq("company_id", membership.company_id)
    .eq("status", "approved")
    .order("updated_at", { ascending: false })
    .limit(15);

  if (error || !data || data.length === 0) return "";

  const formatted = data.map((k: any) => {
    const tagStr = k.tags?.length ? ` [tags: ${k.tags.join(", ")}]` : "";
    return `- (${k.memory_type}) ${k.content}${tagStr}`;
  }).join("\n");

  return `\nCOMPANY APPROVED KNOWLEDGE (treat as standard-confidence guidelines):\n${formatted}`;
}

// ============================================================
// MAIN HANDLER
// ============================================================
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context layers
    let memoryContext = "";
    let companyContext = "";

    // Check for authenticated user to inject memories
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Extract user from JWT
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (user && !authError) {
        // Fetch layers 3 & 4 in parallel
        const [memories, knowledge] = await Promise.all([
          fetchUserMemories(supabase, user.id),
          fetchCompanyKnowledge(supabase, user.id),
        ]);
        memoryContext = memories;
        companyContext = knowledge;
      }
    }

    // Assemble the full system prompt with all 4 layers
    const fullSystemPrompt = [
      SYSTEM_PROMPT,
      "\n" + INDUSTRY_CONTEXT,
      memoryContext,
      companyContext,
    ].filter(Boolean).join("\n");

    // Build messages array
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: fullSystemPrompt },
    ];

    // Include conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    // Add current user message
    messages.push({ role: "user", content: message });

    // Call AI gateway with streaming
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
