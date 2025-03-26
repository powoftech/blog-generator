'use client'

import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { toast, Toaster } from 'sonner'

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

function BlogCard({ blog }: { blog: Blog }) {
  const createdAt = new Date(blog.createdAt)
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true })

  // Extract a preview from the content (first 150 characters)
  const contentPreview =
    blog.content.length > 150 ? blog.content.substring(0, 200) : blog.content

  return (
    <Link href={`/blog/${blog._id}`} className="group">
      <article className="border-foreground/5 bg-foreground/5 relative flex h-full flex-col overflow-hidden rounded-lg border backdrop-blur-md transition-all">
        <div className="flex-1 p-6">
          <h3
            title={blog.title}
            className="line-clamp-2 overflow-hidden text-lg leading-tight font-semibold"
          >
            {blog.title}
          </h3>
          <div className="text-foreground/60 mt-1 flex items-center gap-x-2 text-sm">
            <span>{blog.author.email.split('@')[0]}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
          <div className="text-foreground/80 mt-4 line-clamp-3 text-sm leading-relaxed">
            <ReactMarkdown
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
              {contentPreview}
            </ReactMarkdown>
          </div>
        </div>
        <div className="border-foreground/5 cursor-pointer border-t px-6 py-4">
          <div className="text-foreground/60 text-sm">Read more →</div>
        </div>
      </article>
    </Link>
  )
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch(`/api/blogs`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        toast.error('Failed to fetch blogs')
        return
      }

      const data = await response.json()
      console.log(data)
      setBlogs(data.blogs)
    }

    fetchBlogs()
  }, [])

  return (
    <>
      <div className="relative">
        <Toaster />
        <div className="mx-auto max-w-7xl px-2 pb-8">
          <div className="mt-2 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
