import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 400;
const DEFAULT_GLOW_RGB = '79, 70, 229';
const MOBILE_BREAKPOINT = 768;

function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

function createParticleElement(x, y, rgb) {
  const particle = document.createElement('div');
  particle.className = 'mb-particle';
  particle.style.cssText = `left:${x}px;top:${y}px;--mb-glow-rgb:${rgb};`;
  return particle;
}

function calculateSpotlightValues(radius) {
  return {
    proximity: radius * 0.5,
    fadeDistance: radius * 0.75,
  };
}

function updateCardGlowProperties(card, mouseX, mouseY, glowIntensity, radius) {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--mb-glow-x', `${relativeX}%`);
  card.style.setProperty('--mb-glow-y', `${relativeY}%`);
  card.style.setProperty('--mb-glow-intensity', glowIntensity.toString());
  card.style.setProperty('--mb-glow-radius', `${radius}px`);
}

function ParticleCard({
  children,
  className,
  style,
  disableAnimations,
  particleCount,
  glowRgb,
  enableTilt,
  enableMagnetism,
  clickEffect,
}) {
  const cardRef = useRef(null);
  const isHoveredRef = useRef(false);

  const particlesInitialized = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const magnetismAnimationRef = useRef(null);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'back.in(1.7)',
        onComplete: () => particle.parentNode?.removeChild(particle),
      });
    });

    particlesRef.current = [];
  }, []);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowRgb)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowRgb]);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) initializeParticles();

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.7)' }
        );

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 90,
          y: (Math.random() - 0.5) * 90,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });

        gsap.to(clone, {
          opacity: 0.25,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        });
      }, index * 90);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.25,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.25,
          ease: 'power2.out',
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.25,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseMove = (e) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.25,
          ease: 'power2.out',
        });
      }
    };

    const handleClick = (e) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.className = 'mb-ripple';
      ripple.style.cssText = `width:${maxDistance * 2}px;height:${maxDistance * 2}px;left:${x - maxDistance}px;top:${y - maxDistance}px;--mb-glow-rgb:${glowRgb};`;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          onComplete: () => ripple.remove(),
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, clickEffect, disableAnimations, enableMagnetism, enableTilt, glowRgb]);

  return (
    <div
      ref={cardRef}
      className={`mb-card ${className}`.trim()}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
}

function GlobalSpotlight({ gridRef, disableAnimations, enabled, spotlightRadius, glowRgb, maxOpacity }) {
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'mb-global-spotlight';
    spotlight.style.cssText = `--mb-glow-rgb:${glowRgb};`;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.mb-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll('.mb-card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' });
        cards.forEach((card) => card.style.setProperty('--mb-glow-intensity', '0'));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((cardEl) => {
        const cardRect = cardEl.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) glowIntensity = 1;
        else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardEl, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
      });

      const targetOpacity =
        minDistance <= proximity
          ? maxOpacity
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * maxOpacity
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.18 : 0.35,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gridRef.current?.querySelectorAll('.mb-card').forEach((card) => card.style.setProperty('--mb-glow-intensity', '0'));
      if (spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [disableAnimations, enabled, glowRgb, gridRef, maxOpacity, spotlightRadius]);

  return null;
}

export default function MagicBento({
  cards,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_RGB,
  disableAnimations = false,
}) {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  const isLight = typeof document !== 'undefined' && document.body.classList.contains('light');
  const maxOpacity = isLight ? 0.35 : 0.75;

  const resolvedCards = useMemo(() => {
    if (Array.isArray(cards) && cards.length) return cards;
    return [
      { title: 'Worker Monitoring', description: 'Track movement and risk', label: 'Workers' },
      { title: 'Claims & Payouts', description: 'Automated processing engine', label: 'Claims' },
      { title: 'Disruptions', description: 'Live weather & events', label: 'Intel' },
      { title: 'Fraud Detection', description: 'Multi-signal alerts', label: 'Fraud' },
      { title: 'Defense Panel', description: 'Adversarial resilience', label: 'Security' },
      { title: 'Overview', description: 'Platform health at a glance', label: 'Dashboard' },
    ];
  }, [cards]);

  return (
    <div className="mb-section" style={{ ['--mb-glow-rgb']: glowColor }}>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowRgb={glowColor}
          maxOpacity={maxOpacity}
        />
      )}

      <div className="mb-grid" ref={gridRef}>
        {resolvedCards.map((card, index) => {
          const baseClass = [
            textAutoHide ? 'mb-card--text-autohide' : '',
            enableBorderGlow ? 'mb-card--border-glow' : '',
            card.heroImageSrc ? 'mb-card--has-hero' : '',
            card.className || '',
          ]
            .filter(Boolean)
            .join(' ');

          const cardStyle = {
            background: card.background || 'var(--bg-card)',
            borderColor: card.borderColor || 'var(--border)',
            cursor: card.onClick ? 'pointer' : 'default',
          };

          const content = (
            <>
              {card.heroImageSrc && (
                <div className="mb-card__hero" aria-hidden>
                  <img className="mb-card__heroImg" src={card.heroImageSrc} alt="" />
                  <div className="mb-card__heroOverlay" />
                </div>
              )}
              <div className="mb-card__header">
                <div className="mb-card__label">{card.label}</div>
              </div>
              <div className="mb-card__content">
                <h3 className="mb-card__title">{card.title}</h3>
                <p className="mb-card__description">{card.description}</p>
              </div>
            </>
          );

          const onClick = card.onClick;

          if (enableStars) {
            return (
              <ParticleCard
                key={card.key || index}
                className={`mb-card ${baseClass}`.trim()}
                style={cardStyle}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowRgb={glowColor}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                onClick={onClick}
              >
                <div className="mb-card__inner" onClick={onClick}>
                  {content}
                </div>
              </ParticleCard>
            );
          }

          return (
            <div key={card.key || index} className={`mb-card ${baseClass}`.trim()} style={cardStyle} onClick={onClick}>
              <div className="mb-card__inner">{content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
