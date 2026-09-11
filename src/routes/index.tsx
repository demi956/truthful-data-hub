import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Repeat2, ShieldCheck, Smartphone, Wifi } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard, type CatalogProduct } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { listProducts } from "@/lib/catalog.functions";
import { BUSINESS } from "@/lib/business";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Newton's Hub — Phones, Accessories & Data in Ghana" },
      {
        name: "description",
        content:
          "Buy, sell or swap phones with Newton's Hub. Quality phones, accessories, MTN data bundles and AFA registration. Pickup in Breman Essiam & Tarkwa, delivery Ghana-wide.",
      },
      { property: "og:title", content: "Newton's Hub — Phones, Accessories & Data" },
      {
        property: "og:description",
        content: "We buy, we sell, we swap. Where quality meets affordability.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const fetchProducts = useServerFn(listProducts);
  const { data, isLoading } = useQuery({
    queryKey: ["products", "home"],
    queryFn: () => fetchProducts({ data: {} }),
  });

  const phones = (data ?? []).filter((p) => p.subcategory === "Phones").slice(0, 4);
  const accessories = (data ?? []).filter((p) => p.subcategory !== "Phones").slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src={heroBg}
          alt="Phones on display at Newton's Hub"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gradient-gold">
            {BUSINESS.name}
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl">
            We buy. We sell. We swap.
          </h1>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80">
            Where quality meets affordability. Phones, accessories, data bundles and AFA
            registration — pickup in Breman Essiam and Tarkwa, delivery across Ghana.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/shop">
                Shop now <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/buy-sell-swap">Sell or swap your phone</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Smartphone, title: "Quality phones", text: "New and pre-owned, honestly described." },
          { icon: Repeat2, title: "Swap your device", text: "Bring your phone in, we appraise it in person." },
          { icon: Wifi, title: "Data & AFA", text: "MTN data bundles and AFA registration." },
          { icon: ShieldCheck, title: "3-day returns", text: BUSINESS.returnPolicy },
        ].map((f) => (
          <div key={f.title} className="surface-card p-5">
            <f.icon className="size-6 text-accent" />
            <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>

      <Section title="Phones" href="/shop" loading={isLoading} products={phones} />
      <Section title="Accessories" href="/shop" loading={isLoading} products={accessories} />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="surface-card flex flex-col items-start gap-4 bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Need data or AFA registration?</h2>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Choose a bundle, tell us the number, and we activate it.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg">
            <Link to="/bundles">View bundles</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function Section({
  title,
  href,
  products,
  loading,
}: {
  title: string;
  href: string;
  products: CatalogProduct[];
  loading: boolean;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <Link to={href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-xl" />)
          : products.map((p) => <ProductCard key={p.id} product={p as CatalogProduct} />)}
      </div>
    </section>
  );
}
