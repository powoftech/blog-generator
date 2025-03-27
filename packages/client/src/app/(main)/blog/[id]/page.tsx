import { TZDate } from '@date-fns/tz'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

type Blog = {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export default async function BlogItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const connectSid = cookieStore.get('connect.sid')

  const response = await fetch(`${process.env.API_URL}/blogs/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `connect.sid=${connectSid?.value}`,
    },
  })

  if (!response.ok) {
    return (
      <div className="relative">
        <div className="mx-auto max-w-7xl px-2">
          <div className="flex w-full flex-col items-center justify-center text-center">
            <div className="font-semibold">
              Sorry, this blog isn&apos;t available
            </div>
            <div className="text-foreground/50 mt-3">
              The link you followed may be broken, or the blog may have been
              removed.
            </div>
            <Link
              href={'/'}
              className="bg-foreground text-background hover:bg-foreground/85 active:bg-foreground/70 mt-4 rounded-lg px-3 py-1.5 text-center text-sm/6 font-medium transition-all duration-200 ease-in-out select-none"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const data = await response.json()
  const blog: Blog = data.blog

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-2">
        <h2 className="text-3xl font-extrabold md:text-4xl">{blog.title}</h2>
        <div className="text-foreground/60 mt-4 line-clamp-2 flex items-center gap-x-2 text-sm md:text-base">
          <span>{blog.author.email.split('@')[0]}</span>
          <span>•</span>
          <span title={new TZDate(blog.createdAt).toString()}>
            {new TZDate(blog.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              minute: '2-digit',
              hour: '2-digit',
              hour12: true,
              timeZoneName: 'short',
            })}
          </span>
        </div>
        <div className="prose prose-invert prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-li:marker:text-foreground prose-pre:bg-foreground/10 mt-9 max-w-none rounded-lg text-sm md:text-base">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code: ({ children, ...props }) => (
                <code className="bg-foreground/10" {...props}>
                  {children}
                </code>
              ),
            }}
          >
            {blog.content}
          </Markdown>
        </div>
      </div>
    </div>
  )
}
