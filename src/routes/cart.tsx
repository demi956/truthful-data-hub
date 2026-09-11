import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import placeholder from "@/assets/phone-placeholder.jpg";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatGHS } from "@/lib/format";
import { BUSINESS } from "@/lib/business";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Newton's Hub" },
      {
        name: "description",
        content: "Review the phones and accessories in your Newton's Hub cart before checking out.",
      },
      { property: "og:title", content: "Your cart — Newton's Hub" },
      { property: "og:description", content: "Review your Newton's Hub order before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQuantity, remove, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse phones, accessories and more.
        </p>
        <Button asChild className="mt-6">
          <Link to="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Your cart</h1>

      <div className="mt-8 space-y-3">
        {lines.map((line) => (
          <div key={line.variantId} className="surface-card flex items-center gap-4 p-4">
            <img
              src={line.imageUrl || placeholder}
              alt={line.name}
              loading="lazy"
              className="size-20 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{line.name}</p>
              <p className="text-sm text-muted-foreground">{line.variantLabel}</p>
              <p className="mt-1 text-sm font-semibold">{formatGHS(line.unitPrice)}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                aria-label="Decrease quantity"
                onClick={() => setQuantity(line.variantId, line.quantity - 1)}
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">{line.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                aria-label="Increase quantity"
                onClick={() => setQuantity(line.variantId, line.quantity + 1)}
              >
                <Plus className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Remove item"
                onClick={() => remove(line.variantId)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="surface-card mt-8 p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">{formatGHS(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{BUSINESS.deliveryNote}</p>
        <Button asChild className="mt-5 w-full" size="lg">
          <Link to="/checkout">Continue to checkout</Link>
        </Button>
      </div>
    </div>
  );
}
