"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AskForQuoteButton } from "./ask-for-quote"

interface Props {
  product: {
    id: string
    slug: string
    name: string
    images: string[]
    technicalParameters?: [{ name: string; value: string }]
    category?: { name: string }
  }
}

export function ProductCard({ product }: Props) {
  const router = useRouter()
  const img = product.images?.[0] || "/lab-product.jpg"

  const handleViewDetails = () => {
    router.push(`/products/${product.id}`)
  }

  return (
    <Card className=" group flex  flex-col overflow-hidden transition-all duration-300 hover:shadow-lg ">
      <CardHeader className="relative p-0">
        <div className="relative aspect-square  w-full overflow-hidden bg-muted">
          <Image
            src={img || "/placeholder.svg"}
            alt={`${product.name} product image`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1280px) 400px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
          /> 
        </div>
        {product.category?.name && (
          <div className="absolute left-3 top-3">
            <Badge className="bg-primary text-primary-foreground">{product.category.name}</Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-grow p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-4 pt-0">
        <Button onClick={handleViewDetails} className="w-full">
          View Details
        </Button>
        <AskForQuoteButton productName={product.name} productCategory={product.category?.name??""} productImg={product.images[0]} />
      </CardFooter>
    </Card>
  )
}
