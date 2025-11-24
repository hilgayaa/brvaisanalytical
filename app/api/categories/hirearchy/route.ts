
import { CategoryService } from "@/lib/services/category.service";
import { NextResponse,NextRequest } from "next/server";


export async function GET(request:NextRequest) {
    const categoryService = new CategoryService();
    try {

    const  hierarchyCategories = await categoryService.getCategoryHierarchy();
    return NextResponse.json(hierarchyCategories);
    } catch (error) {
       return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )  ; 
    }
    
}