/**
 * @file ShootingStarsBackground.tsx
 * @description Animated shooting stars background for login page
 * @module components/ui
 */

'use client';

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

export default function ShootingStarsBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate 15 shooting stars with random positions and timings
    const generatedStars: Star[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 15}s`,
      animationDuration: `${3 + Math.random() * 4}s`, // 3-7 seconds
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#1A1332] to-[#0A0A1A]">
      {/* Static stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={`static-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Shooting stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute shooting-star"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration,
          }}
        />
      ))}

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 via-transparent to-transparent pointer-events-none" />

      <style jsx>{`
        .shooting-star {
          width: 2px;
          height: 2px;
          background: linear-gradient(90deg, #fff, transparent);
          border-radius: 50%;
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8));
          animation: shoot infinite ease-out;
        }

        .shooting-star::before {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 1px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), transparent);
        }

        @keyframes shoot {
          0% {
            transform: translate(0, 0) rotate(-45deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translate(-300px, 300px) rotate(-45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
