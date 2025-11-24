import { NextRequest, NextResponse } from 'next/server'
// import { requireAdmin } from '@/lib/auth/admin-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const BulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1)
})

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { ids } = BulkDeleteSchema.parse(body)

    // Delete related inquiries first
    await prisma.inquiry.deleteMany({
      where: { productId: { in: ids } }
    })

    await prisma.technicalParameter.deleteMany({
      where: { productId: { in: ids } }
    })
    // Delete products
    const result = await prisma.product.deleteMany({
      where: { id: { in: ids } }
    })

    return NextResponse.json({
      success: true,
      deleted: result.count
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}