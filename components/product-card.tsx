import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Props {
  product: {
    slug: string
    name: string
    brand?: string
    price?: number
    currency?: string
    inStock: boolean
    featured?: boolean
    images: string[]
    category?: { name: string }
  }
}

export function ProductCard({ product }: Props) {
  const img = product.images?.[0] || "/lab-product.jpg"
  return (
    <Card className="group h-full overflow-hidden">
      <CardHeader className="relative p-0">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={img || "/placeholder.svg"}
            alt={`${product.name} product image`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
          />
        </div>
        <div className="absolute left-2 top-2 flex gap-2">
          {product.category?.name ? (
            <Badge className="bg-primary text-primary-foreground">{product.category.name}</Badge>
          ) : null}
          {product.featured ? (
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Featured
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-1 p-4">
        <h3 className="line-clamp-2 font-medium">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <p className="text-sm">
          {typeof product.price === "number" ? (
            <span className="font-semibold">
              {product.currency || "USD"} {product.price.toLocaleString()}
            </span>
          ) : (
            <span className="text-muted-foreground">Quote on Request</span>
          )}
        </p>
        <p className="text-xs">
          {product.inStock ? (
            <span className="text-green-600">In stock</span>
          ) : (
            <span className="text-muted-foreground">Out of stock</span>
          )}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/products/${product.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
