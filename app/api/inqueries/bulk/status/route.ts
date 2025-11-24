import { NextRequest, NextResponse } from 'next/server'
// import { requireAdmin } from '@/lib/auth/admin-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const BulkStatusSchema = z.object({
  inquiryIds: z.array(z.string()).min(1),
  status: z.enum(['PENDING', 'RESPONDED', 'CLOSED'])
})

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { inquiryIds, status } = BulkStatusSchema.parse(body)

    const result = await prisma.inquiry.updateMany({
      where: { id: { in: inquiryIds } },
      data: { status }
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

    console.error('Bulk status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}