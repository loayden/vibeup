import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ status: "error", message: "Invalid email address" }, { status: 400 });
    }

    // Attempt to insert email
    const { error } = await supabaseServer
      .from("pre_checkout_emails")
      .insert([{ email }]);

    if (error) {
      // Handle duplicate email error explicitly
      if (error.code === "23505") {
        return NextResponse.json({ status: "success", message: "This email is already subscribed!" }, { status: 200 });
      }
      return NextResponse.json({ status: "error", message: error.message }, { status: 400 });
    }

    return NextResponse.json({ status: "success", message: "Email saved!" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message || String(err) }, { status: 500 });
  }
}