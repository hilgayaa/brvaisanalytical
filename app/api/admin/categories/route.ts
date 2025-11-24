import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const AddCategoriesSchema = {
    name: z.string().min(1, 'Category name is required'),
    parentId: z.string().optional(),
    image: z.string().min(1, 'Category image is required'),
}

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json() ;
        const parsedBody = z.object(AddCategoriesSchema).parse(body);
        console.log('Parsed Body:', parsedBody.parentId);
        const category = await prisma.category.create({
            data: {
                slug: parsedBody.name.trim().toLowerCase(),
                image: parsedBody.image,
                name: parsedBody.name,

                parent:parsedBody.parentId ? {
                    connect: { id: parsedBody.parentId,
                     }
                      
                }:undefined,
            },
        });
        return NextResponse.json(category);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );  
    }

}