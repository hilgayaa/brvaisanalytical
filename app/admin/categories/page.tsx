import { Suspense } from "react"
import { CategoriesTree } from "@/components/admin/categories/categories-tree"
import { CategoriesHeader } from "@/components/admin/categories/categories-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <CategoriesHeader />
      <Suspense fallback={<CategoriesLoadingSkeleton />}>
        <CategoriesTree />
      </Suspense>
    </div>
  )
}

function CategoriesLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
