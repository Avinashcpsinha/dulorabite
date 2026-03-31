'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const IMAGES = [
  '/images/hero-bg.png',
  '/images/hero-bg-2.png',
  '/images/hero-bg-3.png',
  '/images/hero-bg-4.png',
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#3B1F0E]">
      {/* Background Images Slider */}
      <div 
        className="absolute inset-0 flex transition-transform duration-800 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: `translateX(-${index * 100}vw)`, width: `${IMAGES.length * 100}vw` }}
      >
        {IMAGES.map((img, i) => (
          <div key={img} className="relative h-full w-[100vw]">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img 
              src={img} 
              alt={`DuloraBite Hero ${i + 1}`} 
              className="w-full h-full object-cover"
              loading={i < 2 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center text-white">
        <h1 className="font-playfair font-black mb-6 text-5xl md:text-8xl leading-tight animate-fade-up">
          Crafted with <em className="text-[#E8B96A] not-italic">Love</em>, <br />
          Made to <em className="text-[#E8B96A] not-italic">Delight</em>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Premium homemade chocolates, cookies, and lollipops. No preservatives. No palm oil. 100% Vegetarian.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Link href="/products" className="px-8 py-4 rounded-full bg-[#C8973A] text-[#3B1F0E] font-bold uppercase tracking-wider hover:bg-[#E8B96A] transition-all flex items-center gap-2">
            Shop Our Collection <ArrowRight size={18} />
          </Link>
          <Link href="#story" className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/20 transition-all">
            Our Story
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length); }}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white transition-all hover:bg-white/20 z-30">
        <ArrowRight className="rotate-180" size={24} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % IMAGES.length); }}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white transition-all hover:bg-white/20 z-30">
        <ArrowRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {IMAGES.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setIndex(i); }}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${i === index ? 'bg-[#E8B96A] w-8' : 'bg-white/30 hover:bg-white/50'}`} />
        ))}
      </div>
    </section>
  );
}
