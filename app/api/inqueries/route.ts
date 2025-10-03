import { NextRequest, NextResponse } from 'next/server'
import { InquiryRepository } from '@/lib/repositories/inquery.repository'
import { z } from 'zod'

const inquiryRepo = new InquiryRepository()

const InquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  productId: z.string().min(1, 'Product ID is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = InquirySchema.parse(body)
    
    const inquiry = await inquiryRepo.create(validatedData)
    
    // Here you could send email notification
    // await sendInquiryNotification(inquiry)
    
    return NextResponse.json(inquiry, { status: 201 })
  } catch (error:unknown ) {
     if (error instanceof z.ZodError) {
      return NextResponse.json(
        // @ts-ignore
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Inquiry API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const inquiries = await inquiryRepo.findAll({ skip, take: limit })
    
    return NextResponse.json({
      inquiries,
      pagination: { page, limit, hasMore: inquiries.length === limit }
    })
  } catch (error) {
    console.error('Inquiries GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}