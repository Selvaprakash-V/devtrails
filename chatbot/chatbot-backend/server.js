import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ---------------- SYSTEM PROMPT ----------------
const getSystemPrompt = (language) => `
You are an assistant for a gig worker insurance mobile app in India.

User Type:
- Delivery drivers, riders, gig workers
- May not be fluent in English

App Flow:
- OTP login
- Location + work area selection
- Vehicle type (EV / Petrol)
- Work time selection
- Profile setup (name, age, gender)
- Bank details (account number, IFSC)

App Features:
- Buy insurance
- File claim
- Track claim status
- Update profile & bank details

Your Responsibilities:
1. Explain insurance simply
2. Guide users step-by-step inside app
3. Solve common issues

Rules:
- Reply in ${language || "English"}
- Keep answers short (max 3–4 lines)
- Do NOT guess policy details
- If unsure: "I'll connect you to support"
- Stay within app context only

Tone:
- Simple
- Direct
- Action-focused
`;

// ---------------- FAQ ----------------
const faqs = [
  {
    keywords: ["premium", "cost", "price"],
    answer:
      "Premium depends on your vehicle type and working hours.",
  },
  {
    keywords: ["coverage", "covered"],
    answer:
      "Insurance covers accidents, damage, and medical emergencies during work.",
  },
];

// ---------------- CHAT API ----------------
app.post("/chat", async (req, res) => {
  try {
    const { message, language } = req.body;
    const text = message.toLowerCase();

    // ---------- ESCALATION ----------
    if (
      text.includes("agent") ||
      text.includes("support") ||
      text.includes("not helpful")
    ) {
      return res.json({
        reply: "I'll connect you to a support agent.",
      });
    }

    // ---------- HARD FLOWS ----------

    // Claim flow
    if (text.includes("claim")) {
      return res.json({
        reply:
          "To file a claim:\n1. Go to Home\n2. Tap 'Claims'\n3. Click 'New Claim'\n4. Upload documents",
      });
    }

    // Payment issue
    if (text.includes("payment")) {
      return res.json({
        reply:
          "If payment failed:\n- Check internet\n- Try again\n- If money deducted, wait 24 hours",
      });
    }

    // Bank details
    if (text.includes("bank")) {
      return res.json({
        reply:
          "Go to Profile → Bank Details → Enter account number and IFSC carefully",
      });
    }

    // ---------- FAQ MATCH ----------
    const matchedFAQ = faqs.find((f) =>
      f.keywords.some((k) => text.includes(k))
    );

    if (matchedFAQ) {
      return res.json({ reply: matchedFAQ.answer });
    }

    // ---------- AI FALLBACK ----------
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: getSystemPrompt(language),
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "Something went wrong. Please try again.",
    });
  }
});

// ---------------- START SERVER ----------------
app.listen(3000, () => {
  console.log("Server running on port 3000");
});