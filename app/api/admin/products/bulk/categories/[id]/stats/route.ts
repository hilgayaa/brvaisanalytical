
import { NextRequest, NextResponse } from 'next/server'
// import { requireAdmin } from '@/lib/auth/admin-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const MoveProductsSchema = z.object({
  productIds: z.array(z.string()).min(1),
  targetCategoryId: z.string()
})

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { productIds, targetCategoryId } = MoveProductsSchema.parse(body)

    // Verify target category exists
    const targetCategory = await prisma.category.findUnique({
      where: { id: targetCategoryId }
    })

    if (!targetCategory) {
      return NextResponse.json(
        { error: 'Target category not found' },
        { status: 404 }
      )
    }

    // Move products
    const result = await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { categoryId: targetCategoryId }
    })

    return NextResponse.json({
      success: true,
      moved: result.count,
      targetCategory: {
        id: targetCategory.id,
        name: targetCategory.name
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Move products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}