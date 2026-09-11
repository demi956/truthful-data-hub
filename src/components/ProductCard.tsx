import { Link } from "@tanstack/react-router";
import placeholder from "@/assets/phone-placeholder.jpg";
import { Badge } from "@/components/ui/badge";
import { availabilityLabel, formatGHS } from "@/lib/format";

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  subcategory: string | null;
  variants: Array<{
    price: number | string;
    sale_price: number | string | null;
    availability_status: string | null;
    active: boolean | null;
  }>;
  images: Array<{ image_url: string; is_primary: boolean | null; sort_order: number | null }>;
};

export function ProductCard({ product }: { product: CatalogProduct }) {
  const active = product.variants.filter((v) => v.active !== false);
  const prices = active.map((v) => Number(v.sale_price ?? v.price)).filter(Number.isFinite);
  const from = prices.length ? Math.min(...prices) : null;
  const image =
    [...product.images].sort(
      (a, b) => Number(b.is_primary) - Number(a.is_primary) || (a.sort_order ?? 0) - (b.sort_order ?? 0),
    )[0]?.image_url ?? placeholder;
  const status = active[0]?.availability_status ?? null;

  return (
    <Link
      to="/shop/$slug"
      params={{ slug: product.slug }}
      className="group surface-card overflow-hidden transition-transform hover:-translate-y-0.5"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.brand ?? product.subcategory}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold">{product.name}</h3>
        <div className="flex items-center justify-between pt-1">
          <span className="font-display text-base font-semibold">
            {from !== null ? formatGHS(from) : "Ask price"}
          </span>
          {status && (
            <Badge variant="secondary" className="text-[11px]">
              {availabilityLabel(status)}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
