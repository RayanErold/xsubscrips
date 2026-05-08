import { Resend } from "resend";
import * as dotenv from "dotenv";
import path from "path";

// Load .env from the root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function testResend() {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error("❌ Error: RESEND_API_KEY not found in .env file.");
    return;
  }

  console.log("🔗 Connecting to Resend...");
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: "SubsTrack <onboarding@resend.dev>", // Default Resend test domain
      to: "delivered@resend.dev", // A special Resend address that always succeeds
      subject: "Test Connection",
      html: "<h1>It Works!</h1><p>The Resend API key in SubsTrack is correctly configured.</p>",
    });

    if (error) {
      console.error("❌ Resend API Error:", error.message);
    } else {
      console.log("✅ Success! Your API key is valid.");
      console.log("📧 Test email ID:", data?.id);
    }
  } catch (err: any) {
    console.error("❌ Connection failed:", err.message);
  }
}

testResend();
