import { Product, Category, Inquiry } from '@prisma/client'

export type ProductWithCategory = Product & {
  category: Category
}

export type CategoryWithProducts = Category & {
  products: Product[]
  children?: Category[]
}

export type SearchFilters = {
  category?: string
  brand?: string
  priceRange?: [number, number]
  inStock?: boolean
  featured?: boolean
}

export type InquiryFormData = {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  productId: string
}