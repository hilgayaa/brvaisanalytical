import { CategoryService } from "@/lib/services/category.service";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const categoryId = params.id;
  const categoryService = new CategoryService();

  try {
    await categoryService.deleteCategory(categoryId);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return new Response(            JSON.stringify({ error: "Failed to delete category" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}   