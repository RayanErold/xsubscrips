import { Router, type Response } from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AuthenticatedRequest } from "../middleware/auth";
import { logger } from "../lib/logger";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.post("/ai/scan-receipt", upload.single("image"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image uploaded" });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
      return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an expert at analyzing documents. 
      First, determine if the provided image is a subscription receipt, invoice, or billing confirmation.
      
      If it is NOT a receipt/invoice:
      Return ONLY this JSON: { "error": "NOT_A_RECEIPT", "message": "This image does not appear to be a subscription receipt or invoice." }

      If it IS a receipt/invoice:
      Extract the following information and return it as a JSON object:
      {
        "name": "Subscription name (e.g. Netflix)",
        "price": number (e.g. 15.99),
        "currency": "3-letter currency code (e.g. USD)",
        "billingCycle": "monthly" | "yearly" | "weekly",
        "startDate": "YYYY-MM-DD",
        "nextBillingDate": "YYYY-MM-DD",
        "category": "One of: Entertainment, Productivity, Music, Video, Gaming, Fitness, News, Education, Cloud, Other",
        "notes": "Extra details"
      }
      Return ONLY the JSON object. Do not include markdown code blocks.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text().trim();
    
    // Clean up response text
    const cleanedText = text.replace(/```json|```/g, "").trim();
    let data;
    try {
      data = JSON.parse(cleanedText);
    } catch (e) {
      logger.error({ text }, "Gemini returned invalid JSON");
      res.status(500).json({ error: "The AI output was malformed. Please try again." });
      return;
    }

    if (data.error === "NOT_A_RECEIPT") {
      res.status(400).json({ error: data.message });
      return;
    }

    res.json(data);
  } catch (error: any) {
    if (error?.status === 429) {
      res.status(429).json({ error: "Gemini rate limit exceeded. Please wait about 60 seconds and try again." });
      return;
    }
    logger.error({ 
      message: error.message,
      status: error.status,
      details: error.response?.data || error.details 
    }, "Failed to scan receipt with AI");
    res.status(500).json({ error: "Failed to process image with AI" });
  }
});

// Debug route to test Gemini connectivity
router.get("/ai/test", async (_req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Say 'Gemini 2.0 Flash is connected and working!'");
    const response = await result.response;
    
    res.json({
      success: true,
      message: response.text(),
      model: "gemini-2.0-flash"
    });
  } catch (error: any) {
    logger.error({ 
      message: error.message,
      stack: error.stack,
      status: error.status,
      details: error.response?.data || error.details
    }, "Gemini test failed");
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;
