import { CategoryRepository } from '@/lib/repositories/category.repository'

export class CategoryService {
  private categoryRepo = new CategoryRepository()

  async getCategories() {
    return this.categoryRepo.findAll()
  }

  async getCategoryHierarchy() {
    return this.categoryRepo.getCategoryHierarchy()
  }

  async getCategory(identifier: string) {
    let category = await this.categoryRepo.findById(identifier)
    if (!category) {
      category = await this.categoryRepo.findBySlug(identifier)
    }
    return category
  }

  async getRootCategories() {
    return this.categoryRepo.findRootCategories()
  }
}