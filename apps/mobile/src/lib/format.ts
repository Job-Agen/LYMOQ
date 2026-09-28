import type { CardDto, CardStatus } from '@po/shared';

const pad = (n: number) => n.toString().padStart(2, '0');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Today, 10:42" / "Yesterday, 09:18" / "Jan 12, 09:18" */
export function formatDateTime(isoDate: string, now = new Date()): string {
  const d = new Date(isoDate);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (d.getTime() >= startOfToday) return `Today, ${time}`;
  if (d.getTime() >= startOfToday - 86_400_000) return `Yesterday, ${time}`;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${time}`;
}

/** "Expires in 42 min" / "Expires in 23h 12m" / "Expires in 6 days" / "Expired" */
export function formatTimeLeft(isoDate: string, now = Date.now()): string {
  const ms = new Date(isoDate).getTime() - now;
  if (ms <= 0) return 'Expired';
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 60) return `Expires in ${Math.max(1, minutes)} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `Expires in ${hours}h ${pad(minutes % 60)}m`;
  return `Expires in ${Math.floor(hours / 24)} days`;
}

export function greeting(now = new Date()): string {
  const h = now.getHours();
  if (h < 12) return 'Good morning,';
  if (h < 18) return 'Good afternoon,';
  return 'Good evening,';
}

export function paymentsLabel(max: number | null): string {
  if (max === null) return 'Until expiration';
  return `${max} payment${max > 1 ? 's' : ''}`;
}

export function paymentsUsage(card: Pick<CardDto, 'policy'>): string {
  const { maxTransactionCount, currentTransactionCount } = card.policy;
  if (maxTransactionCount === null) return `${currentTransactionCount} made · unlimited`;
  const left = Math.max(0, maxTransactionCount - currentTransactionCount);
  return `${left} of ${maxTransactionCount} remaining`;
}

export const STATUS_LABEL: Record<CardStatus, string> = {
  PENDING_FUNDING: 'Awaiting funding',
  ACTIVE: 'Active',
  FROZEN: 'Frozen',
  EXPIRED: 'Expired',
  TERMINATED: 'Closed',
};

export function merchantLabel(card: Pick<CardDto, 'policy'>): string {
  return card.policy.merchantRestriction ? `${card.policy.merchantRestriction.name} only` : 'Anywhere';
}
