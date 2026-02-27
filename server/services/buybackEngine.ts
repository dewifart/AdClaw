import { BUYBACK, PLATFORM } from "../config/constants";
import { generateMockTxSignature } from "../utils/wallet";
import { eventBroadcaster } from "../events";
import { SSE_EVENT_TYPES } from "../config/constants";

interface BuybackRecord {
  id: string;
  trigger: string;
  solAmount: number;
  tokensAcquired: number;
  tokenPriceSol: number;
  txSignature: string | null;
  sourceWallet: string;
  executedAt: Date;
}

interface AccumulatedFees {
  totalSol: number;
  sources: Array<{ wallet: string; amount: number; reason: string; timestamp: Date }>;
}

class BuybackEngine {
  private ledger: BuybackRecord[] = [];
  private accumulated: AccumulatedFees = { totalSol: 0, sources: [] };
  private lastExecutionTime: number = 0;
  private totalTokensBurned: number = 0;
  private executionCount: number = 0;

  accumulateFee(wallet: string, solAmount: number, reason: string): void {
    this.accumulated.totalSol += solAmount;
    this.accumulated.sources.push({
      wallet,
      amount: solAmount,
      reason,
      timestamp: new Date(),
    });

    if (this.accumulated.totalSol >= BUYBACK.MIN_ACCUMULATION_SOL) {
      this.tryExecute();
    }
  }

  private tryExecute(): void {
    const now = Date.now();
    if (now - this.lastExecutionTime < BUYBACK.COOLDOWN_MS) return;
    if (this.accumulated.totalSol < BUYBACK.MIN_ACCUMULATION_SOL) return;

    const solToSpend = this.accumulated.totalSol;
    const simulatedPrice = this.getSimulatedTokenPrice();
    const tokensAcquired = Math.floor(solToSpend / simulatedPrice);
    const txSignature = generateMockTxSignature();

    const record: BuybackRecord = {
      id: `bb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      trigger: this.accumulated.sources.map((s) => s.reason).join("; "),
      solAmount: solToSpend,
      tokensAcquired,
      tokenPriceSol: simulatedPrice,
      txSignature,
      sourceWallet: PLATFORM.NAME.toLowerCase(),
      executedAt: new Date(),
    };

    this.ledger.push(record);
    this.totalTokensBurned += tokensAcquired;
    this.executionCount++;
    this.lastExecutionTime = now;

    this.accumulated = { totalSol: 0, sources: [] };

    eventBroadcaster.broadcast({
      type: SSE_EVENT_TYPES.BUYBACK_EXECUTED,
      category: "buyback",
      tag: "auto_buyback",
      message: `Auto-buyback executed: ${solToSpend.toFixed(4)} SOL → ${tokensAcquired.toLocaleString()} ${PLATFORM.TOKEN_SYMBOL} acquired via ${BUYBACK.DEX}`,
      txSignature,
    });
  }

  private getSimulatedTokenPrice(): number {
    const basePrice = 0.000198;
    const variance = (Math.random() - 0.5) * 0.00004;
    return Math.max(0.00005, basePrice + variance);
  }

  getStats(): {
    totalBuybacks: number;
    totalSolSpent: number;
    totalTokensAcquired: number;
    averagePrice: number;
    lastBuybackAt: string | null;
    pendingAccumulation: number;
  } {
    const totalSolSpent = this.ledger.reduce((sum, r) => sum + r.solAmount, 0);
    const avgPrice =
      this.ledger.length > 0
        ? this.ledger.reduce((sum, r) => sum + r.tokenPriceSol, 0) / this.ledger.length
        : 0;
    const lastEntry = this.ledger[this.ledger.length - 1];

    return {
      totalBuybacks: this.executionCount,
      totalSolSpent: Math.round(totalSolSpent * 10000) / 10000,
      totalTokensAcquired: this.totalTokensBurned,
      averagePrice: Math.round(avgPrice * 100000000) / 100000000,
      lastBuybackAt: lastEntry ? lastEntry.executedAt.toISOString() : null,
      pendingAccumulation: Math.round(this.accumulated.totalSol * 10000) / 10000,
    };
  }

  getRecentBuybacks(limit: number = 20): BuybackRecord[] {
    return this.ledger.slice(-limit).reverse();
  }

  getLedger(): BuybackRecord[] {
    return [...this.ledger];
  }
}

export const buybackEngine = new BuybackEngine();
