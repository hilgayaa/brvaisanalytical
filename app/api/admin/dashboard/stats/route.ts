import { NextRequest, NextResponse } from 'next/server'
// import { requireAdmin } from '@/lib/auth/admin-auth'
import { prisma } from '@/lib/prisma'

export const GET = async (request: NextRequest) => {
  try {
    // Get counts
    const [
      totalProducts,
      totalCategories,
      totalInquiries,
      pendingInquiries,
      outOfStockProducts,
      featuredProducts
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { inStock: false } }),
      prisma.product.count({ where: { featured: true } })
    ])

    // Get recent inquiries
    const recentInquiries = await prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { name: true, slug: true }
        }
      }
    })

    // Get low stock products (out of stock)
    const lowStockProducts = await prisma.product.findMany({
      where: { inStock: false },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        category: {
          select: { name: true }
        }
      }
    })

    // Get products by category
    const productsByCategory = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        products: {
          _count: 'desc'
        }
      },
      take: 10
    })

    return NextResponse.json({
      stats: {
        totalProducts,
        totalCategories,
        totalInquiries,
        pendingInquiries,
        outOfStockProducts,
        featuredProducts
      },
      recentInquiries,
      lowStockProducts,
      productsByCategory
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}