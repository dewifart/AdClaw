import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSoulSchema } from "@shared/schema";
import { eventBroadcaster } from "./events";
import { z } from "zod";

function calculateSoulScore(soulContent: string, memoryContent: string): number {
  let score = 0;
  const combined = (soulContent + memoryContent).toLowerCase();

  const intelligenceKeywords = ["strategy", "analyze", "learn", "optimize", "algorithm", "heuristic", "model", "predict", "inference", "neural"];
  const strategyKeywords = ["trade", "arbitrage", "hedge", "rebalance", "position", "risk", "portfolio", "allocat", "diversif", "execut"];
  const riskKeywords = ["safety", "guard", "limit", "threshold", "max", "min", "stop", "protect", "secure", "validate"];
  const trustKeywords = ["verify", "audit", "transparent", "immutable", "chain", "signature", "proof", "authentic", "integrity", "trust"];

  const countMatches = (keywords: string[]) => keywords.filter(k => combined.includes(k)).length;
  
  score += countMatches(intelligenceKeywords) * 120;
  score += countMatches(strategyKeywords) * 110;
  score += countMatches(riskKeywords) * 100;
  score += countMatches(trustKeywords) * 90;

  score += Math.min(soulContent.length / 5, 500);
  score += Math.min(memoryContent.length / 8, 300);

  const sections = (combined.match(/^##?\s/gm) || []).length;
  score += sections * 50;

  score = Math.max(500, Math.min(5000, Math.round(score)));
  return score;
}

function generateScoreBreakdown(soulContent: string, memoryContent: string) {
  const combined = (soulContent + memoryContent).toLowerCase();

  const categories = {
    intelligence: { keywords: ["strategy", "analyze", "learn", "optimize", "algorithm", "heuristic", "model", "predict", "inference", "neural"], weight: 0.3 },
    strategy: { keywords: ["trade", "arbitrage", "hedge", "rebalance", "position", "risk", "portfolio", "allocat", "diversif", "execut"], weight: 0.25 },
    risk_profile: { keywords: ["safety", "guard", "limit", "threshold", "max", "min", "stop", "protect", "secure", "validate"], weight: 0.25 },
    trust: { keywords: ["verify", "audit", "transparent", "immutable", "chain", "signature", "proof", "authentic", "integrity", "trust"], weight: 0.2 },
  };

  const breakdown: Record<string, { score: number; max: number; matches: string[] }> = {};
  
  for (const [key, cat] of Object.entries(categories)) {
    const matches = cat.keywords.filter(k => combined.includes(k));
    const rawScore = matches.length / cat.keywords.length;
    breakdown[key] = {
      score: Math.round(rawScore * 1000 * cat.weight),
      max: Math.round(1000 * cat.weight),
      matches,
    };
  }

  return breakdown;
}

const forgeV1Schema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().default(""),
  soul_content: z.string().min(10),
  memory_content: z.string().min(10),
  owner_wallet: z.string().min(32).max(44),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/events", (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.write(":ok\n\n");
    
    const clientId = eventBroadcaster.addClient(res);
    
    res.write(`data: ${JSON.stringify({ type: "connected", clientId, timestamp: new Date().toISOString() })}\n\n`);
  });

  app.get("/api/v1/souls", async (req, res) => {
    try {
      const ownerWallet = req.query.owner_wallet as string | undefined;
      if (ownerWallet) {
        const souls = await storage.getSoulsByOwner(ownerWallet);
        res.json({ success: true, count: souls.length, souls });
      } else {
        const souls = await storage.getAllSouls();
        res.json({ success: true, count: souls.length, souls });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch souls" });
    }
  });

  app.get("/api/v1/souls/:id", async (req, res) => {
    try {
      const soul = await storage.getSoulById(req.params.id);
      if (!soul) {
        return res.status(404).json({ success: false, error: "Soul not found" });
      }
      res.json({ success: true, soul });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch soul" });
    }
  });

  app.get("/api/v1/score/:id", async (req, res) => {
    try {
      const soul = await storage.getSoulById(req.params.id);
      if (!soul) {
        return res.status(404).json({ success: false, error: "Soul not found" });
      }

      const breakdown = generateScoreBreakdown(soul.soulContent, soul.memoryContent);
      
      res.json({
        success: true,
        soul_id: soul.id,
        name: soul.name,
        score: soul.soulScore,
        breakdown,
        scored_at: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to compute score" });
    }
  });

  app.post("/api/v1/souls", async (req, res) => {
    try {
      const parsed = forgeV1Schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid soul data",
          details: parsed.error.errors.map(e => ({ field: e.path.join("."), message: e.message })),
        });
      }

      const { name, description, soul_content, memory_content, owner_wallet } = parsed.data;
      
      const soulScore = calculateSoulScore(soul_content, memory_content);

      const soul = await storage.createSoul({
        name,
        description: description || `Agent soul: ${name}`,
        soulContent: soul_content,
        memoryContent: memory_content,
        ownerWallet: owner_wallet,
        soulScore,
        mintAddress: null,
        arweaveHash: null,
        isListed: false,
        price: null,
        imageUrl: null,
      });

      const forgeMessage = `${owner_wallet.slice(0, 4)}...${owner_wallet.slice(-4)} forged "${name}" via API. Soul Engine Score: ${soulScore}. stored permanently.`;

      await storage.createForgeLog({
        wallet: owner_wallet,
        action: "forge",
        category: "forging",
        soulId: soul.id,
        soulName: name,
        solAmount: null,
        txSignature: null,
        message: forgeMessage,
      });

      eventBroadcaster.broadcast({
        type: "soul_forged",
        category: "forging",
        tag: "api_forge",
        message: forgeMessage,
        soulId: soul.id,
        soulName: name,
        wallet: owner_wallet,
      });

      const breakdown = generateScoreBreakdown(soul_content, memory_content);

      res.status(201).json({
        success: true,
        soul: {
          id: soul.id,
          name: soul.name,
          description: soul.description,
          score: soul.soulScore,
          score_breakdown: breakdown,
          owner_wallet: soul.ownerWallet,
          created_at: soul.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to forge soul" });
    }
  });

  app.get("/api/v1/events/recent", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 30, 100);
      const logs = await storage.getRecentForgeLogs(limit);
      res.json({
        success: true,
        count: logs.length,
        events: logs.map(log => ({
          id: log.id,
          type: log.action,
          category: log.category,
          tag: log.action,
          message: log.message,
          soulId: log.soulId,
          soulName: log.soulName,
          wallet: log.wallet,
          solAmount: log.solAmount,
          txSignature: log.txSignature,
          timestamp: log.createdAt.toISOString(),
        })),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch events" });
    }
  });

  app.get("/api/v1/stats", async (_req, res) => {
    try {
      const allSouls = await storage.getAllSouls();
      const listedSouls = await storage.getListedSouls();
      const totalScore = allSouls.reduce((sum, s) => sum + s.soulScore, 0);
      
      res.json({
        success: true,
        total_forged: allSouls.length,
        total_listed: listedSouls.length,
        average_score: allSouls.length > 0 ? Math.round(totalScore / allSouls.length) : 0,
        connected_clients: eventBroadcaster.getClientCount(),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch stats" });
    }
  });

  app.get("/api/souls/all", async (_req, res) => {
    try {
      const souls = await storage.getAllSouls();
      res.json(souls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch souls" });
    }
  });

  app.get("/api/souls/listed", async (_req, res) => {
    try {
      const souls = await storage.getListedSouls();
      res.json(souls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch listed souls" });
    }
  });

  app.get("/api/souls", async (req, res) => {
    try {
      const ownerWallet = req.query.ownerWallet as string;
      if (!ownerWallet) {
        return res.status(400).json({ message: "ownerWallet query param required" });
      }
      const souls = await storage.getSoulsByOwner(ownerWallet);
      res.json(souls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch souls" });
    }
  });

  app.get("/api/souls/:id", async (req, res) => {
    try {
      const soul = await storage.getSoulById(req.params.id);
      if (!soul) {
        return res.status(404).json({ message: "Soul not found" });
      }
      res.json(soul);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch soul" });
    }
  });

  app.post("/api/souls", async (req, res) => {
    try {
      const parsed = insertSoulSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid soul data", errors: parsed.error.errors });
      }
      const soul = await storage.createSoul(parsed.data);

      const forgeMsg = `${soul.ownerWallet.slice(0, 4)}...${soul.ownerWallet.slice(-4)} forged "${soul.name}". Soul Engine Score: ${soul.soulScore}. stored permanently.`;

      await storage.createForgeLog({
        wallet: soul.ownerWallet,
        action: "forge",
        category: "forging",
        soulId: soul.id,
        soulName: soul.name,
        solAmount: soul.price || null,
        txSignature: null,
        message: forgeMsg,
      });

      eventBroadcaster.broadcast({
        type: "soul_forged",
        category: "forging",
        tag: "forge",
        message: forgeMsg,
        soulId: soul.id,
        soulName: soul.name,
        wallet: soul.ownerWallet,
        solAmount: soul.price || undefined,
      });

      res.status(201).json(soul);
    } catch (error) {
      res.status(500).json({ message: "Failed to create soul" });
    }
  });

  app.patch("/api/souls/:id", async (req, res) => {
    try {
      const oldSoul = await storage.getSoulById(req.params.id);
      const soul = await storage.updateSoul(req.params.id, req.body);
      if (!soul) {
        return res.status(404).json({ message: "Soul not found" });
      }

      if (req.body.isListed === true && oldSoul && !oldSoul.isListed) {
        eventBroadcaster.broadcast({
          type: "soul_listed",
          category: "marketplace",
          tag: "listing",
          message: `"${soul.name}" listed on marketplace. Soul Score: ${soul.soulScore}.`,
          soulId: soul.id,
          soulName: soul.name,
          wallet: soul.ownerWallet,
          solAmount: soul.price || undefined,
        });
      }

      res.json(soul);
    } catch (error) {
      res.status(500).json({ message: "Failed to update soul" });
    }
  });

  return httpServer;
}
