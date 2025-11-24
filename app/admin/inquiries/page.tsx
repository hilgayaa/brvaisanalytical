import { Suspense } from "react"
import { InquiriesHeader } from "@/components/admin/inquiries/inquiries-header"
import { Skeleton } from "@/components/ui/skeleton"
import { InquiriesTable } from "@/components/admin/inquiries/inquiries-table"

export default function InquiriesPage() {
  return (
    <div className="space-y-6">
      <InquiriesHeader />
      <Suspense fallback={<InquiriesLoadingSkeleton />}>
        {/* @ts-ignore  */}
        <InquiriesTable />
      </Suspense>
    </div>
  )
}

function InquiriesLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
