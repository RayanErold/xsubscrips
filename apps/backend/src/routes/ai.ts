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
      Analyze this image of a subscription receipt or invoice. 
      Extract the following information and return it as a JSON object:
      {
        "name": "Subscription name (e.g. Netflix)",
        "price": number (e.g. 15.99),
        "currency": "3-letter currency code (e.g. USD)",
        "billingCycle": "monthly" | "yearly" | "weekly",
        "startDate": "YYYY-MM-DD (estimate if not clear)",
        "nextBillingDate": "YYYY-MM-DD (estimate if not clear)",
        "category": "One of: Entertainment, Productivity, Music, Video, Gaming, Fitness, News, Education, Cloud, Other",
        "notes": "Any extra details found"
      }
      If any field is missing, provide your best guess based on the context. Return ONLY the JSON object.
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
    const text = response.text();
    
    // Clean up response text in case Gemini wraps it in markdown code blocks
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedText);

    res.json(data);
  } catch (error) {
    logger.error({ error }, "Failed to scan receipt with AI");
    res.status(500).json({ error: "Failed to process image with AI" });
  }
});

export default router;
