import { PROMOTION_PLATFORMS, AGENTS_PER_CAMPAIGN, SSE_EVENT_TYPES } from "../config/constants";
import type { PromotionPlatform } from "../config/constants";
import { eventBroadcaster } from "../events";

interface CampaignAgent {
  agentId: string;
  handle: string;
  platform: PromotionPlatform;
  assignedAt: Date;
  postsCount: number;
  totalImpressions: number;
}

interface Campaign {
  id: string;
  tokenName: string;
  tokenId: string;
  ownerWallet: string;
  agents: CampaignAgent[];
  status: "active" | "paused" | "completed";
  createdAt: Date;
  totalImpressions: number;
  totalPosts: number;
}

const AGENT_HANDLES = [
  "@claw_alpha", "@claw_bravo", "@claw_charlie",
  "@claw_delta", "@claw_echo", "@claw_foxtrot",
  "@claw_golf", "@claw_hotel", "@claw_india",
  "@claw_juliet", "@claw_kilo", "@claw_lima",
];

const POST_TEMPLATES: Record<PromotionPlatform, string[]> = {
  x: [
    "Just discovered ${token} on @adclawonsol — the autonomous promotion is real 🔥",
    "${token} chart looking bullish. AdClaw agents are doing their thing across 4 platforms.",
    "New launch alert: ${token} via AdClaw. All fees go to $ADCLAW buyback. No dev wallet.",
    "The ${token} community is growing fast. Swarm promotion hitting different.",
  ],
  telegram: [
    "🚀 ${token} just launched via AdClaw — agents are promoting across all channels",
    "New listing: ${token}. Check the chart on DEXScreener. Backed by AdClaw swarm.",
    "${token} update — promotion cycle active, engagement climbing steadily.",
  ],
  discord: [
    "${token} launched on AdClaw. Discussion thread open in #new-listings.",
    "Chart update for ${token} — volume picking up. AdClaw agents pushing awareness.",
    "Reminder: ${token} launch fees went directly to $ADCLAW buyback. Transparent model.",
  ],
  reddit: [
    "[DD] ${token} — New AdClaw community launch with full swarm promotion",
    "Analysis of ${token} tokenomics and AdClaw's autonomous promotion model",
    "${token} — Why this community-launched token stands out from the noise",
  ],
};

function assignPlatform(index: number): PromotionPlatform {
  const distribution: PromotionPlatform[] = ["x", "x", "telegram", "discord", "reddit", "x"];
  return distribution[index % distribution.length];
}

function selectHandle(index: number): string {
  return AGENT_HANDLES[index % AGENT_HANDLES.length];
}

class PromotionService {
  private campaigns: Map<string, Campaign> = new Map();
  private globalPostCount: number = 0;
  private globalImpressions: number = 0;

  createCampaign(tokenName: string, tokenId: string, ownerWallet: string): Campaign {
    const campaignId = `camp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

    const agents: CampaignAgent[] = [];
    for (let i = 0; i < AGENTS_PER_CAMPAIGN; i++) {
      const platform = assignPlatform(i);
      const handle = selectHandle(agents.length + this.campaigns.size * AGENTS_PER_CAMPAIGN);

      agents.push({
        agentId: `agent_${campaignId}_${i}`,
        handle,
        platform,
        assignedAt: new Date(),
        postsCount: 0,
        totalImpressions: 0,
      });

      eventBroadcaster.broadcast({
        type: SSE_EVENT_TYPES.AGENT_ASSIGNED,
        category: "agent",
        tag: "agent_assigned",
        message: `Agent ${handle} assigned to promote ${tokenName} on ${platform}`,
      });
    }

    const campaign: Campaign = {
      id: campaignId,
      tokenName,
      tokenId,
      ownerWallet,
      agents,
      status: "active",
      createdAt: new Date(),
      totalImpressions: 0,
      totalPosts: 0,
    };

    this.campaigns.set(campaignId, campaign);
    return campaign;
  }

  simulatePost(campaignId: string): void {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign || campaign.status !== "active") return;

    const agent = campaign.agents[Math.floor(Math.random() * campaign.agents.length)];
    const templates = POST_TEMPLATES[agent.platform];
    const template = templates[Math.floor(Math.random() * templates.length)];
    const content = template.replace(/\$\{token\}/g, campaign.tokenName);
    const impressions = Math.floor(Math.random() * 5000 + 200);

    agent.postsCount++;
    agent.totalImpressions += impressions;
    campaign.totalPosts++;
    campaign.totalImpressions += impressions;
    this.globalPostCount++;
    this.globalImpressions += impressions;

    eventBroadcaster.broadcast({
      type: SSE_EVENT_TYPES.PROMOTION_POSTED,
      category: "agent",
      tag: "promotion_post",
      message: `${agent.handle} posted on ${agent.platform}: "${content.slice(0, 80)}..." (${impressions.toLocaleString()} impressions)`,
    });
  }

  getCampaign(campaignId: string): Campaign | undefined {
    return this.campaigns.get(campaignId);
  }

  getActiveCampaigns(): Campaign[] {
    return Array.from(this.campaigns.values()).filter((c) => c.status === "active");
  }

  getStats(): {
    activeCampaigns: number;
    totalCampaigns: number;
    totalPosts: number;
    totalImpressions: number;
    totalAgentsDeployed: number;
  } {
    return {
      activeCampaigns: this.getActiveCampaigns().length,
      totalCampaigns: this.campaigns.size,
      totalPosts: this.globalPostCount,
      totalImpressions: this.globalImpressions,
      totalAgentsDeployed: this.campaigns.size * AGENTS_PER_CAMPAIGN,
    };
  }
}

export const promotionService = new PromotionService();
