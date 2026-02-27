import { SCORE, SCORE_WEIGHTS } from "../config/constants";
import type { ScoreBreakdown, ScoreDimension } from "../types/api";
import { clamp } from "../utils/formatters";

type ScoreCategory = keyof typeof SCORE_WEIGHTS;

function countKeywordMatches(text: string, keywords: readonly string[]): string[] {
  return keywords.filter((keyword) => text.includes(keyword));
}

function measureContentDepth(content: string): number {
  let depth = 0;

  const headings = (content.match(/^#{1,3}\s/gm) || []).length;
  depth += headings * 50;

  const codeBlocks = (content.match(/```/g) || []).length / 2;
  depth += Math.floor(codeBlocks) * 30;

  const bulletPoints = (content.match(/^[\s]*[-*]\s/gm) || []).length;
  depth += Math.min(bulletPoints * 8, 120);

  const lines = content.split("\n").filter((l) => l.trim().length > 0).length;
  depth += Math.min(lines * 2, 100);

  return depth;
}

export function calculateScore(soulContent: string, memoryContent: string): number {
  const combined = (soulContent + memoryContent).toLowerCase();
  let score = 0;

  for (const [, config] of Object.entries(SCORE_WEIGHTS)) {
    const matches = countKeywordMatches(combined, config.keywords);
    score += matches.length * config.multiplier;
  }

  score += Math.min(soulContent.length / 5, 500);
  score += Math.min(memoryContent.length / 8, 300);

  score += measureContentDepth(soulContent);
  score += measureContentDepth(memoryContent) * 0.6;

  return clamp(Math.round(score), SCORE.MIN, SCORE.MAX);
}

export function generateBreakdown(
  soulContent: string,
  memoryContent: string
): ScoreBreakdown {
  const combined = (soulContent + memoryContent).toLowerCase();

  const breakdown: Record<string, ScoreDimension> = {};

  for (const [key, config] of Object.entries(SCORE_WEIGHTS)) {
    const matches = countKeywordMatches(combined, config.keywords);
    const rawScore = matches.length / config.keywords.length;

    breakdown[key] = {
      score: Math.round(rawScore * 1000 * config.weight),
      max: Math.round(1000 * config.weight),
      matches: [...matches],
    };
  }

  return breakdown as unknown as ScoreBreakdown;
}

export function getTier(score: number): { label: string; color: string } {
  if (score >= SCORE.TIERS.S.min) return SCORE.TIERS.S;
  if (score >= SCORE.TIERS.A.min) return SCORE.TIERS.A;
  if (score >= SCORE.TIERS.B.min) return SCORE.TIERS.B;
  return SCORE.TIERS.C;
}

export function compareScores(
  a: { soulContent: string; memoryContent: string },
  b: { soulContent: string; memoryContent: string }
): { scoreA: number; scoreB: number; delta: number; winner: "a" | "b" | "tie" } {
  const scoreA = calculateScore(a.soulContent, a.memoryContent);
  const scoreB = calculateScore(b.soulContent, b.memoryContent);
  const delta = scoreA - scoreB;

  return {
    scoreA,
    scoreB,
    delta: Math.abs(delta),
    winner: delta > 0 ? "a" : delta < 0 ? "b" : "tie",
  };
}
