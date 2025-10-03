"use client"

import type React from "react"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Menu, Microscope, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const router = useRouter()
  const sp = useSearchParams()
  const [q, setQ] = useState(sp.get("q") || "")
  const [open, setOpen] = useState(false)

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const qs = q ? `?q=${encodeURIComponent(q)}` : ""
    router.push(`/products${qs}`)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <Microscope className="h-6 w-6 text-primary" aria-hidden />
          <span className="text-balance">Lab Equipment</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 text-sm md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden min-w-[320px] max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search products"
              className="pl-8"
              placeholder="Search equipment..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </form>

        <div className="ml-auto md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-primary" />
                  Lab Equipment
                </SheetTitle>
              </SheetHeader>

              <form onSubmit={submit} className="mt-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    aria-label="Search products"
                    className="pl-8"
                    placeholder="Search equipment..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
                <Button type="submit" className="mt-3 w-full">
                  Search
                </Button>
              </form>

              <nav className="mt-6 grid gap-2">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
