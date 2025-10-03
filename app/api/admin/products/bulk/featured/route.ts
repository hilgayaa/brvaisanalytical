
import { NextRequest, NextResponse } from 'next/server'
// import { requireAdmin } from '@/lib/auth/admin-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const BulkFeaturedSchema = z.object({
  productIds: z.array(z.string()).min(1),
  featured: z.boolean()
})

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { productIds, featured } = BulkFeaturedSchema.parse(body)

    const result = await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { featured }
    })

    return NextResponse.json({
      success: true,
      updated: result.count
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Bulk featured error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}