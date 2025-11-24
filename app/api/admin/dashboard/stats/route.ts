import { NextRequest, NextResponse } from 'next/server'
// import { requireAdmin } from '@/lib/auth/admin-auth'
import { prisma } from '@/lib/prisma'

export const GET = async (request: NextRequest) => {
  try {
    // Get counts
    const [
      totalProducts,
      totalCategories,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
    ])

    // Get recent inquiries

    // Get low stock products (out of stock)

    // Get products by category

    return NextResponse.json({
      stats: {
        totalProducts,
        totalCategories,
      },
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}