import { createClient } from "@/lib/supabase-client";

// Use the same Supabase client you already created
const supabase = createClient();

// ✅ Function to insert a message in Supabase
export async function saveMessageToDB(userId: string, content: string, role: "user" | "assistant", model: string) {
  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        user_id: userId,
        content,
        role,
        model,
      },
    ])
    .select();

  if (error) {
    console.error("❌ Error saving message to Supabase:", error);
    throw error;
  }

  console.log("✅ Message saved:", data);
  return data;
}
