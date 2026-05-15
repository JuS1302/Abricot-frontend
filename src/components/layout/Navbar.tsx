'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);
  const { initials } = useAuth();

  return (
    <header className="w-full bg-white h-[94px] shadow-[0px_4px_12px_1px_#00000005]">
      <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        {/* ===== LOGO ===== */}
        <Link href="/dashboard">
          <Image src="/Logo.svg" alt="Abricot" width={147} height={19} />
        </Link>

        {/* ===== LIENS ===== */}
        <div className="flex items-center gap-4">

          <Link
            href="/dashboard"
            className={`
              flex items-center justify-center gap-[17px] transition-colors
              w-[248px] h-[78px] rounded-[10px]
              text-base font-normal font-sans leading-none tracking-normal
              ${isActive('/dashboard')
                ? 'bg-text-primary text-white'
                : 'bg-white text-primary border border-border'
              }
            `}
          >
            <Image
              src={isActive('/dashboard') ? '/Group-white.svg' : '/Group.svg'}
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            Tableau de bord
          </Link>

          <Link
            href="/projects"
            className={`
              flex items-center justify-center gap-[17px] transition-colors
              w-[248px] h-[78px] rounded-[10px]
              text-base font-normal font-sans leading-none tracking-normal
              ${isActive('/projects')
                ? 'bg-text-primary text-white'
                : 'bg-white text-primary border border-border'
              }
            `}
          >
            <Image
              src={isActive('/projects') ? '/Folder-white.svg' : '/Folder.svg'}
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            Projets
          </Link>

        </div>

        {/* ===== AVATAR ===== */}
        <Link href="/account">
          <div className="w-[65px] h-[65px] rounded-full bg-primary-light flex items-center justify-center">
            <span className="text-base font-normal font-sans text-text-primary">
              {initials}
            </span>
          </div>
        </Link>

      </nav>
    </header>
  );
}
