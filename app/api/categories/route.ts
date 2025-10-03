import { NextRequest, NextResponse } from 'next/server'
import { CategoryService } from '@/lib/services/category.service'

const categoryService = new CategoryService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const hierarchy = searchParams.get('hierarchy') === 'true'
    
    const categories = hierarchy 
      ? await categoryService.getCategoryHierarchy()
      : await categoryService.getCategories()

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}