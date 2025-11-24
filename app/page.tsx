'use client'
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
export default function HomePage() {
    const router = useRouter();
    useEffect(() => { 
    router.replace('/products');
    },[] )
}
