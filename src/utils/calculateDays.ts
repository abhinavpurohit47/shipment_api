export function CalculateExpectedDays(
  fromDate: Date | string,
  toDate: Date | string,
): number {
  if (typeof fromDate === 'string') {
    fromDate = new Date(fromDate);
  }
  if (typeof toDate === 'string') {
    toDate = new Date(toDate);
  }

  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  const fromTime = fromDate.getTime();
  const toTime = toDate.getTime();
  const differenceInDays = Math.round(Math.abs((fromTime - toTime) / oneDay));
  return differenceInDays;
}
