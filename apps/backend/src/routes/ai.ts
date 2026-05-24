import { Router, type Response } from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AuthenticatedRequest } from "../middleware/auth";
import { logger } from "../lib/logger";

const isProduction = process.env.NODE_ENV === "production";

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

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert at analyzing documents and extracting subscription information.
      Analyze the provided image of a receipt, invoice, billing confirmation, or subscription page.
      
      Extract the following information and return it as a JSON object:
      {
        "name": "Subscription name (e.g. Netflix)",
        "price": number (e.g. 15.99),
        "currency": "3-letter currency code (e.g. USD)",
        "billingCycle": "monthly" | "yearly" | "weekly",
        "startDate": "YYYY-MM-DD",
        "nextBillingDate": "YYYY-MM-DD",
        "category": "One of: Entertainment, Productivity, Music, Video, Gaming, Fitness, News, Education, Cloud, Other",
        "notes": "Extra details or explanation"
      }

      Guidelines:
      1. If the exact price or currency is not found, try to estimate or leave them as reasonable defaults (e.g., currency "USD", price 0).
      2. If you cannot find any subscription information, return the best name you can find or describe the document in the "name" field.
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
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      logger.error({ text }, "Gemini returned invalid JSON");
      res.status(500).json({ error: "The AI output was malformed. Please try again." });
      return;
    }

    res.json(data);
  } catch (error: any) {
    logger.error({ 
      error: error,
      message: error.message,
      stack: error.stack,
      status: error.status,
      details: error.response?.data || error.details 
    }, "Failed to scan receipt with AI");
    
    if (error?.status === 429) {
      res.status(429).json({ error: "Gemini rate limit exceeded. Please wait about 60 seconds and try again." });
      return;
    }
    
    res.status(500).json({ 
      error: "Failed to process image with AI",
      message: error.message,
      stack: isProduction ? undefined : error.stack
    });
  }
});

// Debug route to test Gemini connectivity
router.get("/ai/test", async (_req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say 'Gemini 2.5 Flash is connected and working!'");
    const response = await result.response;
    
    res.json({
      success: true,
      message: response.text(),
      model: "gemini-2.5-flash"
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
