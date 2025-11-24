
import { NextRequest, NextResponse } from 'next/server'
// import { requireAdmin } from '@/lib/auth/admin-auth'
import { prisma } from '@/lib/prisma'

export const GET = async (request: NextRequest) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: { select: { name: true } } }
    })

    // Create CSV
    const headers = ['ID', 'Name', 'Brand', 'Model', 'Category', 'Price', 'Currency', 'In Stock', 'Featured', 'Created At']
    const rows = products.map(p => [
      p.id,
      p.name,
      p.brand || '',
      p.model || '',
      p.category.name,
      p.price || '',
      p.currency,
      p.inStock ? 'Yes' : 'No',
      p.featured ? 'Yes' : 'No',
      p.createdAt.toISOString()
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="products-${Date.now()}.csv"`
      }
    })
  } catch (error) {
    console.error('Export products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}