import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface Props {
  category: { id:string,slug: string; name: string; image?: string; productCount?: number }
}

export function CategoryCard({ category }: Props) {
  const img = category.image || "/laboratory-category.jpg"
  return (
    <Link href={`/products?category=${encodeURIComponent(category.id)}`}>
      <Card className="group relative overflow-hidden">
        <div className="relative aspect-[4/3]">
          <Image
            src={img || "/placeholder.svg"}
            alt={`${category.name} category`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1280px) 420px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3 rounded bg-background/90 px-3 py-1 text-sm shadow">
          <span className="font-medium">{category.name}</span>
          {typeof category.productCount === "number" ? (
            <span className="ml-2 text-muted-foreground">{category.productCount}</span>
          ) : null}
        </div>
      </Card>
    </Link>
  )
}
