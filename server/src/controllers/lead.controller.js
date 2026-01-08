import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, interestType, sourcePage } = req.body;

    console.log("📩 Received Lead:", req.body);

    // 1. Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, Email, and Phone are required." });
    }

    // 2. Division Decide Karein (Logic Add kiya hai)
    // Ye zaroori hai kyunki Database 'division' maang raha hai
    let derivedDivision = "RWS"; // Default fallback

    if (interestType === "CLIENT") {
      derivedDivision = "TWS";
    } else if (interestType === "PARTNER") {
      derivedDivision = "PRODUCTS";
    }
    // Note: Agar Schema mein enum values alag hain (jaise 'RealWorkStudio'), 
    // toh ye fail ho sakta hai. Filhal standard UPPERCASE try kar rahe hain.

    // 3. Database Save
    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        interestType: interestType || "STUDENT",
        sourcePage: sourcePage || "unknown",
        // ✅ YAHAN FIX HAI: Division add kar diya
        division: derivedDivision, 
      },
    });

    console.log("✅ Lead Saved:", newLead);
    return res.status(201).json(newLead);

  } catch (error) {
    console.error("❌ Error saving lead:", error);
    
    // Agar Enum ka error aaye toh user ko clear message mile
    if (error.message.includes("Argument `division`")) {
        return res.status(500).json({ error: "Database Error: Division mismatch. Check Schema Enums." });
    }

    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};