'use client'

import { Field, Input, Label } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function Search() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)

    params.set('page', '1')

    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <Field className="relative">
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <Input
        type="search"
        className="peer bg-foreground/5 text-foreground block w-full rounded-lg px-3 py-1.5 pl-10 text-sm/6"
        placeholder={'Search blogs...'}
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="text-foreground/50 peer-focus:text-foreground/90 absolute top-1/2 left-3 size-5 -translate-y-1/2" />
    </Field>
  )
}
