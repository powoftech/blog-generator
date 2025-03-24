'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function RedirectTabBar() {
  const pathname = usePathname()

  return (
    <>
      <div className="flex gap-4 py-8">
        <Link
          href={'/'}
          className={cn(
            'rounded-full px-3 py-1 text-sm/6 font-semibold select-none',
            pathname === '/'
              ? 'bg-foreground/10 text-foreground'
              : 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground/75',
          )}
        >
          Blog
        </Link>
        <Link
          href={'/search'}
          className={cn(
            'rounded-full px-3 py-1 text-sm/6 font-semibold select-none',
            pathname === '/search'
              ? 'bg-foreground/10 text-foreground'
              : 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground/75',
          )}
        >
          Search
        </Link>
        <Link
          href={'/generate'}
          className={cn(
            'rounded-full px-3 py-1 text-sm/6 font-semibold select-none',
            pathname === '/generate'
              ? 'bg-foreground/10 text-foreground'
              : 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground/75',
          )}
        >
          Generate
        </Link>
      </div>
    </>
  )
}
