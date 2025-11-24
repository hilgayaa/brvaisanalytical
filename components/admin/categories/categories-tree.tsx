"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown , Trash2, Plus } from "lucide-react"
import { CategoryDialog } from "./category-dialog"
import { cn } from "@/lib/utils"
import { DeleteConfirmDialog } from "@/components/delete-confirm"

interface Category {
  _count?: {
    products: number
  }
  id: number
  name: string
  slug: string
  description?: string
  parentId: number | null
  status: "active" | "inactive"
  productCount: number,
  children?: Category[],
image:string
}

export function CategoriesTree() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [parentCategory, setParentCategory] = useState<Category | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  // const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/hirearchy`, {
       
      })
      const data = await response.json()
      console.log("Fetched categories:", data)
      setCategories(data || [])
    } catch (error) {
      console.error("[v0] Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_SECRET_KEY}`,
        },
      })

      if (response.ok) {
       alert('Category deleted successfully')
       fetchCategories()
      }
    } catch (error) {
      console.error("[v0] Failed to delete category:", error)
    }
  }

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedIds.has(category.id)

    return (
      <div key={category.id}>
        <div
          className={cn(
            "flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors",
            level > 0 && "ml-6",
          )}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => toggleExpand(category.id)}
            disabled={!hasChildren}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
          </Button>

          <div className="flex-1 flex items-center gap-3">
            <span className="font-medium">{category.name}</span>
            <span className="text-sm text-muted-foreground">{category._count?.products} products</span>
          </div>

          <div className="flex items-center gap-1">
           <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setDeletingCategory(category)
                setDeleteDialogOpen(true)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && <div>{category.children!.map((child) => renderCategory(child, level + 1))}</div>}
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">Loading categories...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No categories found. Create your first category to get started.
            </div>
          ) : (
            <div className="space-y-1">{categories.map((category) => renderCategory(category))}</div>
          )}
        </CardContent>
      </Card>


      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (deletingCategory) {
            handleDelete(deletingCategory.id)
            setDeleteDialogOpen(false)
            setDeletingCategory(null)
          }
        }}
        title="Delete Category"
        description={`Are you sure you want to delete "${deletingCategory?.name}"? This will also delete all subcategories. This action cannot be undone.`}
      />
    </>
  )
}
