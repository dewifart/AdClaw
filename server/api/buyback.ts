import { Router } from "express";
import { buybackEngine } from "../services/buybackEngine";
import { PLATFORM } from "../config/constants";

export const buybackRouter = Router();

buybackRouter.get("/stats", (_req, res) => {
  const stats = buybackEngine.getStats();

  res.json({
    success: true,
    token: PLATFORM.TOKEN_SYMBOL,
    dex: "raydium",
    fee_model: "100% of platform fees → market buyback",
    stats,
  });
});

buybackRouter.get("/recent", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const buybacks = buybackEngine.getRecentBuybacks(limit);

  res.json({
    success: true,
    count: buybacks.length,
    buybacks: buybacks.map((b) => ({
      id: b.id,
      trigger: b.trigger,
      sol_amount: b.solAmount,
      tokens_acquired: b.tokensAcquired,
      token_price_sol: b.tokenPriceSol,
      tx_signature: b.txSignature,
      executed_at: b.executedAt.toISOString(),
    })),
  });
});

buybackRouter.get("/ledger", (_req, res) => {
  const ledger = buybackEngine.getLedger();
  const totalSol = ledger.reduce((sum, entry) => sum + entry.solAmount, 0);
  const totalTokens = ledger.reduce((sum, entry) => sum + entry.tokensAcquired, 0);

  res.json({
    success: true,
    summary: {
      total_entries: ledger.length,
      total_sol_spent: Math.round(totalSol * 10000) / 10000,
      total_tokens_acquired: totalTokens,
      token: PLATFORM.TOKEN_SYMBOL,
    },
    entries: ledger.map((entry) => ({
      id: entry.id,
      sol_amount: entry.solAmount,
      tokens_acquired: entry.tokensAcquired,
      token_price_sol: entry.tokenPriceSol,
      trigger: entry.trigger,
      tx_signature: entry.txSignature,
      executed_at: entry.executedAt.toISOString(),
    })),
  });
});
