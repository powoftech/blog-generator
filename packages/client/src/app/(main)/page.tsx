import { cookies } from 'next/headers'
import Link from 'next/link'
import { Blog } from './@types/blog'
import BlogCard from './_components/blog-card'

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const page = (await searchParams).page

  const cookieStore = await cookies()
  const connectSid = cookieStore.get('connect.sid')

  const response = await fetch(
    `${process.env.API_URL}/blogs?page=${page}&limit=${12}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `connect.sid=${connectSid?.value}`,
      },
    },
  )

  if (!response.ok) {
    return (
      <div className="relative">
        <div className="mx-auto max-w-7xl px-2">
          <div className="flex w-full flex-col items-center justify-center text-center">
            <Link
              href={'/generate'}
              className="border-foreground/5 bg-foreground/5 text-foreground hover:bg-foreground/10 active:bg-foreground/20 rounded-lg border px-3 py-1.5 text-center text-sm/6 font-medium backdrop-blur-md transition-all duration-200 ease-in-out select-none"
            >
              Generate your first blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const data = await response.json()
  const blogs: Blog[] = data.blogs
  const pagination: {
    total: number
    page: number
    limit: number
    pages: number
  } = data.pagination

  return (
    <>
      <div className="relative h-full">
        <div className="mx-auto flex h-full max-w-7xl flex-col items-center justify-between px-2">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="col-span-full mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/?page=${pageNum}`}
                      className={`flex h-8 w-8 items-center justify-center rounded-md ${
                        Number(page || 1) === pageNum
                          ? 'bg-foreground text-background hover:bg-foreground/85 active:bg-foreground/70'
                          : 'border-foreground/5 hover:bg-foreground/10 active:bg-foreground/20 border'
                      } transition-colors`}
                    >
                      {pageNum}
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
