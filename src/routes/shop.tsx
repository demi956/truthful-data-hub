import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard, type CatalogProduct } from "@/components/ProductCard";
import { listProducts } from "@/lib/catalog.functions";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop phones & accessories — Newton's Hub" },
      {
        name: "description",
        content:
          "Browse phones and accessories in stock at Newton's Hub, with clear prices in Ghana cedis and live availability.",
      },
      { property: "og:title", content: "Shop phones & accessories — Newton's Hub" },
      {
        property: "og:description",
        content: "Phones, earbuds, cables, covers and more from Newton's Hub.",
      },
    ],
  }),
  component: Shop,
});

const FILTERS = ["All", "Phones", "Accessories"] as const;

function Shop() {
  const fetchProducts = useServerFn(listProducts);
  const { data, isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => fetchProducts({ data: {} }),
  });
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [search, setSearch] = useState("");

  const products = useMemo(() => {
    let rows = (data ?? []) as CatalogProduct[];
    if (filter === "Phones") rows = rows.filter((p) => p.subcategory === "Phones");
    if (filter === "Accessories") rows = rows.filter((p) => p.subcategory !== "Phones");
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.brand ?? "").toLowerCase().includes(q),
      );
    }
    return rows;
  }, [data, filter, search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Shop</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Prices are in Ghana cedis. Ask us on WhatsApp if you want to negotiate.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search phones or accessories"
          className="max-w-xs"
        />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))
          : products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {!isLoading && products.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Nothing matches that search yet.
        </p>
      )}
    </div>
  );
}
