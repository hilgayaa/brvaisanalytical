import { prisma } from '@/lib/prisma'
import { Product, Prisma } from '@prisma/client'
import { SearchFilters } from '@/lib/types'

export class ProductRepository {
    async findAll(options?: {
        skip?: number
        take?: number
        include?: Prisma.ProductInclude
    }) {
        return prisma.product.findMany({
            skip: options?.skip,
            take: options?.take,
            include: options?.include || { category: true },
            orderBy: { createdAt: 'desc' }
        })
    }

    async findById(id: string, include?: Prisma.ProductInclude) {
        return prisma.product.findUnique({
            where: { id },
            include: include || { category: true, inquiries: true }
        })
    }

    async findBySlug(slug: string, include?: Prisma.ProductInclude) {
        return prisma.product.findUnique({
            where: { slug },
            include: include || { category: true }
        })
    }

    async findByCategory(categoryId: string, options?: {
        skip?: number
        take?: number
    }) {
        return prisma.product.findMany({
            where: { categoryId },
            include: { category: true },
            skip: options?.skip,
            take: options?.take,
            orderBy: { createdAt: 'desc' }
        })
    }

    async search(query: string, filters?: SearchFilters, options?: {
        skip?: number
        take?: number
    }) {
        const where: Prisma.ProductWhereInput = {
            //   @ts-ignore
            OR: [
                // Text search
                query ? {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { brand: { contains: query, mode: 'insensitive' } }
                    ]
                } : {},
                // Filters
                filters?.category ? { categoryId: filters.category } : {},
                filters?.brand ? { brand: { equals: filters.brand, mode: 'insensitive' } } : {},
                filters?.inStock !== undefined ? { inStock: filters.inStock } : {},
                filters?.featured !== undefined ? { featured: filters.featured } : {},
                filters?.priceRange ? {
                    price: {
                        gte: filters.priceRange[0],
                        lte: filters.priceRange[1]
                    }
                } : {}
            ].filter(condition => Object.keys(condition).length > 0)
        }

        return prisma.product.findMany({
            where,
            include: { category: true },
            skip: options?.skip,
            take: options?.take,
            orderBy: { createdAt: 'desc' }
        })
    }

    async getFeatured(limit = 8) {
        return prisma.product.findMany({
            where: { featured: true },
            include: { category: true },
            take: limit,
            orderBy: { createdAt: 'desc' }
        })
    }

    async getRelated(productId: string, categoryId: string, limit = 4) {
        return prisma.product.findMany({
            where: {
                categoryId,
                id: { not: productId }
            },
            include: { category: true },
            take: limit,
            orderBy: { createdAt: 'desc' }
        })
    }

    async getBrands() {
        const result = await prisma.product.groupBy({
            by: ['brand'],
            where: { brand: { not: null } },
            _count: { brand: true }
        })

        // @ts-ignore
        return result.map(item => ({
            name: item.brand!,
            count: item._count.brand
        }))
    }

    async getPriceRange() {
        const result = await prisma.product.aggregate({
            _min: { price: true },
            _max: { price: true }
        })

        return {
            min: result._min.price || 0,
            max: result._max.price || 0
        }
    }

}