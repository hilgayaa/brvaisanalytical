import { NextRequest, NextResponse } from 'next/server'
// import { requireAdmin } from '@/lib/auth/admin-auth'
import { ProductRepository } from '@/lib/repositories/product.repository'
import { z } from 'zod'

const productRepo = new ProductRepository()

const technicalParameters = z.object({
  name:z.string().min(1),
  value:z.string().min(1)
})
const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  images: z.array(z.string()).min(1),
  categoryId: z.string().min(1),
  manualLink: z.string(),
  technicalParameters:z.array(technicalParameters)
})

// GET - List all products (admin view)
export const GET = async (request: NextRequest, context: any, admin: any) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const products = await productRepo.findAll({ skip, take: limit })
    const total = await productRepo.count()

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create product
export const POST = async (request: NextRequest, context: any, admin: any) => {
  try {
    const body = await request.json()
    const validatedData = ProductSchema.parse(body)


    const product = await productRepo.create(validatedData)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Admin products POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}