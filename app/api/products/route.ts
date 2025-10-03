import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/product.services'
import { SearchFilters } from '@/lib/types'

const productService = new ProductService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || undefined
    // const brand = searchParams.get('brand') || undefined
    // const featured = searchParams.get('featured') === 'true' ? true : undefined
    // const inStock = searchParams.get('inStock') === 'true' ? true : undefined
    // const minPrice = searchParams.get('minPrice')
    // const maxPrice = searchParams.get('maxPrice')

    const filters: SearchFilters = {
      category,
      // brand,
      // featured,
      // inStock,
      // priceRange: minPrice && maxPrice ? [parseFloat(minPrice), parseFloat(maxPrice)] : undefined
    }
    let result
    if (query || Object.values(filters).some(f => f !== undefined)) {
      result = await productService.searchProducts(query, filters, page, limit)
    } else {
      result = await productService.getProducts(page, limit)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}