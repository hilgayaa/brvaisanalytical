import Image from "next/image"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { InquiryForm } from "@/components/inquiry-form"
import { ProductCard } from "@/components/product-card"

async function getData(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL : ""}/api/products/${slug}`,
    { cache: "no-store" },
  ).catch(() => null)
  // Fallback to relative in preview
  const data =
    res && res.ok ? await res.json() : await fetch(`/api/products/${slug}`, { cache: "no-store" }).then((r) => r.json())
  return data
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug).catch(() => null)
  if (!data?.product) return notFound()
  const { product, related } = data
  const img = product.images?.[0] || "/lab-product.jpg"

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb>
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
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-md border bg-card">
            <Image src={img || "/placeholder.svg"} alt={`${product.name} main image`} fill className="object-cover" />
          </div>
          {product.images?.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.images.slice(1).map((src: string, i: number) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded border">
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">{product.category?.name}</Badge>
            {product.inStock ? (
              <span className="text-sm text-green-600">In stock</span>
            ) : (
              <span className="text-sm text-muted-foreground">Out of stock</span>
            )}
          </div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-sm text-muted-foreground">
            {product.brand} {product.model ? `• ${product.model}` : null}
          </p>
          <p className="text-base">
            {typeof product.price === "number" ? (
              <span className="font-semibold">
                {product.currency || "USD"} {product.price.toLocaleString()}
              </span>
            ) : (
              <span className="text-muted-foreground">Quote on Request</span>
            )}
          </p>

          <ul className="list-inside list-disc text-sm">
            {product.features?.map((f: string) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <div className="rounded-md border p-4">
            <h2 className="mb-2 text-sm font-medium">Request a Quote</h2>
            <InquiryForm productId={product.id} />
          </div>
        </aside>
      </div>

      <Tabs defaultValue="description" className="mt-10">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <p className="mt-4 text-sm text-pretty text-muted-foreground">{product.description}</p>
        </TabsContent>
        <TabsContent value="specs">
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {product.specifications ? (
                  Object.entries(product.specifications).map(([k, v]) => (
                    <tr key={k} className="border-b">
                      <td className="w-1/3 bg-muted/30 px-3 py-2 font-medium">{k}</td>
                      <td className="px-3 py-2">{String(v)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-2 text-muted-foreground">No specifications available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {related?.length ? (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Related products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p: any) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
