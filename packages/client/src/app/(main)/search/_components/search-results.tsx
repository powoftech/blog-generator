import { cookies } from 'next/headers'
import Link from 'next/link'
import { Blog } from '../../@types/blog'
import BlogCard from '../../_components/blog-card'

export default async function SearchResults({
  query,
  page,
}: {
  query: string
  page: string | string[] | undefined
}) {
  const cookieStore = await cookies()
  const connectSid = cookieStore.get('connect.sid')

  if (!query) {
    return (
      <div className="text-foreground/50 text-center">
        Please enter a search term.
      </div>
    )
  }

  const response = await fetch(
    `${process.env.API_URL}/blogs/search?query=${query}&page=${page}&limit=${9}`,
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
      <div className="text-foreground/50 text-center">
        No results found for <strong>{query}</strong>
      </div>
    )
  }

  const data = await response.json()
  const blogs: Blog[] = data.blogs

  if (blogs.length === 0) {
    return (
      <div className="text-foreground/50 text-center">
        No results found for <strong>{query}</strong>
      </div>
    )
  }

  const pagination: {
    total: number
    page: number
    limit: number
    pages: number
  } = data.pagination

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
      {pagination.pages > 1 && (
        <div className="col-span-full mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Link
                  key={pageNum}
                  href={`/search?query=${query}&page=${pageNum}`}
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
    </>
  )
}
