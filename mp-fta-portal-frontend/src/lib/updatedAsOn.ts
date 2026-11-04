/** "Updated as on" date shown beside every tariff rate: always the day before today (user's choice). */
export function updatedAsOnDate(now: Date = new Date()): Date {
  const d = new Date(now);
  d.setDate(d.getDate() - 1);
  return d;
}

export const updatedAsOnLabel = (now: Date = new Date()) =>
  `Updated as on ${updatedAsOnDate(now).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
