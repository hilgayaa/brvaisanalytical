import { ShieldCheck, Truck, Headphones } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <section aria-label="Trust and features" className="grid gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
            <div>
              <p className="font-medium">Quality Assured</p>
              <p className="text-sm text-muted-foreground">Reliable equipment for critical research.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Headphones className="h-5 w-5 text-primary" aria-hidden />
            <div>
              <p className="font-medium">Expert Support</p>
              <p className="text-sm text-muted-foreground">Technical guidance from specialists.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-primary" aria-hidden />
            <div>
              <p className="font-medium">Fast Delivery</p>
              <p className="text-sm text-muted-foreground">Quick, secure shipping worldwide.</p>
            </div>
          </div>
        </section>

        <div className="mt-10 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Lab Equipment Store. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
