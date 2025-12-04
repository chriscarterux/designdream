'use client';

import Image from 'next/image';

const companies = [
  { name: 'Company 1', logo: '/logos/01_logo.png' },
  { name: 'Company 2', logo: '/logos/02_logo.png' },
  { name: 'Company 3', logo: '/logos/03_logo.png' },
  { name: 'Company 4', logo: '/logos/04_logo.png' },
  { name: 'Company 5', logo: '/logos/05_logo.png' },
  { name: 'Company 6', logo: '/logos/06_logo.png' },
  { name: 'Company 7', logo: '/logos/07_logo.png' },
  { name: 'Company 8', logo: '/logos/09_logo.png' },
];

export function LogoTicker() {
  return (
    <div className="w-full overflow-hidden py-4">
      <div className="logo-track flex gap-8">
        {/* First set of logos */}
        {companies.map((company, index) => (
          <div
            key={`first-${index}`}
            className="flex-shrink-0 rounded-lg bg-white/95 px-6 py-4 hover:bg-white transition-all duration-300 cursor-pointer hover:scale-105"
          >
            <Image
              src={company.logo}
              alt={company.name}
              width={140}
              height={60}
              className="h-10 w-auto object-contain"
            />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {companies.map((company, index) => (
          <div
            key={`second-${index}`}
            className="flex-shrink-0 rounded-lg bg-white/95 px-6 py-4 hover:bg-white transition-all duration-300 cursor-pointer hover:scale-105"
            aria-hidden="true"
          >
            <Image
              src={company.logo}
              alt={company.name}
              width={140}
              height={60}
              className="h-10 w-auto object-contain"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% - 2rem));
          }
        }

        .logo-track {
          animation: scroll 40s linear infinite;
          will-change: transform;
        }

        .logo-track:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .logo-track {
            animation-duration: 25s;
          }
        }
      `}</style>
    </div>
  );
}
