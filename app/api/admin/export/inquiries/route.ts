// import { requireAdmin } from '@/lib/auth/admin-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const GET = async (request: NextRequest) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: { 
        product: { 
          select: { name: true, category: { select: { name: true } } } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    })

    // Create CSV
    const headers = ['ID', 'Name', 'Email', 'Company', 'Phone', 'Product', 'Category', 'Status', 'Created At']
    const rows = inquiries.map(i => [
      i.id,
      i.name,
      i.email,
      i.company || '',
      i.phone || '',
      i.product.name,
      i.product.category.name,
      i.status,
      i.createdAt.toISOString()
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="inquiries-${Date.now()}.csv"`
      }
    })
  } catch (error) {
    console.error('Export inquiries error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}