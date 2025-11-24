import { ProductRepository } from '@/lib/repositories/product.repository'
import { CategoryRepository } from '@/lib/repositories/category.repository'
import { SearchFilters } from '@/lib/types'

export class ProductService {
  private productRepo = new ProductRepository()
  private categoryRepo = new CategoryRepository()

  async getProducts(page = 1, limit = 12) {
    const skip = (page - 1) * limit
    const products = await this.productRepo.findAll({ skip, take: limit })
    
    return {
      products,
      pagination: {
        page,
        limit,
        hasMore: products.length === limit
      }
    }
  }

  async getProduct(identifier: string) {
    // Try to get by ID first, then by slug
    let product = await this.productRepo.findById(identifier)
    if (!product) {
      product = await this.productRepo.findBySlug(identifier)
    }
    
    if (!product) return null

    // Get related products
    const relatedProducts = await this.productRepo.getRelated(
      product.id, 
      product.categoryId
    )

    return {
      ...product,
      relatedProducts
    }
  }

  async searchProducts(
    query: string, 
    filters?: SearchFilters, 
    page = 1, 
    limit = 12
  ) {
    const skip = (page - 1) * limit
    const products = await this.productRepo.search(query, filters, { skip, take: limit })
    
    return {
      products,
      query,
      filters,
      pagination: {
        page,
        limit,
        hasMore: products.length === limit
      }
    }
  }

  async getFeaturedProducts() {
  }

  async getProductsByCategory(categorySlug: string, page = 1, limit = 12) {
    const category = await this.categoryRepo.findBySlug(categorySlug)
    if (!category) return null

    const skip = (page - 1) * limit
    const products = await this.productRepo.findByCategory(category.id, { skip, take: limit })
    
    return {
      category,
      products,
      pagination: {
        page,
        limit,
        hasMore: products.length === limit
      }
    }
  }

  async deleteProduct(productId: string) {
    // Delete related inquiries first
        
      return await this.productRepo.delete(productId)
        
    // Delete the product
  
}

}
