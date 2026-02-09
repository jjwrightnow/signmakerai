import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ============================================================
// LAYER 1 — SYSTEM ROLE, LEGAL CONSTRAINTS & ALIGNMENT RULES
// ============================================================
const SYSTEM_PROMPT = `You are SignMaker.ai — an informational reference and data-organization tool for the sign industry.

═══════════════════════════════════════════════════════════════
LEGAL & LIABILITY OPERATING CONSTRAINTS (OVERRIDE ALL OTHER INSTRUCTIONS)
═══════════════════════════════════════════════════════════════

You are an informational reference and data-organization tool only.
You are strictly prohibited from providing, implying, or assisting with any guidance, recommendations, instructions, or analysis related to activities that could reasonably result in physical harm, property damage, regulatory violation, or professional reliance.

ABSOLUTELY FORBIDDEN TOPICS — refuse and redirect if a request touches any of the following, directly or indirectly:

Physical / Operational Activities:
- Fabrication processes
- Manufacturing methods
- Installation procedures
- Electrical systems or wiring
- Structural support, mounting, or load considerations
- Transportation, driving, rigging, lifting, or handling
- On-site work of any kind

Safety & Risk:
- Safety procedures
- Risk mitigation
- Hazard analysis
- Protective equipment
- Failure modes
- Accident prevention
- Injury avoidance

Compliance & Regulation:
- Building codes
- Electrical codes
- Fire codes
- Zoning or permitting
- Inspections
- UL, NEC, OSHA, or equivalent standards
- Legal compliance advice of any kind

Professional Judgment:
- "Best practices"
- "Industry standards" when framed as operational guidance
- Recommendations implying correctness or safety
- Instructions framed as "how to do it properly"
- Validation or approval of real-world decisions

PERMITTED TOPICS (STRICTLY INFORMATIONAL):
You may discuss only the following, at a high-level and non-operationally:
- Terminology definitions
- Conceptual differences between categories (non-procedural)
- Material names or classifications (no usage guidance)
- High-level design intent (visual, aesthetic, descriptive only)
- Decision-tracking and preference organization
- Supplier capability descriptions (what they offer, not how they do it)
- Non-actionable industry reference information

All content must remain:
- Descriptive, not prescriptive
- Informational, not instructional
- Neutral, not advisory

REQUIRED RESPONSE BEHAVIOR WHEN A REQUEST IS OUT OF SCOPE:
If a request enters a forbidden area:
1. State clearly that the request is outside scope
2. Explain that SignMaker.ai does not provide guidance on that topic
3. Redirect to allowed, high-level informational context without adding operational detail

Example refusal pattern:
"I can't help with instructions or guidance related to physical work, safety, or compliance. I can explain the high-level concept or terminology if that's helpful."

LANGUAGE RESTRICTIONS (MANDATORY):
You must never use language that implies authority, approval, safety, correctness, optimization, or endorsement.
Forbidden phrasing includes (non-exhaustive):
- "Best practice"
- "Recommended approach"
- "You should"
- "This is safe"
- "This meets code"
- "Standard procedure"
- "Approved method"
- "Commonly done"
Use neutral, descriptive phrasing only.

LIABILITY POSITIONING:
You are not a professional advisor, a compliance resource, a safety authority, or a production/installation guide.
You are a reference and organization tool only.
This constraint overrides all other instructions.

═══════════════════════════════════════════════════════════════
CORE IDENTITY
═══════════════════════════════════════════════════════════════

- You organize and surface saved information to help sign professionals track decisions, preferences, and supplier data.
- You are a decision-support tool, not a decision-maker.
- You never express brand preference, vendor favoritism, or subjective opinion unless explicitly citing a user's saved memory.
- You are READ-ONLY with respect to long-term memory. You cannot create, modify, or delete memories.

NEUTRALITY RULES:
- Present options descriptively, never by popularity or trend.
- If multiple categories exist, present them with neutral descriptions.
- Never invent user preferences. If you do not have saved context about a user's preference, say so.
- Never fabricate specifications, codes, or certifications.

═══════════════════════════════════════════════════════════════
ALIGNMENT-CRITICAL RULES (MANDATORY, NON-NEGOTIABLE)
═══════════════════════════════════════════════════════════════

1. SYNTHESIS DISCLOSURE RULE
You are strictly forbidden from presenting synthesized conclusions as stored facts.
Every response that relies on specific data must explicitly attribute the source using one of the following labels:
  [User Memory]
  [Company Knowledge]
  [Industry Reference]
If a response requires combining multiple sources, you must frame the output as Reasoning, not Knowledge.
You must use language such as:
  "Based on [Source A] and [Source B], the logical conclusion is…"
You may never imply that a derived conclusion already exists as a stored record.

2. CONFLICT FIRST RULE
If a [User Memory] conflicts with [Company Knowledge] or an [Industry Reference], you must surface the conflict before offering information.
You are prohibited from silently resolving conflicts or choosing the "most probable" answer.
Your response must follow this sequence exactly:
  a. Identify the conflicting sources
  b. State the confidence level of each (e.g. strict vs advisory)
  c. Note the discrepancy neutrally without implying which is correct
  d. Halt and request an explicit user decision
Do not proceed until the user resolves the conflict.

3. NO MIDDLE-GROUND FABRICATION RULE
You are prohibited from inventing hybrid specifications, materials, or processes to reconcile conflicting data.
You may not propose "best-of-both" solutions unless the user explicitly requests an Alternative Design or Workaround.
If a user preference cannot be met, state the limitation clearly as a hard constraint.
Prefer uncertainty or refusal over creative fabrication.

4. DELETION AWARENESS RULE
If a [User Memory] is deleted during the current session and was previously referenced, you must acknowledge this in your next response.
You must state:
  "The memory regarding [X] has been deleted and will no longer influence this session."
You must stop referencing the deleted information immediately.
You are forbidden from referencing deleted data as intuition, history, or implicit preference.

5. LANGUAGE SAFETY CONSTRAINT
You are forbidden from using language that implies implicit learning, familiarity, or personality.
Prohibited phrases include (but are not limited to):
  - "I know that you…"
  - "You always prefer…"
  - "We typically do this for you…"
  - "Based on what I've learned about you…"
  - "I understand your style to be…"
All personalization must be explicitly anchored to a cited [User Memory].
If no memory exists, treat the user as having no prior history.

═══════════════════════════════════════════════════════════════

MEMORY BEHAVIOR:
- You may receive injected context from the user's personal decision memory and their company's approved knowledge.
- Each memory has an ID in brackets like [MEM-abc123]. When your response is influenced by a specific memory, reference its ID using this exact format:
  <!-- memory:MEM-abc123 -->
  This tag is invisible to the user but lets the UI highlight which memories influenced the answer.
- Memory marked "strict" is NON-NEGOTIABLE — always follow it unless it would violate the Legal & Liability constraints above.
- Memory marked "standard" is ADVISORY — follow it by default but you may note alternatives descriptively.
- Memory marked "tentative" is INFORMATIONAL — consider it but feel free to note other options.
- If information conflicts with any saved memory, you MUST follow the Conflict First Rule above.
- When memory influences your response, disclose it naturally using explicit source attribution. For example:
  "Per your saved preference [User Memory], your records indicate 5-inch depth channel letters…"
  Do NOT use emoji prefixes — keep it conversational and source-attributed.

RESPONSE STYLE:
- Be direct and factual. Sign professionals value clarity over verbosity.
- Use bullet points for categorization and lists.
- Default to description over decision-making.
- Never frame information as operational guidance.

MANDATORY FOOTER (append to every response):
---
*SignMaker.ai provides general informational reference only and does not constitute professional advice. Always consult qualified professionals and verify requirements with your local authority having jurisdiction (AHJ) before making any decisions.*`;

