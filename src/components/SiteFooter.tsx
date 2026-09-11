import { Link } from "@tanstack/react-router";
import { BUSINESS } from "@/lib/business";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-base font-semibold">{BUSINESS.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{BUSINESS.tagline}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" className="hover:text-foreground">
                Phones & accessories
              </Link>
            </li>
            <li>
              <Link to="/bundles" className="hover:text-foreground">
                Data bundles & AFA
              </Link>
            </li>
            <li>
              <Link to="/buy-sell-swap" className="hover:text-foreground">
                Sell or swap a phone
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Reach us</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>{BUSINESS.phone}</li>
            <li>{BUSINESS.secondaryPhone}</li>
            <li>{BUSINESS.email}</li>
            <li>
              <a href={BUSINESS.instagramUrl} className="hover:text-foreground">
                {BUSINESS.instagram}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Pickup & delivery</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {BUSINESS.pickupLocations.map((p) => (
              <li key={p}>{p}</li>
            ))}
            <li>Delivery available across Ghana.</li>
            <li>{BUSINESS.deliveryNote}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {BUSINESS.name}. {BUSINESS.returnPolicy}
      </div>
    </footer>
  );
}
