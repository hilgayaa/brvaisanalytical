"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    title: "Precision Lab Equipment",
    description: "Advanced instruments for research and analysis",
    image: "/images/laboratory-microscope.png",
  },
  {
    title: "Analytical Solutions",
    description: "State-of-the-art measurement and testing devices",
    image: "/images/lab-scientific-instruments.png",
  },
  {
    title: "Research Excellence",
    description: "Professional-grade equipment for every laboratory",
    image: "/images/chemistry-lab-beakers-equipment.png",
  },
]

export function CarouselHero() {
  const [current, setCurrent] = useState(0)
//   const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    // if (!isAutoPlay) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 2000)

    return () => clearInterval(timer)
  }, )

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    // setIsAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative w-full overflow-hidden bg-background">
      {/* Carousel Container */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] ">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="h-full w-full object-cover" />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-12 lg:px-16">
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4 text-balance">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 mb-8 font-light">{slide.description}</p>
                <div className="bg-white w-fit p-2 rounded">
                {/* <Button size="lg" className="bg-white text-black hover:bg-gray-100 rounded-full px-8 "> */}
                  Explore Collection below
                {/* </Button> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={next}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index)
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  )
}
