import { NextRequest, NextResponse } from 'next/server'
// import { requireAdmin } from '@/lib/auth/admin-auth'
import { prisma } from '@/lib/prisma'

export const GET = async (request: NextRequest) => {
  try {
    const [
      total,
      pending,
      responded,
      closed,
      inquiriesByProduct,
      inquiriesByMonth
    ] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'PENDING' } }),
      prisma.inquiry.count({ where: { status: 'RESPONDED' } }),
      prisma.inquiry.count({ where: { status: 'CLOSED' } }),
      
      // Top 10 products with most inquiries
      prisma.inquiry.groupBy({
        by: ['productId'],
        _count: { productId: true },
        orderBy: { _count: { productId: 'desc' } },
        take: 10
      }),

      // Inquiries by month (last 6 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*)::int as count
        FROM inquiries
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `
    ])

    // Get product details for top inquired products
    const productIds = inquiriesByProduct.map(i => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        category: { select: { name: true } }
      }
    })

    const topProducts = inquiriesByProduct.map(inquiry => ({
      product: products.find(p => p.id === inquiry.productId),
      inquiryCount: inquiry._count.productId
    }))

    return NextResponse.json({
      summary: {
        total,
        pending,
        responded,
        closed
      },
      topProducts,
      inquiriesByMonth
    })
  } catch (error) {
    console.error('Inquiry stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}