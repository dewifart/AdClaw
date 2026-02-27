import { Router } from "express";
import { z } from "zod";
import { launchToken, getTokenById, listTokens, getListedTokens } from "../services/tokenLauncher";
import { calculateScore, generateBreakdown, getTier } from "../services/scoreEngine";
import { storage } from "../storage";
import { API } from "../config/constants";
import { isValidSolanaAddress } from "../utils/wallet";
import { NotFoundError, ValidationError } from "../middleware/errorHandler";
import { strictRateLimit } from "../middleware/rateLimit";

export const tokensRouter = Router();

const launchSchema = z.object({
  name: z.string().min(1).max(API.NAME_MAX_LENGTH),
  description: z.string().max(API.DESCRIPTION_MAX_LENGTH).optional().default(""),
  soul_content: z.string().min(API.SOUL_CONTENT_MIN_LENGTH),
  memory_content: z.string().min(API.MEMORY_CONTENT_MIN_LENGTH),
  owner_wallet: z.string().min(API.WALLET_MIN_LENGTH).max(API.WALLET_MAX_LENGTH),
  image_url: z.string().url().optional(),
});

tokensRouter.post("/", strictRateLimit(), async (req, res, next) => {
  try {
    const parsed = launchSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError("Invalid launch data", parsed.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })));
    }

    if (!isValidSolanaAddress(parsed.data.owner_wallet)) {
      throw new ValidationError("Invalid Solana wallet address");
    }

    const result = await launchToken(parsed.data);

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    res.status(201).json({ success: true, token: result.data });
  } catch (err) {
    next(err);
  }
});

tokensRouter.get("/", async (req, res, next) => {
  try {
    const ownerWallet = req.query.owner_wallet as string | undefined;
    const tokens = await listTokens(ownerWallet);
    res.json({ success: true, count: tokens.length, tokens });
  } catch (err) {
    next(err);
  }
});

tokensRouter.get("/listed", async (_req, res, next) => {
  try {
    const tokens = await getListedTokens();
    res.json({ success: true, count: tokens.length, tokens });
  } catch (err) {
    next(err);
  }
});

tokensRouter.get("/:id", async (req, res, next) => {
  try {
    const token = await getTokenById(req.params.id);
    if (!token) {
      throw new NotFoundError("Token", req.params.id);
    }
    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
});

tokensRouter.get("/:id/score", async (req, res, next) => {
  try {
    const soul = await storage.getSoulById(req.params.id);
    if (!soul) {
      throw new NotFoundError("Token", req.params.id);
    }

    const score = calculateScore(soul.soulContent, soul.memoryContent);
    const breakdown = generateBreakdown(soul.soulContent, soul.memoryContent);
    const tier = getTier(score);

    res.json({
      success: true,
      token_id: soul.id,
      name: soul.name,
      score,
      tier: tier.label,
      breakdown,
      scored_at: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});
