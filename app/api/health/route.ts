import { NextResponse } from "next/server";
import { checkSupabaseConnection } from "@/lib/db-health";

export async function GET() {
  const r = await checkSupabaseConnection();
  // Also log to server console for convenience
  if (r.ok) {
    console.log(
      `[DB HEALTH][API] Supabase reachable (status=${r.status ?? "unknown"})`
    );
  } else if (r.reachable) {
    console.log(
      `[DB HEALTH][API] Supabase reachable but not OK (status=${
        r.status ?? "unknown"
      })`
    );
  } else {
    console.log(
      `[DB HEALTH][API] Supabase unreachable: ${r.reason ?? "no response"}`
    );
  }

  return NextResponse.json(r);
}
