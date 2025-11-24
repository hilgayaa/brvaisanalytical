"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2, Search, Download } from "lucide-react"
import { ProductDialog } from "./product-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm"
import { FilterSidebar } from "@/components/filter-sidebar"

interface technicalParameters {
  name: string,
  value: string
}
interface Product {
  name: string
  description: string,
  images: string[],
  category: { name: string } | null,
  categoryId: string,
  manualLink: string,
  technicalParameters: technicalParameters[]
}


export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  //   const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])
  useEffect(() => {
    let result = [...products]

    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.categoryId === categoryFilter)
    }

    setFilteredProducts(result)
  }, [searchTerm, categoryFilter, products])

  async function fetchProducts() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (categoryFilter !== "all") params.append("category", categoryFilter)

      const response = await fetch(`/api/admin/products?${params}`, {
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_SECRET_KEY}`,
        },
      })
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("[v0] Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error("[v0] Failed to delete product:", error)
    }
  }

  async function handleBulkDelete() {
    try {
      const response = await fetch(`/api/admin/products/bulk/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${process.env.ADMIN_SECRET_KEY}`,
        },
        body: JSON.stringify({ ids: selectedProducts }),
      })

      if (response.ok) {
        setSelectedProducts([])
        fetchProducts()
      }
    } catch (error) {
      console.error("[v0] Failed to bulk delete:", error)
    }
  }


  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map((p: any) => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="">

          <FilterSidebar hidden={false} handleCategoryClick={(category) => { setCategoryFilter(category) }} className="sticky top-[5rem] max-h-[70vh] text-center  overflow-auto pr-2" />
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedProducts.length} selected</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selectedProducts.length === products.length} onCheckedChange={toggleSelectAll} />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                // @ts-ignore
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      // @ts-ignore
                      checked={selectedProducts.includes(product.id)}
                      // @ts-ignore
                      onCheckedChange={() => toggleSelect(product.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category?.name || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(product); setDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setDeletingProduct(product); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </div>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingProduct(null)
        }}
        // @ts-ignore
        product={editingProduct}
        onSuccess={fetchProducts}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (deletingProduct) {

            // @ts-ignore
            handleDelete(deletingProduct.id)
            setDeleteDialogOpen(false)
            setDeletingProduct(null)
          }
        }}
        title="Delete Product"
        description={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
