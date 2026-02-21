import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSoulSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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
      res.status(201).json(soul);
    } catch (error) {
      res.status(500).json({ message: "Failed to create soul" });
    }
  });

  app.patch("/api/souls/:id", async (req, res) => {
    try {
      const soul = await storage.updateSoul(req.params.id, req.body);
      if (!soul) {
        return res.status(404).json({ message: "Soul not found" });
      }
      res.json(soul);
    } catch (error) {
      res.status(500).json({ message: "Failed to update soul" });
    }
  });

  return httpServer;
}
