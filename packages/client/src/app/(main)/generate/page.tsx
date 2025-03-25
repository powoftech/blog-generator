'use client'

import { useUser } from '@/app/_contexts/user-context'
import { cn } from '@/lib/utils'
import { Button, Field, Input, Label, Textarea } from '@headlessui/react'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MarkdownHooks } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeStarryNight from 'rehype-starry-night'
import remarkGfm from 'remark-gfm'
import { toast, Toaster } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useUser()
  const handleChange = useDebouncedCallback(
    (setValue: (value: string) => void, value: string) => {
      setValue(value)
    },
    200,
  )

  const handleGenerate = async () => {
    setLoading(true)
    try {
      if (!prompt) {
        toast.error('Please enter a prompt.')
        return
      }

      const response = await fetch('/api/blogs/generate', {
        body: JSON.stringify({ prompt }),
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      const data = await response.json()

      setTitle(data.title)
      setContent(data.content)
    } catch (error) {
      console.error(error)
      toast.error('Server error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/blogs', {
        body: JSON.stringify({ title, content }),
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }
      toast.success('Blog saved successfully!')

      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push('/')
    } catch (error) {
      console.error('Error generating content:', error)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/signin')
    }
  }, [router, user])

  return (
    <div className="relative">
      <Toaster />
      <div className="mx-auto max-w-7xl px-2">
        <div className="w-full">
          <Field className="relative">
            <Label className="text-foreground text-sm/6 font-medium">
              Prompt
            </Label>
            <Textarea
              placeholder="Write a blog post about..."
              // value={prompt}
              onChange={(e) => handleChange(setPrompt, e.target.value)}
              disabled={loading}
              className={cn(
                'bg-foreground/5 text-foreground mt-3 block min-h-24 w-full resize-none rounded-lg border-none px-3 py-1.5 text-sm/6',
                'disabled:text-foreground/50 data-[focus]:outline-foreground/25 focus:outline-none disabled:select-none data-[focus]:outline-2 data-[focus]:-outline-offset-2',
              )}
              rows={3}
            />
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="bg-foreground text-background not-disabled:hover:bg-foreground/85 not-disabled:active:bg-foreground/70 absolute right-3 bottom-3 cursor-pointer rounded-full p-1.5 transition-all duration-200 ease-in-out select-none disabled:cursor-not-allowed disabled:opacity-50 disabled:select-none"
            >
              <ArrowUpIcon className="stroke-background size-4 stroke-1" />
            </Button>
          </Field>
        </div>
        <hr className="border-foreground/5 mt-3" />
        <div className="mt-3 h-full">
          <div className="grid h-full grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex h-full flex-col gap-3">
              <Field className="relative">
                <Label className="text-foreground text-sm/6 font-medium">
                  Blog Title
                </Label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white"
                />
              </Field>
              <Field className="relative h-full">
                <Label className="text-sm/6 font-medium text-white">
                  Blog Content
                </Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-3 block h-[26rem] w-full resize-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 md:h-[30rem]"
                  rows={10}
                />
              </Field>
            </div>

            <Field className="h-full w-full overflow-auto rounded-lg">
              <Label className="mb-3 text-sm/6 font-medium text-white">
                Preview
              </Label>
              <div className="prose prose-invert !prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-li:marker:text-foreground mt-3 h-[26rem] max-w-none overflow-auto rounded-lg bg-white/5 px-6 py-6 text-sm md:h-[calc(30rem+0.75rem+4.53125rem)] md:text-base">
                <MarkdownHooks
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeStarryNight, rehypeRaw]}
                  components={{
                    // pre: ({ children, ...props }) => {
                    //   // Extract code content from pre > code structure
                    //   const codeElement = React.Children.toArray(children).find(
                    //     (child) =>
                    //       React.isValidElement(child) && child.type === 'code',
                    //   )

                    //   const codeContent = React.isValidElement(codeElement)
                    //     ? React.Children.toArray(
                    //         codeElement.props?.children,
                    //       ).join('')
                    //     : ''

                    //   return (
                    //     <div className="relative">
                    //       <pre
                    //         // className="overflow-auto rounded-md bg-white/5 p-4"
                    //         {...props}
                    //       >
                    //         {children}
                    //       </pre>
                    //       <button
                    //         onClick={() => {
                    //           console.log(codeContent)
                    //           navigator.clipboard.writeText(
                    //             typeof codeContent === 'string'
                    //               ? codeContent
                    //               : '',
                    //           )
                    //           toast.success('Code copied to clipboard')
                    //         }}
                    //         className="absolute top-2 right-2 cursor-pointer rounded-md p-2.5 transition-colors hover:bg-white/10 active:bg-white/20"
                    //         aria-label="Copy code to clipboard"
                    //       >
                    //         <DocumentDuplicateIcon className="size-5" />
                    //       </button>
                    //     </div>
                    //   )
                    // },
                    code: ({ children, ...props }) => (
                      <code className="bg-foreground/10" {...props}>
                        {children}
                      </code>
                    ),
                  }}
                >
                  {content || '*Preview will appear here*'}
                </MarkdownHooks>
              </div>
            </Field>
            <div className="flex w-full items-center justify-center md:col-span-2">
              <Button
                onClick={handleSave}
                disabled={!title || !content}
                className="bg-foreground text-background not-disabled:hover:bg-foreground/85 not-disabled:active:bg-foreground/70 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-1.5 text-center text-sm/6 font-medium transition-all duration-200 ease-in-out select-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[focus]:outline-1"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt"
        disabled={loading}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {content && (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            cols={50}
          />
          <button onClick={handleSave}>Save Blog</button>
        </>
      )} */}
    </div>
  )
}
