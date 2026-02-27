import { storage } from "../storage";
import { calculateScore, generateBreakdown } from "./scoreEngine";
import { buybackEngine } from "./buybackEngine";
import { promotionService } from "./agentPromotion";
import { eventBroadcaster } from "../events";
import { generateMockMintAddress, generateArweaveHash, shortenAddress } from "../utils/wallet";
import { contentHash } from "../utils/crypto";
import { LAUNCH_FEE_SOL, SSE_EVENT_TYPES, AGENTS_PER_CAMPAIGN } from "../config/constants";
import type { TokenLaunchRequest, TokenLaunchResponse } from "../types/api";

interface LaunchResult {
  success: boolean;
  data?: TokenLaunchResponse;
  error?: string;
}

export async function launchToken(request: TokenLaunchRequest): Promise<LaunchResult> {
  const {
    name,
    description,
    soul_content,
    memory_content,
    owner_wallet,
    image_url,
  } = request;

  const score = calculateScore(soul_content, memory_content);
  const breakdown = generateBreakdown(soul_content, memory_content);

  const mintAddress = generateMockMintAddress();
  const arweaveHash = generateArweaveHash();
  const identityHash = contentHash(soul_content, memory_content);

  const soul = await storage.createSoul({
    name,
    description: description || `Community token: ${name}`,
    soulContent: soul_content,
    memoryContent: memory_content,
    ownerWallet: owner_wallet,
    soulScore: score,
    mintAddress,
    arweaveHash,
    isListed: true,
    price: LAUNCH_FEE_SOL.toString(),
    imageUrl: image_url || null,
  });

  const shortWallet = shortenAddress(owner_wallet);
  const launchMessage = `${shortWallet} launched "${name}". Score: ${score}. Mint: ${mintAddress}. Agents assigned: ${AGENTS_PER_CAMPAIGN}.`;

  await storage.createForgeLog({
    wallet: owner_wallet,
    action: "token_launch",
    category: "launching",
    soulId: soul.id,
    soulName: name,
    solAmount: LAUNCH_FEE_SOL.toString(),
    txSignature: null,
    message: launchMessage,
  });

  eventBroadcaster.broadcast({
    type: SSE_EVENT_TYPES.TOKEN_LAUNCHED,
    category: "launching",
    tag: "token_launch",
    message: launchMessage,
    soulId: soul.id,
    soulName: name,
    wallet: owner_wallet,
    solAmount: LAUNCH_FEE_SOL.toString(),
  });

  buybackEngine.accumulateFee(owner_wallet, LAUNCH_FEE_SOL, `${name} launch fee`);

  const campaign = promotionService.createCampaign(name, soul.id, owner_wallet);

  return {
    success: true,
    data: {
      id: soul.id,
      name: soul.name,
      description: soul.description,
      score,
      score_breakdown: breakdown,
      owner_wallet: soul.ownerWallet,
      mint_address: mintAddress,
      agents_assigned: campaign.agents.length,
      created_at: soul.createdAt.toISOString(),
    },
  };
}

export async function getTokenById(id: string) {
  const soul = await storage.getSoulById(id);
  if (!soul) return null;

  const breakdown = generateBreakdown(soul.soulContent, soul.memoryContent);

  return {
    ...soul,
    score_breakdown: breakdown,
    identity_hash: contentHash(soul.soulContent, soul.memoryContent),
  };
}

export async function listTokens(ownerWallet?: string) {
  if (ownerWallet) {
    return storage.getSoulsByOwner(ownerWallet);
  }
  return storage.getAllSouls();
}

export async function getListedTokens() {
  return storage.getListedSouls();
}
