"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Category } from "../categories/category-dialog"
import { Plus } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

interface technicalParameters {
  name: string,
  value: string
}
interface Product {
  name: string
  description: string,
  images: string[],
  categoryId: string,
  manualLink: string,
  technicalParameters: technicalParameters[]
}

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSuccess?: () => void
}

export function ProductDialog({ open, onOpenChange, product, onSuccess }: ProductDialogProps) {
  const [categories, setcategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    images: [],
    categoryId: "",
    manualLink: "",
    technicalParameters: []
  })
  const [loading, setLoading] = useState(false)
  //   const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/products`
      console.log(formData);
      const response = await fetch(url, {
        method: product ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_SECRET_KEY}`,
        },
        body: JSON.stringify({
          ...formData,
        }),
      })

      if (response.ok) {
        // toast({
        //   title: "Success",
        //   description: `Product ${product ? "updated" : "created"} successfully`,
        // })
        console.log(response)
        onOpenChange(false)
        onSuccess?.()
      } else {
        console.error(await response.json());
        throw new Error("Failed to save product")
      }
    } catch (error) {
      console.error("[v0] Failed to save product:", error)
      //   toast({
      //     title: "Error",
      //     description: "Failed to save product",
      //     variant: "destructive",
      //   })
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
      setcategories([]);
      console.error("Error fetching categories:", error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product ? "Update product information" : "Fill in the details to create a new product"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                onOpenChange={() => fetchCategories()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {
                    categories.length > 0 ?
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>

                          {
                            // cat.id
                            cat.name
                          }
                        </SelectItem>
                      )) : (
                        <>
                        </>
                      )
                  }
                </SelectContent>
              </Select>
            </div>
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

          <div className="space-y-2 flex flex-col ">
            <Label htmlFor="technicalParameters">Technical Parameters</Label>

            {formData.technicalParameters.map((param, index) => (
              <div key={index} className="flex items-center gap-2">
                <Textarea
                  placeholder="parameter"
                  value={param.name}
                  onChange={(e) => {
                    const updated = [...formData.technicalParameters];
                    updated[index].name = e.target.value;
                    setFormData({ ...formData, technicalParameters: updated });
                  }}
                />

                <Textarea
                  placeholder="value"
                  value={param.value}
                  onChange={(e) => {
                    const updated = [...formData.technicalParameters];
                    updated[index].value = e.target.value;
                    setFormData({ ...formData, technicalParameters: updated });
                  }}
                />

                <Button
                  variant="destructive"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      technicalParameters: formData.technicalParameters.filter((_, i) => i !== index),
                    });
                  }}
                  className="h-12 w-12"
                >
                  ×
                </Button>
              </div>
            ))}

            <Button
              onClick={() => {
                setFormData({
                  ...formData,
                  technicalParameters: [
                    ...formData.technicalParameters,
                    { name: "", value: "" },
                  ],
                });
              }}
              className="h-12 w-40 mt-2"
            >
              <Plus className="h-5 w-5 mr-2" /> Add Parameter
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manualLink">Manual Link</Label>
            <Input
              id="manualLink"
              type="file"
              accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                try {
                  setLoading(true);

                  // Create FormData and send to your AP. 
                  const formData = new FormData();
                  formData.append('file', file);

                  const response = await fetch('/api/cloudinary-signature', {
                    method: 'POST',
                    body: formData,
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    console.error('Upload failed:', data);
                    alert(`Upload failed: ${data.error || 'Unknown error'}`);
                    return;
                  }

                  console.log('Upload successful:', data.url);
                  setFormData((prev) => ({ ...prev, manualLink: data.url }));
                  alert('File uploaded successfully!');

                } catch (error) {
                  console.error('Error uploading file:', error);
                  alert('Failed to upload file. Please try again.');
                } finally {
                  setLoading(false);
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images </Label>
            <Input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                try {
                  setLoading(true);
                  const form = new FormData();
                  form.append("file", file);
                  form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "brvaislab");

                  const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    { method: "POST", body: form }
                  );

                  const data = await res.json();
                  setFormData({
                    ...formData,
                    images: [...formData.images, data.secure_url],
                  });
                } finally {
                  setLoading(false);
                }
              }}
            />


          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