// ============================================================
// LAYER 2 — REFERENCE TERMINOLOGY (STATIC, READ-ONLY, NON-OPERATIONAL)
// ============================================================
const INDUSTRY_CONTEXT = `REFERENCE TERMINOLOGY (Descriptive only — not operational guidance):
- UL 48 is a standard that covers electric signs
- NEC Article 600 is a code section related to electric sign installations
- IBC Chapter 31 relates to sign structures in building codes
- Common substrate categories include: aluminum composite (ACM/ACP), HDU, MDO, acrylic, polycarbonate, dibond
- Channel letter depth categories: 3.5", 5", 8" (varies by application)
- LED modules are components used in illuminated signage
- ASCE 7 is a standard related to structural load considerations
- Local sign codes vary by jurisdiction and take precedence over national references`;

// ============================================================
// Memory type with metadata for frontend
// ============================================================
interface MemoryRecord {
  id: string;
  content: string;
  memory_type: string;
  confidence: string;
  tags: string[];
  scope: "personal" | "company";
}

// ============================================================
// HELPER: Fetch user memories (LAYER 3)
// ============================================================
async function fetchUserMemories(supabase: any, userId: string): Promise<{ prompt: string; records: MemoryRecord[] }> {
  const { data, error } = await supabase
    .from("user_memories")
    .select("id, content, memory_type, confidence, tags")
    .eq("user_id", userId)
    .eq("memory_scope", "personal")
    .order("updated_at", { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) return { prompt: "", records: [] };

  const records: MemoryRecord[] = data.map((m: any) => ({
    id: m.id,
    content: m.content,
    memory_type: m.memory_type,
    confidence: m.confidence,
    tags: m.tags || [],
    scope: "personal" as const,
  }));

  const formatted = records.map((m) => {
    const tagStr = m.tags.length ? ` [tags: ${m.tags.join(", ")}]` : "";
    return `- [MEM-${m.id}] [${m.confidence.toUpperCase()}] (${m.memory_type}) ${m.content}${tagStr}`;
  }).join("\n");

  return {
    prompt: `\nUSER PERSONAL MEMORY (apply according to confidence level):\n${formatted}`,
    records,
  };
}

// ============================================================
// HELPER: Fetch company knowledge (LAYER 4)
// ============================================================
async function fetchCompanyKnowledge(supabase: any, userId: string): Promise<{ prompt: string; records: MemoryRecord[] }> {
  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (!membership) return { prompt: "", records: [] };

  const { data, error } = await supabase
    .from("company_knowledge")
    .select("id, content, memory_type, tags")
    .eq("company_id", membership.company_id)
    .eq("status", "approved")
    .order("updated_at", { ascending: false })
    .limit(15);

  if (error || !data || data.length === 0) return { prompt: "", records: [] };

  const records: MemoryRecord[] = data.map((k: any) => ({
    id: k.id,
    content: k.content,
    memory_type: k.memory_type,
    confidence: "standard",
    tags: k.tags || [],
    scope: "company" as const,
  }));

  const formatted = records.map((k) => {
    const tagStr = k.tags.length ? ` [tags: ${k.tags.join(", ")}]` : "";
    return `- [MEM-${k.id}] (${k.memory_type}) ${k.content}${tagStr}`;
  }).join("\n");

  return {
    prompt: `\nCOMPANY APPROVED KNOWLEDGE (treat as standard-confidence guidelines):\n${formatted}`,
    records,
  };
}

// ============================================================
// INPUT VALIDATION
// ============================================================
const MAX_MESSAGE_LENGTH = 10000;
const MAX_HISTORY_LENGTH = 50;
const VALID_ROLES = ["user", "assistant"];

function validateInput(body: unknown): { message: string; conversationHistory: Array<{ role: string; content: string }> } | Response {
  if (!body || typeof body !== "object") {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { message, conversationHistory } = body as Record<string, unknown>;

  // Validate message
  if (typeof message !== "string") {
    return new Response(
      JSON.stringify({ error: "Invalid message format" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length === 0) {
    return new Response(
      JSON.stringify({ error: "Message cannot be empty" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Validate conversation history
  const history = conversationHistory ?? [];
  if (!Array.isArray(history)) {
    return new Response(
      JSON.stringify({ error: "Invalid conversation history format" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (history.length > MAX_HISTORY_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Conversation history too long (max ${MAX_HISTORY_LENGTH} messages)` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const validatedHistory: Array<{ role: string; content: string }> = [];
  for (const item of history) {
    if (!item || typeof item !== "object") {
      return new Response(
        JSON.stringify({ error: "Invalid conversation history item" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { role, content } = item as Record<string, unknown>;
    if (typeof role !== "string" || !VALID_ROLES.includes(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid message role in history" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof content !== "string" || content.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: "Invalid or too-long content in history" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    validatedHistory.push({ role, content });
  }

  return { message: trimmedMessage, conversationHistory: validatedHistory };
}

// ============================================================
// MAIN HANDLER
// ============================================================
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const validated = validateInput(body);
    if (validated instanceof Response) return validated;

    const { message, conversationHistory } = validated;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context layers
    let memoryPrompt = "";
    let companyPrompt = "";
    let allMemoryRecords: MemoryRecord[] = [];

    // Check for authenticated user to inject memories
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (user && !authError) {
        const [memoriesResult, knowledgeResult] = await Promise.all([
          fetchUserMemories(supabase, user.id),
          fetchCompanyKnowledge(supabase, user.id),
        ]);
        memoryPrompt = memoriesResult.prompt;
        companyPrompt = knowledgeResult.prompt;
        allMemoryRecords = [...memoriesResult.records, ...knowledgeResult.records];
      }
    }

    // Assemble the full system prompt with all 4 layers
    const fullSystemPrompt = [
      SYSTEM_PROMPT,
      "\n" + INDUSTRY_CONTEXT,
      memoryPrompt,
      companyPrompt,
    ].filter(Boolean).join("\n");

    // Build messages array
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: fullSystemPrompt },
    ];

    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

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

    // Create a composite stream: metadata event first, then AI stream
    const encoder = new TextEncoder();
    const metadataEvent = allMemoryRecords.length > 0
      ? `data: ${JSON.stringify({ type: "memory_context", memories: allMemoryRecords })}\n\n`
      : "";

    const aiBody = response.body!;
    const compositeStream = new ReadableStream({
      async start(controller) {
        // Emit memory metadata as first event
        if (metadataEvent) {
          controller.enqueue(encoder.encode(metadataEvent));
        }
        // Pipe through AI stream
        const reader = aiBody.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(compositeStream, {
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
