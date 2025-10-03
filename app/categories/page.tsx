'use client'
import { CategoryCard } from "@/components/category-card"
import { useState } from "react"
import useSWR from "swr"

export default function CategoriesPage() {
const fetcher = async (url: string) => {
  const res = await fetch(url)
  console.log(res, 'check product or response') // this logs the Response object
  const data = await res.json()
  console.log(data, 'parsed data') // this logs your JSON data (items, total, etc.)
  return data
}
  const { data } = useSWR(`/api/categories`, fetcher)
  const  categories = data || [] ;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-xl font-semibold">Categories</h1>
      <p className="text-sm text-muted-foreground">Browse our equipment categories and subcategories.</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c: any) => (
          <CategoryCard key={c.slug} category={{ ...c }} />
        ))}
      </div>
    </div>
  )
}
