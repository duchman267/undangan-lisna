import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface GallerySlotItem {
  id: string;
  src: string;
  orientation?: 'portrait' | 'landscape';
  title: string;
  caption: string;
}

interface GalleryCarousel3DProps {
  items: GallerySlotItem[];
}

// Background gradasi hitam dan emas yang cantik tanpa tulisan placeholder
// Hanya tampil apabila file foto belum tersedia di dalam project (tidak pernah diganti foto lain)
function createLuxuryBlackGoldGradientSvg(index: number): string {
  const variations = [
    { c1: '#0A0A0D', c2: '#1C160C', gold1: '#D4AF37', gold2: '#8C6D23', cx: '72%', cy: '28%' },
    { c1: '#0B0B0E', c2: '#21190E', gold1: '#E6C687', gold2: '#9A782C', cx: '28%', cy: '32%' },
    { c1: '#09090C', c2: '#1F180D', gold1: '#C5A059', gold2: '#7A5C1B', cx: '65%', cy: '38%' },
    { c1: '#0C0B0E', c2: '#241B0F', gold1: '#DFBD69', gold2: '#8E6E26', cx: '35%', cy: '26%' },
    { c1: '#0A0A0C', c2: '#1D160B', gold1: '#E5C378', gold2: '#967428', cx: '50%', cy: '30%' },
  ];
  const v = variations[index % variations.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
    <defs>
      <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${v.c1}" />
        <stop offset="55%" stop-color="#121110" />
        <stop offset="100%" stop-color="${v.c2}" />
      </linearGradient>
      <radialGradient id="glow1" cx="${v.cx}" cy="${v.cy}" r="0.58">
        <stop offset="0%" stop-color="${v.gold1}" stop-opacity="0.48" />
        <stop offset="45%" stop-color="${v.gold2}" stop-opacity="0.18" />
        <stop offset="100%" stop-color="${v.c1}" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="glow2" cx="50%" cy="82%" r="0.55">
        <stop offset="0%" stop-color="${v.gold1}" stop-opacity="0.26" />
        <stop offset="100%" stop-color="${v.c1}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="600" height="800" fill="url(#base)" />
    <rect width="600" height="800" fill="url(#glow1)" />
    <rect width="600" height="800" fill="url(#glow2)" />
    <rect x="36" y="36" width="528" height="728" rx="20" fill="none" stroke="${v.gold1}" stroke-opacity="0.22" stroke-width="1" />
    <path d="M 150 560 C 150 320, 450 320, 450 560" fill="none" stroke="${v.gold1}" stroke-opacity="0.2" stroke-width="1" />
    <circle cx="300" cy="290" r="88" fill="none" stroke="${v.gold1}" stroke-opacity="0.25" stroke-width="1" />
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const GalleryCarousel3D: React.FC<GalleryCarousel3DProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [coloredSlots, setColoredSlots] = useState<Record<string, boolean>>({});
  const [missingImages, setMissingImages] = useState<Record<string, boolean>>({});
  const [detectedOrientations, setDetectedOrientations] = useState<
    Record<string, 'portrait' | 'landscape'>
  >({});
  const touchStartX = useRef<number | null>(null);

  const count = items.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % count);
  };

  const toggleSlotColor = (id: string) => {
    setColoredSlots((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full">
      {/* 3D Carousel Stage */}
      <div
        className="relative w-full h-[460px] sm:h-[540px] flex items-center justify-center perspective-1500 overflow-hidden select-none"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const deltaX = e.changedTouches[0].clientX - touchStartX.current;
          if (deltaX > 40) handlePrev();
          else if (deltaX < -40) handleNext();
          touchStartX.current = null;
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center preserve-3d">
          {items.map((item, idx) => {
            let offset = idx - activeIndex;
            if (offset > Math.floor(count / 2)) offset -= count;
            if (offset < -Math.floor(count / 2)) offset += count;

            const absOffset = Math.abs(offset);
            if (absOffset > 2) return null;

            const translateX = offset * 56;
            const translateZ = -absOffset * 140;
            const rotateY = offset * -28;
            const opacity = offset === 0 ? 1 : absOffset === 1 ? 0.62 : 0.28;

            const hasValidPhoto =
              Boolean(item.src && item.src.trim() !== '') && !missingImages[item.id];
            const gradientFallback = createLuxuryBlackGoldGradientSvg(idx);

            const orientation =
              detectedOrientations[item.id] || item.orientation || 'portrait';
            const isLandscape = orientation === 'landscape';
            const isColored = !!coloredSlots[item.id];

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (offset === 0) {
                    toggleSlotColor(item.id);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                onTouchStart={() => {
                  if (offset === 0) {
                    setColoredSlots((prev) => ({ ...prev, [item.id]: true }));
                  }
                }}
                style={{
                  transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                  opacity,
                  zIndex: 20 - absOffset * 5,
                  transition: 'all 620ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="absolute w-[280px] sm:w-[350px] h-[420px] sm:h-[495px] rounded-3xl bg-[#141417] p-2.5 border border-[#C5A059]/40 shadow-[0_28px_65px_-12px_rgba(0,0,0,0.85)] cursor-pointer group"
              >
                <div className="w-full h-full rounded-2xl overflow-hidden bg-[#0E0E11] flex flex-col">
                  {/* Area Foto di Bagian Atas (Bersih, Tidak Ditimpa Teks Sama Sekali) */}
                  <div className="relative flex-1 w-full overflow-hidden bg-[#0A0A0D]">
                    {hasValidPhoto ? (
                      isLandscape ? (
                        <>
                          {/* Background foto yang sama dalam keadaan blur & gelap untuk mengisi ruang kosong */}
                          <img
                            src={item.src}
                            alt=""
                            aria-hidden="true"
                            referrerPolicy="no-referrer"
                            className={`absolute inset-0 w-full h-full object-cover scale-110 blur-xl brightness-[0.38] bw-to-color pointer-events-none ${
                              isColored ? 'is-colored' : ''
                            }`}
                          />
                          {/* Foto utama landscape tampil utuh dengan object-fit: contain */}
                          <img
                            src={item.src}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            onLoad={(e) => {
                              const img = e.currentTarget;
                              if (img.naturalWidth && img.naturalHeight) {
                                const actual =
                                  img.naturalWidth > img.naturalHeight
                                    ? 'landscape'
                                    : 'portrait';
                                if (detectedOrientations[item.id] !== actual) {
                                  setDetectedOrientations((prev) => ({
                                    ...prev,
                                    [item.id]: actual,
                                  }));
                                }
                              }
                            }}
                            onError={() => {
                              setMissingImages((prev) => ({ ...prev, [item.id]: true }));
                            }}
                            className={`relative z-10 w-full h-full object-contain bw-to-color transition-transform duration-500 ${
                              isColored ? 'is-colored' : ''
                            }`}
                          />
                        </>
                      ) : (
                        /* Foto portrait tampil dengan object-fit: cover & object-position: center top agar kepala tidak terpotong */
                        <img
                          src={item.src}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          style={{ objectPosition: 'center top' }}
                          onLoad={(e) => {
                            const img = e.currentTarget;
                            if (img.naturalWidth && img.naturalHeight) {
                              const actual =
                                img.naturalWidth > img.naturalHeight
                                  ? 'landscape'
                                  : 'portrait';
                              if (detectedOrientations[item.id] !== actual) {
                                setDetectedOrientations((prev) => ({
                                  ...prev,
                                  [item.id]: actual,
                                }));
                              }
                            }
                          }}
                          onError={() => {
                            setMissingImages((prev) => ({ ...prev, [item.id]: true }));
                          }}
                          className={`w-full h-full object-cover object-top bw-to-color transition-transform duration-500 ${
                            isColored ? 'is-colored' : ''
                          }`}
                        />
                      )
                    ) : (
                      /* Jika file belum ditemukan, tampilkan gradasi hitam & emas tanpa mengganti dengan foto lain */
                      <img
                        src={gradientFallback}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Panel Gelap Terpisah di Bawah Foto untuk Judul Bab & Kalimat Cerita */}
                  <div className="shrink-0 w-full bg-[#121216] border-t border-[#C5A059]/25 px-5 py-4 text-left">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#E6C687] font-medium">
                      {item.title}
                    </p>
                    <p className="font-serif-luxury text-lg sm:text-xl text-[#FAFAFA] mt-1 leading-snug">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tombol Navigasi & 5 Titik Indikator Carousel (Dot) */}
      <div className="mt-4 flex items-center justify-center gap-5 px-4">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Sebelumnya"
          className="min-w-[44px] min-h-[44px] rounded-full border border-[#C5A059]/45 bg-[#141417] hover:bg-[#C5A059] text-[#FAFAFA] hover:text-[#0B0B0D] flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={item.title}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === activeIndex
                  ? 'w-7 bg-[#E6C687]'
                  : 'w-2 bg-white/25 hover:bg-white/45'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Selanjutnya"
          className="min-w-[44px] min-h-[44px] rounded-full border border-[#C5A059]/45 bg-[#141417] hover:bg-[#C5A059] text-[#FAFAFA] hover:text-[#0B0B0D] flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
