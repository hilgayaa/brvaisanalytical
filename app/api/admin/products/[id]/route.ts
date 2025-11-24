
import { ProductRepository } from "@/lib/repositories/product.repository";
import { NextRequest,NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const productRepo = new ProductRepository();
  const productId = params.id;

  try {
    await productRepo.delete(productId);    
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }     
} 