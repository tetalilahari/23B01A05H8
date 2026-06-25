/**
 * priority_inbox.ts
 * Fetches notifications and returns top 10 by priority using Min-Heap.
 * Run: npx ts-node priority_inbox.ts
 */

const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const TOKEN   = "YOUR_BEARER_TOKEN_HERE"; // ← paste your actual token here

type NotifType = "Placement" | "Result" | "Event";

interface Notification {
  ID: string;
  Type: NotifType;
  Message: string;
  Timestamp: string;
}

interface ScoredNotification extends Notification {
  priorityScore: number;
}

const TYPE_WEIGHT: Record<NotifType, number> = {
  Placement: 100,
  Result:    60,
  Event:     20,
};

function recencyScore(timestamp: string): number {
  const ageDays = (Date.now() - new Date(timestamp).getTime()) / 86_400_000;
  return Math.max(0, 50 - ageDays * 2);
}

function computeScore(n: Notification): number {
  return parseFloat(
    (TYPE_WEIGHT[n.Type] + recencyScore(n.Timestamp)).toFixed(2)
  );
}

class MinHeap {
  private heap: ScoredNotification[] = [];
  constructor(private readonly maxSize: number) {}

  private parent = (i: number) => Math.floor((i - 1) / 2);
  private left   = (i: number) => 2 * i + 1;
  private right  = (i: number) => 2 * i + 2;

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private bubbleUp(i: number) {
    while (
      i > 0 &&
      this.heap[this.parent(i)].priorityScore > this.heap[i].priorityScore
    ) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  private sinkDown(i: number) {
    let min = i;
    const l = this.left(i);
    const r = this.right(i);
    if (l < this.heap.length && this.heap[l].priorityScore < this.heap[min].priorityScore) min = l;
    if (r < this.heap.length && this.heap[r].priorityScore < this.heap[min].priorityScore) min = r;
    if (min !== i) { this.swap(i, min); this.sinkDown(min); }
  }

  push(item: ScoredNotification): void {
    if (this.heap.length < this.maxSize) {
      this.heap.push(item);
      this.bubbleUp(this.heap.length - 1);
    } else if (item.priorityScore > this.heap[0].priorityScore) {
      this.heap[0] = item;
      this.sinkDown(0);
    }
  }

  getTopN(): ScoredNotification[] {
    return [...this.heap].sort((a, b) => b.priorityScore - a.priorityScore);
  }
}

async function main(topN = 10): Promise<void> {
  console.log("\n[INFO] Fetching notifications...\n");

  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const data = await res.json();
  const notifications: Notification[] = data.notifications ?? [];
  console.log(`[INFO] Total fetched: ${notifications.length}\n`);

  const heap = new MinHeap(topN);
  for (const n of notifications) {
    heap.push({ ...n, priorityScore: computeScore(n) });
  }

  const results = heap.getTopN();

  console.log(`════════════════════════════════`);
  console.log(`  TOP ${topN} PRIORITY NOTIFICATIONS`);
  console.log(`════════════════════════════════\n`);

  results.forEach((n, i) => {
    console.log(`#${i + 1}  [${n.Type}]  Score: ${n.priorityScore}`);
    console.log(`    Message  : ${n.Message}`);
    console.log(`    Timestamp: ${n.Timestamp}`);
    console.log(`    ID       : ${n.ID}`);
    console.log();
  });
}

main(10).catch((err) => {
  console.error("[FATAL]", err);
  
});