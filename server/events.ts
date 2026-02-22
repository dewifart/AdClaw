import type { Response } from "express";

type SSEClient = {
  id: string;
  res: Response;
};

class EventBroadcaster {
  private clients: SSEClient[] = [];

  addClient(res: Response): string {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.clients.push({ id, res });
    
    res.on("close", () => {
      this.clients = this.clients.filter(c => c.id !== id);
    });

    return id;
  }

  broadcast(event: {
    type: string;
    category: string;
    tag: string;
    message: string;
    soulId?: string;
    soulName?: string;
    wallet?: string;
    solAmount?: string;
    txSignature?: string;
    timestamp?: string;
  }) {
    const data = JSON.stringify({
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
    });

    this.clients.forEach(client => {
      try {
        client.res.write(`data: ${data}\n\n`);
      } catch {
        this.clients = this.clients.filter(c => c.id !== client.id);
      }
    });
  }

  getClientCount(): number {
    return this.clients.length;
  }
}

export const eventBroadcaster = new EventBroadcaster();
