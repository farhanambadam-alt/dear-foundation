import { X, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useCallback } from 'react';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  span?: string;
}

interface MediaLightboxProps {
  open: boolean;
  onClose: () => void;
  items: MediaItem[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
}

const DEMO_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

const MediaLightbox = ({ open, onClose, items, activeIndex, onChangeIndex }: MediaLightboxProps) => {
  const [loaded, setLoaded] = useState(false);
  const [entering, setEntering] = useState(false);
  const [exiting, setExiting] = useState(false);
  const current = items[activeIndex];

  useEffect(() => { setLoaded(false); }, [activeIndex]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setEntering(true);
    const t = setTimeout(() => setEntering(false), 10);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      onClose();
    }, 280);
  }, [onClose]);

  const goPrev = () => onChangeIndex((activeIndex - 1 + items.length) % items.length);
  const goNext = () => onChangeIndex((activeIndex + 1) % items.length);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, activeIndex]);

  if (!open || !current) return null;

  const isAnimating = entering || exiting;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col transition-opacity duration-300 ease-out ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ isolation: 'isolate' }}
    >
      {/* Frosted backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-3xl" />

      {/* Top bar */}
      <div className="relative z-[110] flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),16px)] pb-3">
        <span className="text-white/60 text-[13px] font-heading font-medium tracking-wide">
          {activeIndex + 1} / {items.length}
        </span>
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15 hover:bg-white/20 active:scale-90 transition-all min-h-[44px] min-w-[44px]"
          aria-label="Close"
        >
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* Main media area — fills remaining space */}
      <div className="relative z-[105] flex-1 flex items-center justify-center px-4 min-h-0">
        {/* Nav arrows — desktop */}
        <button
          onClick={goPrev}
          className="hidden md:flex absolute left-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md items-center justify-center border border-white/15 hover:bg-white/20 active:scale-90 transition-all"
          aria-label="Previous"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button
          onClick={goNext}
          className="hidden md:flex absolute right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md items-center justify-center border border-white/15 hover:bg-white/20 active:scale-90 transition-all"
          aria-label="Next"
        >
          <ChevronRight size={20} className="text-white" />
        </button>

        {/* Media */}
        <div
          className={`relative max-w-full max-h-full flex items-center justify-center transition-all duration-300 ease-out ${
            !isAnimating && loaded ? 'opacity-100 scale-100' : exiting ? 'opacity-0 scale-95' : ''
          }`}
        >
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="w-72 h-72 md:w-96 md:h-80 rounded-2xl bg-white/10" />
            </div>
          )}

          {current.type === 'image' ? (
            <img
              key={activeIndex}
              src={current.src}
              alt={`Gallery ${activeIndex + 1}`}
              className={`max-w-[90vw] md:max-w-[70vw] max-h-[60vh] md:max-h-[65vh] w-auto h-auto object-contain rounded-2xl shadow-2xl transition-opacity duration-300 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
                setLoaded(true);
              }}
              draggable={false}
            />
          ) : (
            <video
              key={activeIndex}
              src={DEMO_VIDEO}
              controls
              autoPlay
              playsInline
              className={`max-w-[90vw] md:max-w-[70vw] max-h-[60vh] md:max-h-[65vh] w-auto h-auto rounded-2xl shadow-2xl bg-black transition-opacity duration-300 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadedData={() => setLoaded(true)}
              poster={current.src}
            />
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="relative z-[105] flex-shrink-0 px-4 pb-[max(env(safe-area-inset-bottom),20px)] pt-3">
        <div className="flex gap-2.5 justify-center items-center">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => onChangeIndex(i)}
              className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-250 ease-out ${
                i === activeIndex
                  ? 'w-[60px] h-[60px] md:w-[72px] md:h-[72px] ring-2 ring-white/90 ring-offset-2 ring-offset-transparent scale-110 shadow-lg shadow-white/10'
                  : 'w-[48px] h-[48px] md:w-[56px] md:h-[56px] opacity-50 hover:opacity-80 hover:scale-105'
              }`}
            >
              <img
                src={item.src}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Play size={10} className="text-white" fill="white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaLightbox;
