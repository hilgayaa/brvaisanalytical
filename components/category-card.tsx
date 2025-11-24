import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

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
interface Props {
  category: Category
}

export function CategoryCard({ category }: Props) {
  const img = category.image || "/abstract-categories.png"
  const productCount = category._count?.products ?? 0

  return (
    <Link href={`/products?category=${encodeURIComponent(category.id)}`}>
  <Card className="group relative w-64 h-48 overflow-hidden rounded-xl shadow-md">
    <div className="relative w-full h-full">
      <Image
        src={img || "/placeholder.svg"}
        alt={`${category.name} category`}
        fill
        className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
        sizes="100%"
      />
    </div>

    {/* Overlay */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

    {/* Text */}
    <div className="absolute bottom-3 left-3 rounded bg-background/90 px-3 py-1 text-sm shadow">
      <span className="font-medium">{category.name}</span>
      <span className="ml-2 text-xs text-muted-foreground">
        {productCount > 0 ? `${productCount} product${productCount !== 1 ? "s" : ""}` : "No products"}
      </span>
    </div>
  </Card>
</Link>

  )
}
