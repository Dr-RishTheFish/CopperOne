import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";

admin.initializeApp();
const db = admin.firestore();
const now = admin.firestore.FieldValue.serverTimestamp;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/__health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/", (_req, res) => {
  res.status(200).send("API is running");
});

app.post("/family", async (req, res) => {
  try {
    const { ownerUid, name } = (req.body || {}) as { ownerUid?: string; name?: string };
    if (!ownerUid) {
      return res.status(400).json({ error: "ownerUid required" });
    }

    const familyRef = db.collection("families").doc();
    await familyRef.set({ 
      ownerUid, 
      name: name || "CopperOne Family", 
      createdAt: now() 
    });

    await db.doc(`users/${ownerUid}`).set(
      { uid: ownerUid, role: "parent", familyId: familyRef.id, createdAt: now() },
      { merge: true }
    );

    return res.status(201).json({ familyId: familyRef.id });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: "server error" });
  }
});

app.get("/khan-academy-modules", async (req, res) => {
  try {
    const khanAcademyUrl = "https://www.khanacademy.org/college-careers-more/financial-literacy";

    const response = await fetch(khanAcademyUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to fetch Khan Academy content",
        modules: [],
      });
    }
    const defaultModules = [
      {
        id: "1",
        title: "Saving and Budgeting",
        description:
          "Learn how to save money and create budgets to reach your financial goals.",
        url:
          "https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:saving-and-budgeting",
        topics: ["Saving", "Budgeting", "Emergency Funds", "Financial Goals"],
      },
      {
        id: "2",
        title: "Interest and Debt",
        description:
          "Understand how interest works and how to manage debt responsibly.",
        url:
          "https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:interest-and-debt",
        topics: ["Interest Rates", "Credit Cards", "Loans", "Debt Management"],
      },
      {
        id: "3",
        title: "Investments and Retirement",
        description:
          "Explore how to invest money and plan for your financial future.",
        url:
          "https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:investments-and-retirement",
        topics: ["Stocks", "Bonds", "Retirement Planning", "401(k)"],
      },
      {
        id: "4",
        title: "Income and Benefits",
        description:
          "Learn about different types of income and employee benefits.",
        url:
          "https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:income-and-benefits",
        topics: ["Salary", "Benefits", "Taxes", "Paychecks"],
      },
      {
        id: "5",
        title: "Housing",
        description:
          "Understand the costs and responsibilities of renting and owning a home.",
        url:
          "https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:housing",
        topics: ["Renting", "Buying a Home", "Mortgages", "Home Expenses"],
      },
      {
        id: "6",
        title: "Car Expenses",
        description:
          "Learn about the true cost of owning and maintaining a car.",
        url:
          "https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:car-expenses",
        topics: ["Car Payments", "Insurance", "Maintenance", "Gas"],
      },
    ];

    return res.status(200).json({
      modules: defaultModules,
      source: "Khan Academy",
      url: khanAcademyUrl,
    });
  } catch (e: any) {
    console.error("Khan Academy modules error:", e);
    return res.status(500).json({
      error: "Failed to fetch modules",
      modules: [],
    });
  }
});

// --- Khan Academy Proxy endpoint ---
app.get("/khan-academy", async (req, res) => {
  try {
    const khanAcademyUrl =
      "https://www.khanacademy.org/college-careers-more/financial-literacy";

    // Fetch the Khan Academy page
    const response = await fetch(khanAcademyUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch content");
    }

    let html = await response.text();

    html = html.replace(/href="\//g, 'href="https://www.khanacademy.org/');
    html = html.replace(/src="\//g, 'src="https://www.khanacademy.org/');
    html = html.replace(/action="\//g, 'action="https://www.khanacademy.org/');

    html = html.replace(/<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/gi, "");
    html = html.replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *");

    return res.send(html);
  } catch (e: any) {
    console.error("Khan Academy proxy error:", e);
    return res.status(500).send(`
      <html>
        <body style="font-family: Arial; padding: 20px; text-align: center;">
          <h2>Unable to load Khan Academy content</h2>
          <p>Please try again later or 
            <a href="https://www.khanacademy.org/college-careers-more/financial-literacy" 
               target="_blank">visit Khan Academy directly</a>.
          </p>
        </body>
      </html>
    `);
  }
});
export const api = functions.region("us-central1").https.onRequest(app);
