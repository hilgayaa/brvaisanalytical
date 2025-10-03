"use client"
import useSWR from "swr"
import { useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { CategoryList } from "@/components/category-list" // Import CategoryList component
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

type Category = {
  id: string
  name: string
  children?: Category[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  return res.json()
}

interface FilterSidebarProps {
  className?: string
}

export function FilterSidebar({ className }: FilterSidebarProps) {
  const sp = useSearchParams()
  const router = useRouter()
  const selectedCategory = sp.get("category")
  const [open, setOpen] = useState(false)

  const { data } = useSWR<Category[]>(`/api/categories?hierarchy=true`, fetcher)
  const categories = (data || []) as Category[]

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(sp as any)

    if (selectedCategory === categorySlug) {
      params.delete("category")
    } else {
      params.set("category", categorySlug)
      params.set("page", "1")
    }

    router.push(`/products?${params.toString()}`)
    setOpen(false) // close mobile sheet if open
  }

  const clearFilters = () => {
    router.push("/products")
    setOpen(false)
  }

  const CategorySection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Categories</h2>
        {selectedCategory && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        <CategoryList nodes={categories} selectedId={selectedCategory || undefined} onSelect={handleCategoryClick} />
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile: Sheet-triggered category sidebar */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-transparent">
              <span>Categories</span>
              {selectedCategory ? <span className="text-xs text-muted-foreground">Selected</span> : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[18rem]">
            <SheetHeader>
              <SheetTitle>Categories</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <CategorySection />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: persistent sidebar */}
      <aside className={cn("space-y-6 hidden md:block", className)}>
        <CategorySection />
      </aside>
    </>
  )
}
