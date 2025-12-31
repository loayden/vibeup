import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Attempt to insert email
    const { error } = await supabaseServer
      .from("pre_checkout_emails")
      .insert([{ email }]);

    if (error) {
      // Handle duplicate email error
      if (error.code === "23505") {
        return NextResponse.json({ message: "This email is already subscribed!" }, { status: 200 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Email saved!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}