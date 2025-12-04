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
    <div className="w-full overflow-hidden">
      <div className="relative flex">
        {/* First set of logos */}
        <div className="flex animate-scroll items-center space-x-16 px-8">
          {companies.map((company, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={company.logo}
                alt={company.name}
                width={140}
                height={60}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex animate-scroll items-center space-x-16 px-8" aria-hidden="true">
          {companies.map((company, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={company.logo}
                alt={company.name}
                width={140}
                height={60}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
