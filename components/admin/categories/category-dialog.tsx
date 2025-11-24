"use client"

import type React from "react"
import { useState, useEffect, use } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { error } from "console"
export interface Category {
  id: number
  name: string
  description?: string
  parentId: number | null
  productCount: number
  image: string
}

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  parentCategory?: Category | null
  onSuccess?: () => void
}

export function CategoryDialog({ open, onOpenChange, category, parentCategory, onSuccess }: CategoryDialogProps) {
  const [categories, setcategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
    image: ""
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        parentId: category.parentId?.toString() || "",
        image: category.image
      })
    } else if (parentCategory) {
      setFormData({
        name: "",
        description: "",
        parentId: parentCategory.id.toString(),
        image: ""
      })
    } else {
      setFormData({
        name: "",
        description: "",
        parentId: "",
        image: ""
      })
    }
  }, [category, parentCategory, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`

      console.log('formdata ', formData);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_SECRET_KEY}`,
        },

        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId,
        }),
      })
      const data = await response.json();

      if (response.ok) {
        onOpenChange(false)
        onSuccess?.()
      } else {
        throw new Error("Failed to save category")
      }
    } catch (error) {
      console.error("Failed to save category:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const getCategory = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/getall`);
      const categories = await getCategory.json();
      setcategories(categories);
    }
    catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>
            {category
              ? "Edit Category"
              : parentCategory
                ? `Add Subcategory to ${parentCategory.name}`
                : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {category ? "Update category information" : "Fill in the details to create a new category"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="parent">Parent Category</Label>
            <Select
              value={formData.parentId}
              onValueChange={(value) => {
                console.log("Selected Parent ID:", value);

                setFormData({ ...formData, parentId: value })
              }
              }
              onOpenChange={() => fetchCategories()}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>

                      {
                        // cat.id
                        cat.name
                      }
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                try {

                  if (file) {
                    // Handle file upload here
                    setLoading(true);
                    const data = new FormData()
                    data.append("file", file)
                    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "brvaislab")

                    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                      method: "POST",
                      body: data,
                    })
                    const result = await res.json()
                    setFormData({ ...formData, image: result.url })
                    setLoading(false);
                  }
                } catch (error) {
                  console.error("Error uploading image:", error)
                }
              }}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}