'use client'

import Logo from '@/app/_assets/logo.svg'
import { useUser } from '@/app/_contexts/user-context'
import { cn } from '@/lib/utils'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
} from '@headlessui/react'
import {
  ArrowRightStartOnRectangleIcon,
  AtSymbolIcon,
  UserIcon,
} from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header({ className }: { className?: string }) {
  const router = useRouter()
  const { user, logout, loading } = useUser()

  return (
    <>
      <header className={cn('relative px-4 sm:px-6', className)}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-4 md:py-6">
          <div className="flex items-center">
            <Link
              href={'/'}
              className="flex h-8 w-28 items-center justify-start"
            >
              <Logo className="fill-foreground h-6 w-fit" />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-4 text-sm/6 font-semibold">
            {!loading && (
              <>
                {!user ? (
                  <div className="flex gap-4 font-medium">
                    <Link
                      href={'/signin'}
                      className="active:bg-foreground/20 hover:bg-foreground/10 flex items-center gap-0.5 rounded-full bg-transparent px-3 py-1 backdrop-blur-sm transition-colors duration-200 ease-in-out select-none"
                    >
                      Sign in
                    </Link>
                    <Link
                      href={'/signup'}
                      className="bg-foreground hover:bg-foreground/85 active:bg-foreground/70 flex items-center gap-0.5 rounded-full px-3 py-1 text-black backdrop-blur-sm transition-colors duration-200 ease-in-out select-none"
                    >
                      Sign up
                    </Link>
                  </div>
                ) : (
                  <Menu>
                    <MenuButton className="inline-flex cursor-pointer rounded-full">
                      <UserIcon className="size-6" />
                    </MenuButton>

                    <MenuItems
                      transition
                      anchor="bottom end"
                      className="border-foreground/5 bg-foreground/5 text-foreground w-fit origin-top-right rounded-xl border p-1 text-sm/6 backdrop-blur-md transition duration-100 ease-out [--anchor-gap:var(--spacing-2)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                      <>
                        <MenuItem>
                          <button className="group data-[focus]:bg-foreground/10 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 font-medium">
                            <AtSymbolIcon className="fill-foreground/30 size-4" />
                            {user.email}
                          </button>
                        </MenuItem>
                        <MenuSeparator className="bg-foreground/5 my-1 h-px" />
                        <MenuItem>
                          <button
                            onClick={async () => {
                              await logout()
                              router.refresh()
                            }}
                            className="group data-[focus]:bg-foreground/10 flex w-full items-center gap-2 rounded-lg px-3 py-1.5"
                          >
                            <ArrowRightStartOnRectangleIcon className="fill-foreground/30 size-4" />
                            Sign out
                          </button>
                        </MenuItem>
                      </>
                    </MenuItems>
                  </Menu>
                )}
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
