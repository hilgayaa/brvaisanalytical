"use client"
import { CategoryCard } from "@/components/category-card"
import useSWR from "swr"

interface Category {
  id: string
  slug: string
  name: string
  image?: string
  description?: string | null
  parentId?: string | null
  _count?: {
    products: number
  }
  children?: Category[]
}

export default function CategoriesPage() {
  const fetcher = async (url: string) => {
    const res = await fetch(url)
    const data = await res.json()
    return data
  }

  const { data } = useSWR<Category[]>(`/api/categories/hirearchy`, fetcher)
  const categories = data || []

  if (!Array.isArray(categories)) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground">No categories available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Categories</h1>
      <p className="text-sm text-muted-foreground mt-2">Browse our equipment categories and subcategories.</p>

      <div className="mt-8 space-y-12">
        {categories.map((parentCategory) => (
          <div key={parentCategory.id}>
            {/* Parent Category */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">{parentCategory.name}</h2>
              {parentCategory.description && (
                <p className="text-sm text-muted-foreground">{parentCategory.description}</p>
              )}
            </div>

            {/* Parent Category Card */}
            <div className="mb-8">
              <CategoryCard category={parentCategory} />
            </div>

            {/* Child Categories */}
            {parentCategory.children && parentCategory.children.length > 0 && (
              <div>
                <h3 className="text-base font-medium text-muted-foreground mb-4">Subcategories</h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {parentCategory.children.map((childCategory) => (
                    <CategoryCard key={childCategory.id} category={childCategory} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show message if no categories */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      )}
    </div>
  )
}
