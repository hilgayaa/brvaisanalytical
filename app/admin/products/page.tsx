import { Suspense } from "react"
import { ProductsTable } from "@/components/admin/products/products-table"
import { ProductsHeader } from "@/components/admin/products/products-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <ProductsHeader />
      <Suspense fallback={<ProductsLoadingSkeleton />}>
        <ProductsTable />
      </Suspense>
    </div>
  )
}

function ProductsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
