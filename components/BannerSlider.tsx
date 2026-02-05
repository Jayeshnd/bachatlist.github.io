"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  linkText?: string;
  link?: string;
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
    <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden rounded-xl bg-gray-200">
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sortedBanners.map((banner) => (
          <div key={banner.id} className="flex-shrink-0 w-full h-full relative">
            {banner.imageUrl ? (
              <Image
                src={banner.imageUrl}
                alt={banner.title || "Banner"}
                fill
                className="object-contain bg-gray-100"
                priority={currentIndex === sortedBanners.indexOf(banner)}
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{banner.title || "Banner"}</span>
              </div>
            )}
            
            {/* Content overlay */}
            {(banner.title || banner.subtitle || banner.linkText) && (
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl">
                    {banner.title && (
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 drop-shadow-lg mb-1 sm:mb-2">
                        {banner.title}
                      </h2>
                    )}
                    {banner.subtitle && (
                      <p className="text-gray-700 text-sm sm:text-base md:text-lg drop-shadow mb-2 sm:mb-4">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.linkText && (
                      <a
                        href={banner.link || "#"}
                        className="inline-block bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-800 transition shadow-lg"
                      >
                        {banner.linkText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {sortedBanners.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition z-10 shadow-md"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition z-10 shadow-md"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator */}
      {sortedBanners.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {sortedBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                index === currentIndex ? "bg-gray-900 w-6 sm:w-8" : "bg-gray-400 hover:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
