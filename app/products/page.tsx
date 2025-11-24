"use client"

import useSWR from "swr"
import { useSearchParams, useRouter } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { FilterSidebar } from "@/components/filter-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { CarouselHero } from "@/components/carousel-hero"

const fetcher = async (url: string) => {
  try {
    
  const res = await fetch(url)

  console.log(res, 'check product or response') // this logs the Response object
  const data = await res.json()
  console.log(data, 'parsed data') // this logs your JSON data (items, total, etc.)
  return data
  } catch (error) {
    console.log(error)  ;
  }
}


export default function ProductsPage() {
  const [isMdOrLess, setIsMdOrLess] = useState(false);
  const sp = useSearchParams()
  const router = useRouter()
  const page = Number(sp.get("page") || "1")
  const limit = Number(sp.get("limit") || "12")
  const qs = sp.toString()
  const { data } = useSWR(`/api/products?${qs || `page=${page}&limit=${limit}`}`, fetcher)
  const items = data?.products ?? data ?? []
  if (!Array.isArray(items)) {
    return (
      <>
        <h1>
          item doesnot exists
        </h1>
      </>
    )
  }
  const total = data?.total || 0
  function handleCategoryClick(categorySlug: string) {
    const params = new URLSearchParams(sp as any)

    if (sp.get("category") === categorySlug) {
      params.delete("category")
    } else {
      params.set("category", categorySlug)
      params.set("page", "1")
    }

    router.push(`/products?${params.toString()}`)
  } 
  const nextPage = () => {
    const params = new URLSearchParams(sp as any)
    params.set("page", String(page + 1))
    router.push(`/products?${params.toString()}`)
  }

   useEffect(() => {
    const media = window.matchMedia("(min-width: 769px)");

    console.log("Media matches:", media.matches);
    setIsMdOrLess(media.matches);

    const listener = () => setIsMdOrLess(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <CarouselHero/>
      <div className="mt-4 grid gap-6 md:grid-cols-[280px_1fr]">
        <FilterSidebar hidden={isMdOrLess} handleCategoryClick={handleCategoryClick} className="sticky top-[5rem] max-h-[70vh] space-y-6 overflow-auto pr-2" />
        <section aria-label="Products grid" className="space-y-4">
          <h1 className="text-balance text-xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            {total} result{total === 1 ? "" : "s"} found
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols- xl:grid-cols-3">
            {items.map((p: any) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          {items.length < total ? (
            <div className="flex justify-center">
              <Button onClick={nextPage} variant="outline">
                Load more
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
