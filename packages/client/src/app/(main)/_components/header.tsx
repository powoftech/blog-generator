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
  const { user, logout } = useUser()

  // useEffect(() => {
  //   async function loadUser() {
  //     await fetchUser()
  //   }
  //   loadUser()
  // }, [fetchUser])

  return (
    <>
      <header className={cn('relative px-4 sm:px-6', className)}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <Link href={'/'}>
              <Logo className="fill-foreground h-6 w-fit" />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-4 text-sm/6 font-semibold">
            {!user ? (
              <Link href={'/signin'} className="inline-flex rounded-full">
                <UserIcon className="size-6" />
              </Link>
            ) : (
              <Menu>
                <MenuButton className="inline-flex cursor-pointer rounded-full">
                  <UserIcon className="size-6" />
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className="border-foreground/5 bg-foreground/5 text-foreground w-fit origin-top-right rounded-xl border p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-2)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
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
          </div>
        </div>
      </header>
    </>
  )
}
