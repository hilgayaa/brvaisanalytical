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
  parentId?:string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  console.log(res, 'check category response') // this logs the Response object
  return res.json()
}


export function FilterSidebar({ className,handleCategoryClick,hidden }: {
  className:string,
  hidden:boolean,
  handleCategoryClick: (categorySlug: string) => void
}) {
  const sp = useSearchParams()
  const router = useRouter()
  const selectedCategory = sp.get("category")
  const [open, setOpen] = useState(false)

  const { data } = useSWR<Category[]>(`/api/categories/hirearchy`, fetcher)
  const categories = (data || []) as Category[]


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
      <div className={hidden?"hidden":"block"} >
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-transparent">
              <span>Categories</span>
              {selectedCategory ? <span className="text-xs text-muted-foreground">Selected</span> : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[18rem] bg-white">
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
      <aside className={cn(`space-y-6 ${!hidden ? "hidden" : "block"} `, className)}>
        <CategorySection />
      </aside>
    </>
  )
}
