'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CategoryCard } from "@/components/category-card"
import { ProductCard } from "@/components/product-card"
import { set } from "zod"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [featuredCategories, setFeaturedCategories] = useState<any[]>([])
  async function fetchProduct() {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()

      // ✅ get products array from response
      const products = data.products || []

      // ✅ filter featured
      const featured = products.filter((p: any) => p.featured).slice(0, 8)

      setFeaturedProducts(featured)
    } catch (error) {
      console.error(error)
    }
  }
  async function  fetchCategory() {
    try {
    const res = await fetch('/api/categories') 
    if(!res.ok) throw new Error('Failed to fetch categories')
    const data = await res.json()
      setFeaturedCategories(data || [])
    } catch (error) {
      console.error(error) 
    }
  }

  useEffect(() => {
    fetchProduct()
    fetchCategory()
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="border-b" style={{ backgroundImage: `linear-gradient(135deg, var(--brand-start), var(--brand-end))` }}>
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2">
          <div className="text-white">
            <h1 className="text-3xl font-semibold md:text-4xl leading-tight">
              Professional Laboratory Equipment
            </h1>
            <p className="mt-3 text-sm md:text-base opacity-90">
              Premium-grade instruments for accurate, reliable research.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild className="bg-background text-foreground hover:bg-background/90">
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/categories">Explore Categories</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-card shadow">
              <Image
                src="/modern-laboratory-equipment.jpg"
                alt="Assorted laboratory equipment"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">Featured Products</h2>
            <p className="text-sm text-muted-foreground">High-performance equipment ready for your lab.</p>
          </div>
          <Button variant="link" asChild>
            <Link href="/products">Browse all</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((p: any) => (
            <ProductCard key={p.id} product={p} /> 
            // ⚠️ This assumes CategoryCard can display product.
            // If not, you should create a ProductCard component.
          ))}
        </div>
      
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <h1>featured category </h1>
          {/* {
            featuredCategories.map((c: any) => (
              <CategoryCard key={c.id} category={c} />
            ))
          } */}
        </div>

      </section>
    </>
  )
}
