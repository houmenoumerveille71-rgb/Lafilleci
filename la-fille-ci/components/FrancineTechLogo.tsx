'use client';

import Link from 'next/link';

type FrancineTechLogoProps = {
  className?: string;
  compact?: boolean;
};

export default function FrancineTechLogo({ className = '', compact = false }: FrancineTechLogoProps) {
  const sizeClass = compact
    ? 'h-10 w-10 sm:h-11 sm:w-11'
    : 'h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16';

  return (
    <Link
      href="/"
      aria-label="Accueil"
      className={`group inline-flex items-center shrink-0 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 1200"
        className={`${sizeClass} francine-tech-logo transition-transform duration-300 ease-out group-hover:scale-[1.03]`}
        role="img"
        aria-labelledby="francine-tech-title"
      >
        <title id="francine-tech-title">FrançineTech</title>
        <defs>
          <radialGradient id="ft-bg">
            <stop offset="0" stopColor="#211006" />
            <stop offset=".7" stopColor="#0b0806" />
            <stop offset="1" stopColor="#020202" />
          </radialGradient>

          <linearGradient id="ft-orange" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fff0a0" />
            <stop offset=".22" stopColor="#ffae18" />
            <stop offset=".55" stopColor="#ff6900" />
            <stop offset="1" stopColor="#9d3200" />
          </linearGradient>

          <linearGradient id="ft-silver" x1="0" y1="0" x2=".8" y2="1">
            <stop stopColor="#ffffff" />
            <stop offset=".3" stopColor="#b9b9b9" />
            <stop offset=".55" stopColor="#ffffff" />
            <stop offset=".8" stopColor="#858585" />
            <stop offset="1" stopColor="#e9e9e9" />
          </linearGradient>

          <linearGradient id="ft-metalF" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fff" />
            <stop offset=".42" stopColor="#d4d4d4" />
            <stop offset=".7" stopColor="#ff9c22" />
            <stop offset="1" stopColor="#b74b00" />
          </linearGradient>

          <linearGradient id="ft-wave" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#8b3000" />
            <stop offset=".35" stopColor="#ff8a00" />
            <stop offset=".65" stopColor="#ffbd48" />
            <stop offset="1" stopColor="#b74700" />
          </linearGradient>

          <linearGradient id="ft-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset=".45" stopColor="#ffffff" stopOpacity="0" />
            <stop offset=".5" stopColor="#ffffff" stopOpacity=".55" />
            <stop offset=".55" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <filter id="ft-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="ft-softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <circle cx="600" cy="600" r="590" fill="url(#ft-bg)" />

        {/* Outer luminous ring */}
        <g className="ft-ring-glow">
          <circle
            cx="600"
            cy="600"
            r="555"
            fill="none"
            stroke="#ff7500"
            strokeWidth="16"
            opacity=".3"
            filter="url(#ft-glow)"
          />
          <circle cx="600" cy="600" r="555" fill="none" stroke="url(#ft-orange)" strokeWidth="5" />
          <circle cx="600" cy="600" r="541" fill="none" stroke="#ffb13b" strokeWidth="1.5" opacity=".65" />
        </g>

        {/* Small digital pixels */}
        <g fill="url(#ft-orange)" filter="url(#ft-softGlow)">
          <rect x="842" y="164" width="24" height="24" />
          <rect x="875" y="143" width="32" height="32" />
          <rect x="890" y="193" width="23" height="23" />
          <rect x="862" y="226" width="13" height="13" />
        </g>

        {/* Laptop outline */}
        <path
          d="M350 495 L350 360 Q350 337 375 337 L452 337"
          fill="none"
          stroke="#ff8b00"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M305 506 L710 506 Q730 506 746 527 L780 541 L302 541"
          fill="none"
          stroke="url(#ft-orange)"
          strokeWidth="12"
          strokeLinejoin="round"
          filter="url(#ft-softGlow)"
        />

        {/* Main F monogram */}
        <g className="ft-f-sheen">
          <path
            d="M447 542
               L493 270
               Q499 232 539 232
               L748 232
               L709 297
               L563 297
               L550 352
               L665 352
               L624 417
               L537 417
               L514 504
               Q502 553 447 542 Z"
            fill="url(#ft-metalF)"
            stroke="#fff"
            strokeWidth="3"
          />
          <path
            d="M447 542
               L493 270
               Q499 232 539 232
               L748 232
               L709 297
               L563 297
               L550 352
               L665 352
               L624 417
               L537 417
               L514 504
               Q502 553 447 542 Z"
            fill="url(#ft-sheen)"
            className="ft-f-sheen-overlay"
            style={{ mixBlendMode: 'screen' }}
          />
        </g>

        {/* Orange sweep around F */}
        <path
          d="M512 443
             C616 425 687 355 776 292
             C817 263 810 220 761 202
             C834 207 867 252 827 297
             C757 372 660 434 512 443 Z"
          fill="url(#ft-orange)"
          filter="url(#ft-softGlow)"
        />

        <path
          d="M514 443 C642 413 739 329 805 266"
          fill="none"
          stroke="#ffd27c"
          strokeWidth="3"
        />

        {/* Code symbol */}
        <g fill="none" stroke="url(#ft-orange)" strokeWidth="12" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M735 400 L690 436 L735 470" />
          <path d="M846 400 L892 436 L846 470" />
          <path d="M816 386 L773 487" />
        </g>

        {/* Brand name */}
        <text
          x="600"
          y="698"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="116"
          fontWeight="700"
          letterSpacing="-5"
        >
          <tspan fill="url(#ft-silver)">Françine</tspan>
          <tspan fill="url(#ft-orange)">Tech</tspan>
        </text>

        {/* Orange underline */}
        <path
          d="M260 726 Q350 714 458 718"
          stroke="url(#ft-orange)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />

        {/* Tagline */}
        <text
          x="600"
          y="784"
          textAnchor="middle"
          fill="#eeeeee"
          fontFamily="Arial, sans-serif"
          fontSize="29"
          letterSpacing="11"
        >
          DÉVELOPPEMENT WEB &amp; MOBILE
        </text>

        {/* Service icons */}
        <g fill="none" stroke="#ff8500" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
          {/* Laptop */}
          <rect x="295" y="842" width="106" height="76" rx="8" />
          <path d="M278 929 L418 929 L408 941 L288 941 Z" />
          <path d="M328 869 L310 881 L328 894 M365 869 L383 881 L365 894 M351 865 L340 898" />

          {/* Phone */}
          <rect x="518" y="842" width="53" height="99" rx="11" />
          <path d="M537 852 L552 852 M538 929 L552 929" />

          {/* Shopping cart */}
          <path d="M678 853 L695 853 L710 914 L759 914 L775 872 L704 872" />
          <circle cx="716" cy="932" r="7" />
          <circle cx="757" cy="932" r="7" />

          {/* Layers */}
          <path d="M861 866 L901 845 L942 866 L901 890 Z" />
          <path d="M861 887 L901 911 L942 887" />
          <path d="M861 909 L901 933 L942 909" />
        </g>

        {/* Dividers */}
        <g stroke="#777" opacity=".5" strokeWidth="2">
          <path d="M474 842 L474 945" />
          <path d="M624 842 L624 945" />
          <path d="M819 842 L819 945" />
        </g>

        {/* Bottom luminous wave */}
        <path
          d="M190 1010
             C370 905 460 950 598 1004
             C753 1065 837 1040 1010 954
             C909 1080 755 1110 605 1052
             C438 990 335 963 190 1010 Z"
          fill="url(#ft-wave)"
          opacity=".85"
          filter="url(#ft-softGlow)"
        />

        <path
          d="M185 1012
             C360 922 460 956 598 1014
             C754 1080 866 1030 1012 960"
          fill="none"
          stroke="#ffc45c"
          strokeWidth="3"
        />

        {/* Bottom ring highlight */}
        <path
          d="M280 1105 Q600 1170 920 1094"
          fill="none"
          stroke="#ff7900"
          strokeWidth="3"
          opacity=".8"
          filter="url(#ft-softGlow)"
        />
      </svg>
    </Link>
  );
}
