export const generateTicketNumber = (count: number): string => {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const datePrefix = `${year}${month}${day}`;

  const sequence = String(count + 1).padStart(3, '0');
  return `TCK-${datePrefix}-${sequence}`;
};
