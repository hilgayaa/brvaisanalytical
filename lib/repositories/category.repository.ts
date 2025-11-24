import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class CategoryRepository {
  async findAll(options?: {
    include?: Prisma.CategoryInclude
  }) {
    return prisma.category.findMany({
      include: options?.include,
      orderBy: { name: 'asc' }
    })
  }

  async findById(id: string, include?: Prisma.CategoryInclude) {
    return prisma.category.findUnique({
      where: { id },
      include: include || { products: true, children: true, parent: true }
    })
  }

  async findBySlug(slug: string, include?: Prisma.CategoryInclude) {
    return prisma.category.findUnique({
      where: { slug },
      include: include || { products: true, children: true, parent: true }
    })
  }

  async findRootCategories() {
    return prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: { _count: { select: { products: true } } }
        },
        _count: { select: { products: true } }
      },
      orderBy: { name: 'asc' }
    })
  }

  async findByParent(parentId: string) {
    return prisma.category.findMany({
      where: { parentId },
      include: {
        _count: { select: { products: true } }
      },
      orderBy: { name: 'asc' }
    })
  }

  async getCategoryHierarchy() {
    const categories = await prisma.category.findMany({
      include: {
        children: {
          include: {
            _count: { select: { products: true } }
          }
        },
        _count: { select: { products: true } }
      },
      orderBy: { name: 'asc' }
    })

    // Build hierarchy tree

    // @ts-ignore
    const rootCategories = categories.filter(cat => !cat.parentId)
    return rootCategories
  }

async deletebyId(id: string) {

  // 1. Delete technical parameters of products in this category
  await prisma.technicalParameter.deleteMany({
    where: {
      product: {
        categoryId: id
      }
    }
  });

  // 2. Delete products in this category
  await prisma.product.deleteMany({
    where: { categoryId: id }
  });

  // 3. Delete category
  return prisma.category.delete({
    where: { id }
  });
}

}

