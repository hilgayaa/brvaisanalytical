import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(request:NextRequest) {
    try {
        const categories = await prisma.category.findMany({});
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Categories API error:', error); 
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
