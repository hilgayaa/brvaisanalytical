import { NextRequest, NextResponse } from 'next/server'
// import { requireAdmin } from '@/lib/auth/admin-auth'
import { prisma } from '@/lib/prisma'

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await prisma.inquiry.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: params.id },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('Get inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}