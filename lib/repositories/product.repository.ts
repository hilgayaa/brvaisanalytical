import { prisma } from '@/lib/prisma'
import {  Prisma } from '@prisma/client'
import { SearchFilters } from '@/lib/types'

export class ProductRepository {
    async findAll(options?: {
        skip?: number
        take?: number
        include?: any
    }) {
        return prisma.product.findMany({
            skip: options?.skip,
            take: options?.take,
            include: options?.include || { category: true },
            orderBy: { createdAt: 'desc' }
        })
    }

    async findById(id: string, include?: any) {
        return prisma.product.findUnique({
            where: { id },
            include: include || { category: true, inquiries: true,technicalParameters:true }
        })
    }

    async findBySlug(slug: string, include?: any) {
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
        const where: any = {
            //   @ts-ignore
            OR: [
                // Text search
                query ? {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ]
                } : {},
                // Filters
                filters?.category ? { categoryId: filters.category } : {},
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

    // Add these methods to your ProductRepository class

// CREATE - Add new product
async count(where?: any) {
    return prisma.product.count({ where })
}

async create(data: {
    name: string
    description: string
    shortDesc?: string
    images: string[]
    categoryId: string,
    manualLink:string,
    technicalParameters?: { name: string; value: string }[]

}) {
    // Auto-generate slug from name
    let slug = data.name

    // Ensure slug is unique
    const existingProduct = await prisma.product.findUnique({
        where: { slug }
    })

    if (existingProduct) {
        slug = `${slug}-${Date.now()}`
    }

    return prisma.product.create({
    // @ts-ignore
        data: {
            name: data.name,
            slug: slug,
            description: data.description,
            images: data.images,
            manualLink: data.manualLink,
            category: {
                connect: { id: data.categoryId }
            },
            technicalParameters:{
                create: data.technicalParameters?.map(param => ({
                    name: param.name,
                    value: param.value
                }))
            }
        },
        include: { category: true }
    })
}

// UPDATE - Update existing product
async update(id: string, data: {
    name?: string
    description?: string
    shortDesc?: string
    images?: string[]
    specifications?: any
    features?: string[]
    categoryId?: string
    brand?: string
    currency?: string
    inStock?: boolean
    featured?: boolean
}) {
    const updateData: any = {}

    // Only update fields that are provided
    if (data.name !== undefined) {
        updateData.name = data.name
        // Update slug if name changes
        const newSlug = data.name
        const existingProduct = await prisma.product.findFirst({
            where: { 
                slug: newSlug,
                id: { not: id }
            }
        })

        if (!existingProduct) {
            updateData.slug = newSlug
        } else {
            updateData.slug = `${newSlug}-${Date.now()}`
        }
    }

    if (data.description !== undefined) updateData.description = data.description
    if (data.shortDesc !== undefined) updateData.shortDesc = data.shortDesc
    if (data.images !== undefined) updateData.images = data.images
    if (data.specifications !== undefined) updateData.specifications = data.specifications
    if (data.features !== undefined) updateData.features = data.features
    if (data.brand !== undefined) updateData.brand = data.brand
    if (data.currency !== undefined) updateData.currency = data.currency
    if (data.inStock !== undefined) updateData.inStock = data.inStock
    if (data.featured !== undefined) updateData.featured = data.featured

    // Handle category update separately
    if (data.categoryId !== undefined) {
        updateData.category = {
            connect: { id: data.categoryId }
        }
    }

    return prisma.product.update({
        where: { id },
        data: updateData,
        include: { category: true }
    })
}

// DELETE - Delete product
async delete(id: string) {
    // First delete related inquiries
    await prisma.inquiry.deleteMany({
        where: { productId: id }
    })

    // Then delete the product
    await prisma.technicalParameter.deleteMany({        
        where: { productId: id }
    })    

    return prisma.product.delete({
        where: { id }
    })
}

// BULK DELETE - Delete multiple products
async bulkDelete(ids: string[]) {
    // Delete related inquiries first
    await prisma.inquiry.deleteMany({
        where: { productId: { in: ids } }
    })

    // Delete products
    return prisma.product.deleteMany({
        where: { id: { in: ids } }
    })
}

// TOGGLE FEATURED - Quick toggle featured status
// UPDATE STOCK - Quick update stock status

// BULK UPDATE FEATURED
// DUPLICATE PRODUCT
}