import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Require authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user's JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Account deletion requested for user: ${user.id}`);

    // Delete user data from application tables (order matters for FK constraints)
    // Messages are deleted via conversation cascade, but explicit cleanup is safer
    const { error: msgError } = await supabase
      .from("messages")
      .delete()
      .in(
        "conversation_id",
        (await supabase.from("conversations").select("id").eq("user_id", user.id)).data?.map((c: { id: string }) => c.id) ?? []
      );
    if (msgError) console.error("Error deleting messages:", msgError);

    const { error: convError } = await supabase
      .from("conversations")
      .delete()
      .eq("user_id", user.id);
    if (convError) console.error("Error deleting conversations:", convError);

    const { error: memError } = await supabase
      .from("user_memories")
      .delete()
      .eq("user_id", user.id);
    if (memError) console.error("Error deleting memories:", memError);

    const { error: profileError } = await supabase
      .from("user_profiles")
      .delete()
      .eq("user_id", user.id);
    if (profileError) console.error("Error deleting profile:", profileError);

    const { error: roleError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", user.id);
    if (roleError) console.error("Error deleting roles:", roleError);

    const { error: memberError } = await supabase
      .from("company_members")
      .delete()
      .eq("user_id", user.id);
    if (memberError) console.error("Error deleting company memberships:", memberError);

    // Delete the auth user account
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error("Error deleting auth user:", deleteError);
      return new Response(
        JSON.stringify({ error: "Failed to delete account. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Account successfully deleted for user: ${user.id}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("delete-account error:", e);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
