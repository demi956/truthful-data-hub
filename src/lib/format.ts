export function formatGHS(amount: number | string | null | undefined): string {
  const value = typeof amount === "string" ? Number(amount) : (amount ?? 0);
  if (!Number.isFinite(value)) return "GH₵ 0.00";
  return `GH₵ ${value.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function availabilityLabel(status: string | null | undefined): string {
  switch (status) {
    case "in_stock":
      return "In stock";
    case "low_stock":
      return "Low stock";
    case "out_of_stock":
      return "Out of stock";
    case "available_on_request":
      return "Available on request";
    case "pre_order":
      return "Pre-order";
    default:
      return status ? status.replace(/_/g, " ") : "Ask availability";
  }
}
