import { Search, CalendarDays, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState, useCallback } from 'react';
import atSalonIcon from '@/assets/at-salon.svg';
import atHomeIcon from '@/assets/at-home.svg';

type TabItem = {
  icon?: typeof Search;
  svgSrc?: string;
  label: string;
  path: string;
};

const tabs: TabItem[] = [
  { svgSrc: atSalonIcon, label: 'At Salon', path: '/' },
  { svgSrc: atHomeIcon, label: 'At Home', path: '/at-home' },
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: CalendarDays, label: 'Bookings', path: '/bookings' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [spotlightX, setSpotlightX] = useState(0);
  const [spotlightW, setSpotlightW] = useState(0);
  const activeIndex = tabs.findIndex(t => t.path === location.pathname);

  const updateSpotlight = useCallback(() => {
    const btn = buttonsRef.current[activeIndex];
    if (!btn) return;
    const nav = btn.parentElement!;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setSpotlightX(btnRect.left - navRect.left + btnRect.width / 2);
    setSpotlightW(btnRect.width);
  }, [activeIndex]);

  useEffect(() => {
    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    return () => window.removeEventListener('resize', updateSpotlight);
  }, [updateSpotlight]);

  if (
    location.pathname.startsWith('/salon/') ||
    location.pathname.startsWith('/booking/') ||
    location.pathname.startsWith('/artist/') ||
    location.pathname.startsWith('/at-home-booking/')
  )
    return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none md:bottom-4"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
      }}
    >
      <div
        className="pointer-events-auto relative flex items-center w-[calc(100%-24px)] max-w-sm md:max-w-md md:w-auto rounded-[24px] bg-foreground/90 backdrop-blur-xl shadow-lg px-2 pt-1 pb-2 md:px-4 md:pt-1.5 md:pb-2.5 md:gap-1 md:rounded-[28px] justify-around md:justify-center overflow-hidden"
        style={{
          boxShadow: '0 8px 32px -4px hsl(var(--foreground) / 0.3)',
        }}
      >
        {/* Sliding spotlight indicator */}
        {activeIndex >= 0 && (
          <div
            className="absolute top-0 pointer-events-none z-0 flex flex-col items-center"
            style={{
              left: spotlightX,
              width: spotlightW,
              transform: 'translateX(-50%)',
              top: 0,
              bottom: 0,
              transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            aria-hidden="true"
          >
            {/* Light source capsule */}
            <span
              className="shrink-0 rounded-full"
              style={{
                width: '30px',
                height: '4px',
                background: 'rgb(255, 126, 80)',
                boxShadow: '0 0 8px 2px rgba(255, 126, 80, 0.5)',
              }}
            />
            {/* Trapezoid beam */}
            <span
              className="flex-1 w-full"
              style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                background: 'linear-gradient(to bottom, rgba(255, 126, 80, 0.4), transparent)',
              }}
            />
          </div>
        )}

        {tabs.map((tab, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={tab.path}
              ref={el => { buttonsRef.current[i] = el; }}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className="relative z-10 flex flex-col items-center justify-center min-w-[48px] min-h-[48px] md:min-w-[56px] md:min-h-[52px] px-1 md:px-2 active:scale-90 transition-transform duration-150"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span
                className="relative z-10 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full"
                style={{ transition: 'color 0.4s ease' }}
              >
                {tab.svgSrc ? (
                  <img
                    src={tab.svgSrc}
                    alt=""
                    className="w-[22px] h-[22px] md:w-[24px] md:h-[24px]"
                    style={{
                      transition: 'filter 0.4s ease',
                      filter: isActive
                        ? 'brightness(0) saturate(100%) invert(72%) sepia(60%) saturate(400%) hue-rotate(5deg)'
                        : 'invert(1) opacity(0.55)',
                    }}
                  />
                ) : (
                  tab.icon && (
                    <tab.icon
                      size={19}
                      strokeWidth={isActive ? 2.2 : 1.6}
                      className="md:[&]:w-5 md:[&]:h-5"
                      style={{
                        transition: 'color 0.4s ease',
                        color: isActive ? 'rgb(255, 126, 80)' : 'rgba(255,255,255,0.5)',
                      }}
                    />
                  )
                )}
              </span>
              <span
                className="text-[9px] md:text-[10px] leading-tight mt-0.5 truncate max-w-[52px]"
                style={{
                  transition: 'color 0.4s ease, font-weight 0.2s ease',
                  color: isActive ? 'rgb(255, 126, 80)' : 'rgba(255,255,255,0.45)',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;