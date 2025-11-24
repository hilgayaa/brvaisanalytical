"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ProductCard } from "@/components/product-card"
import { Download, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AskForQuoteButton } from "@/components/ask-for-quote"

async function getData(id: string) {
  try {
    const res = await fetch(`/api/products/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    async function fetchData() {
      const result = await getData(params.id)
      setData(result)
      setLoading(false)
    }
    fetchData()
  }, [params.id])

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>
  }

  if (!data) {
    return <div className="p-10 text-center">Product not found</div>
  }

  const images = data.images || ["/lab-product.jpg"]
  const mainImage = images[selectedImageIndex]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{data.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <Image src={mainImage || "/placeholder.svg"} alt={data.name} fill className="object-cover" priority />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((src: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary shadow-md"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`${data.name}-${index}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {/* Product Info */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{data.name}</h1>
              {data.category && (
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {typeof data.category === "object" ? data.category.name : data.category}
                </p>
              )}
              {data.description && <p className="text-base text-foreground/80 leading-relaxed">{data.description}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
            <AskForQuoteButton productName={data.name}  productCategory={data.category} productImg={data.images[0]}/> 
            </div>

            {/* Download Section */}
            {data.manualLink && (
              <div className="border-t border-border pt-6">
                <p className="text-sm font-medium text-foreground mb-3">Resources</p>
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  onClick={() => {
                    const link = document.createElement("a")
                    link.href = data.manualLink
                    link.download = data.name + "_manual.pdf"
                    link.click()
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download Manual
                </Button>
              </div>
            )}

            {/* Specs Preview */}
            {data.technicalParameters && data.technicalParameters.length > 0 && (
              <div className="border-t border-border pt-6">
                <p className="text-sm font-medium text-foreground mb-3">Key Specifications</p>
                <ul className="space-y-2">
                  {data.technicalParameters.slice(0, 3).map((param: any) => (
                    <li key={param.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{param.name}</span>
                      <span className="font-medium text-foreground">{param.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="description" className="mt-12 md:mt-16">
          <TabsList className="border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent px-4 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="rounded-none border-b-2 border-transparent px-4 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Technical Parameters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <p className="text-base text-foreground/80 leading-relaxed">{data.description}</p>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Specification</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data.technicalParameters) && data.technicalParameters.length > 0 ? (
                    data.technicalParameters.map((param: any, index: number) => (
                      <tr key={param.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{param.name}</td>
                        <td className="px-4 py-3 text-foreground/80">{param.value}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground" colSpan={2}>
                        No specifications available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {data.relatedProducts?.length > 0 && (
          <section className="mt-16 md:mt-20">
            <h2 className="mb-8 text-2xl md:text-3xl font-bold tracking-tight">Related Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.relatedProducts.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
