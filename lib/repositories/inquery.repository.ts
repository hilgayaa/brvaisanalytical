import { prisma } from '@/lib/prisma'
import { InquiryFormData } from '@/lib/types'

export class InquiryRepository {
  async create(data: InquiryFormData) {
    return prisma.inquiry.create({
      data,
      include: {
        product: {
          include: { category: true }
        }
      }
    })
  }

  async findByProduct(productId: string) {
    return prisma.inquiry.findMany({
      where: { productId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    })
  }

  async findAll(options?: {
    skip?: number
    take?: number
  }) {
    return prisma.inquiry.findMany({
      include: {
        product: {
          include: { category: true }
        }
      },
      skip: options?.skip,
      take: options?.take,
      orderBy: { createdAt: 'desc' }
    })
  }

  async updateStatus(id: string, status: 'PENDING' | 'RESPONDED' | 'CLOSED') {
    return prisma.inquiry.update({
      where: { id },
      data: { status },
      include: {
        product: {
          include: { category: true }
        }
      }
    })
  }
}