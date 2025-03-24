import Link from 'next/link'

export default async function BlogPage() {
  return (
    <>
      {/* <div className="h-16"></div> */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-2 pb-8">
          <div className="mt-2 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            <Link href={''} className="group focus:outline-none">
              <div className="bg-foreground/[4%] group-hover:bg-foreground/[6%] group-focus-visible:ring-foreground relative flex h-64 items-center justify-center transition-colors group-focus-visible:ring-1"></div>
              <div className="text-foreground mt-2 truncate pt-2.5 text-sm font-semibold">
                Title
              </div>
            </Link>
            <Link href={''} className="group focus:outline-none">
              <div className="bg-foreground/[4%] group-hover:bg-foreground/[6%] group-focus-visible:ring-foreground relative flex h-64 items-center justify-center transition-colors group-focus-visible:ring-1"></div>
              <div className="text-foreground mt-2 truncate pt-2.5 text-sm font-semibold">
                Title
              </div>
            </Link>
            <Link href={''} className="group focus:outline-none">
              <div className="bg-foreground/[4%] group-hover:bg-foreground/[6%] group-focus-visible:ring-foreground relative flex h-64 items-center justify-center transition-colors group-focus-visible:ring-1"></div>
              <div className="text-foreground mt-2 truncate pt-2.5 text-sm font-semibold">
                Title
              </div>
            </Link>
            <Link href={''} className="group focus:outline-none">
              <div className="bg-foreground/[4%] group-hover:bg-foreground/[6%] group-focus-visible:ring-foreground relative flex h-64 items-center justify-center transition-colors group-focus-visible:ring-1"></div>
              <div className="text-foreground mt-2 truncate pt-2.5 text-sm font-semibold">
                Title
              </div>
            </Link>
            <Link href={''} className="group focus:outline-none">
              <div className="bg-foreground/[4%] group-hover:bg-foreground/[6%] group-focus-visible:ring-foreground relative flex h-64 items-center justify-center transition-colors group-focus-visible:ring-1"></div>
              <div className="text-foreground mt-2 truncate pt-2.5 text-sm font-semibold">
                Title
              </div>
            </Link>
            <Link href={''} className="group focus:outline-none">
              <div className="bg-foreground/[4%] group-hover:bg-foreground/[6%] group-focus-visible:ring-foreground relative flex h-64 items-center justify-center transition-colors group-focus-visible:ring-1"></div>
              <div className="text-foreground mt-2 truncate pt-2.5 text-sm font-semibold">
                Title
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
