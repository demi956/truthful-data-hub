import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import placeholder from "@/assets/phone-placeholder.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductBySlug } from "@/lib/catalog.functions";
import { availabilityLabel, formatGHS } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { BUSINESS, whatsappLink } from "@/lib/business";

export const Route = createFileRoute("/shop/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${prettify(params.slug)} — Newton's Hub` },
      {
        name: "description",
        content: `${prettify(params.slug)} available at Newton's Hub. See the price in Ghana cedis, condition and availability, then order online.`,
      },
      { property: "og:title", content: `${prettify(params.slug)} — Newton's Hub` },
      {
        property: "og:description",
        content: `${prettify(params.slug)} at Newton's Hub — quality meets affordability.`,
      },
    ],
  }),
  component: ProductPage,
});

function prettify(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function ProductPage() {
  const { slug } = Route.useParams();
  const fetchProduct = useServerFn(getProductBySlug);
  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct({ data: { slug } }),
  });
  const cart = useCart();
  const [variantId, setVariantId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Product not found</h1>
        <Button asChild className="mt-6">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    );
  }

  const variants = (data.variants ?? []).filter((v) => v.active !== false);
  const selected = variants.find((v) => v.id === variantId) ?? variants[0];
  const price = selected ? Number(selected.sale_price ?? selected.price) : null;
  const image =
    [...(data.images ?? [])].sort(
      (a, b) => Number(b.is_primary) - Number(a.is_primary) || (a.sort_order ?? 0) - (b.sort_order ?? 0),
    )[0]?.image_url ?? placeholder;
  const specs = (data.specifications ?? {}) as Record<string, unknown>;
  const soldOut = selected?.availability_status === "out_of_stock";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="surface-card overflow-hidden">
          <img src={image} alt={data.name} className="aspect-square w-full object-cover" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {data.brand ?? data.subcategory}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold">{data.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="font-display text-3xl font-semibold">
              {price !== null ? formatGHS(price) : "Ask price"}
            </span>
            {selected?.availability_status && (
              <Badge variant="secondary">{availabilityLabel(selected.availability_status)}</Badge>
            )}
          </div>

          {variants.length > 1 && (
            <div className="mt-6">
              <p className="text-sm font-medium">Choose an option</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {variants.map((v) => (
                  <Button
                    key={v.id}
                    size="sm"
                    variant={selected?.id === v.id ? "default" : "outline"}
                    onClick={() => setVariantId(v.id)}
                  >
                    {[v.storage, v.color, v.condition].filter(Boolean).join(" · ") || v.sku}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selected && (
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {selected.condition && <Detail label="Condition" value={selected.condition} />}
              {selected.storage && <Detail label="Storage" value={selected.storage} />}
              {selected.color && <Detail label="Colour" value={selected.color} />}
              {selected.network_lock && <Detail label="Network" value={selected.network_lock} />}
              {selected.battery_health_percent != null && (
                <Detail label="Battery health" value={`${selected.battery_health_percent}%`} />
              )}
            </dl>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              disabled={!selected || soldOut}
              onClick={() => {
                if (!selected) return;
                cart.add({
                  variantId: selected.id,
                  productSlug: data.slug,
                  name: data.name,
                  variantLabel:
                    [selected.storage, selected.color, selected.condition].filter(Boolean).join(" · ") ||
                    "Standard",
                  unitPrice: Number(selected.sale_price ?? selected.price),
                  quantity: 1,
                  imageUrl: image,
                });
                toast.success("Added to cart");
              }}
            >
              {soldOut ? "Out of stock" : "Add to cart"}
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href={whatsappLink(`Hello ${BUSINESS.name}, I'm interested in the ${data.name}.`)}
                target="_blank"
                rel="noreferrer"
              >
                Ask on WhatsApp
              </a>
            </Button>
          </div>

          {data.description && (
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">{data.description}</p>
          )}

          {Object.keys(specs).length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold">Specifications</h2>
              <dl className="mt-3 space-y-2 text-sm">
                {Object.entries(specs)
                  .filter(([key]) => !["source_url", "region_note"].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex gap-3 border-b border-border pb-2">
                      <dt className="w-40 shrink-0 capitalize text-muted-foreground">
                        {key.replace(/_/g, " ")}
                      </dt>
                      <dd>{String(value)}</dd>
                    </div>
                  ))}
              </dl>
              {typeof specs["region_note"] === "string" && (
                <p className="mt-3 text-xs text-muted-foreground">{String(specs["region_note"])}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium capitalize">{value}</dd>
    </div>
  );
}
