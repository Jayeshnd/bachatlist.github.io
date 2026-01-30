"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  position: number;
}

interface BannerSliderProps {
  banners: Banner[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function BannerSlider({ banners, autoPlay = true, autoPlayInterval = 5000 }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const sortedBanners = [...banners].sort((a, b) => a.position - b.position);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % sortedBanners.length;
    goToSlide(nextIndex);
  }, [currentIndex, sortedBanners.length, goToSlide]);

  const goToPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + sortedBanners.length) % sortedBanners.length;
    goToSlide(prevIndex);
  }, [currentIndex, sortedBanners.length, goToSlide]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, goToNext]);

  if (sortedBanners.length === 0) return null;

  return (
    <div className="relative w-full h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden rounded-2xl bg-gray-100">
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sortedBanners.map((banner) => (
          <div key={banner.id} className="flex-shrink-0 w-full h-full relative">
            {banner.imageUrl ? (
              <Image
                src={banner.imageUrl}
                alt={banner.title || "Banner"}
                fill
                className="object-cover"
                priority={currentIndex === sortedBanners.indexOf(banner)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500" />
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-gray-900/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  {banner.title && (
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                      {banner.title}
                    </h2>
                  )}
                  {banner.subtitle && (
                    <p className="text-gray-200 text-sm md:text-base mb-4">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.ctaText && banner.ctaLink && (
                    <Link
                      href={banner.ctaLink}
                      className="inline-block bg-white text-gray-900 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition shadow-lg"
                    >
                      {banner.ctaText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {sortedBanners.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition shadow-lg"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition shadow-lg"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator */}
      {sortedBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {sortedBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
