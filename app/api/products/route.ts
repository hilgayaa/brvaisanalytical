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

    const filters: SearchFilters = {
      category,
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