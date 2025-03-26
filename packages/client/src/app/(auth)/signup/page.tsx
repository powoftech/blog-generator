'use client'

import Logo from '@/app/_assets/logo.svg'
import { cn } from '@/lib/utils'
import {
  Button,
  Description,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
} from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Toaster, toast } from 'sonner'
import * as z from 'zod'

const schema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type Schema = z.infer<typeof schema>

export default function SignUpPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Schema) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: data.email, password: data.password }),
    })

    if (!response.ok) {
      const error = await response.json()
      if (!response.status.toString().startsWith('5')) {
        toast.error(`${error.error}`)
      } else {
        toast.error('Server error. Please try again later.')
      }
      return
    }

    // const result = await response.json()
    // toast.success('User created successfully')

    // Redirect to sign in page

    toast.success('Successfully signed up. Redirecting...')

    // Sleep for 1 second before redirecting
    await new Promise((resolve) => setTimeout(resolve, 1000))

    router.push('/signin')
  }

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center">
      <Toaster />
      <div className="absolute -z-10 block size-64 rounded-full bg-white/15 blur-2xl"></div>
      <div className="w-full max-w-lg px-4">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Fieldset className="space-y-6 rounded-xl bg-white/5 p-6 sm:p-10">
            <div className="mx-auto flex h-6 w-28 items-center justify-center py-3 text-center">
              <Link href={'/'}>
                <Logo className="fill-foreground h-6 w-28" />
              </Link>
            </div>
            <Legend className="text-base/7 font-semibold text-white">
              Sign up
            </Legend>
            <Field>
              <Label className="text-sm/6 font-medium text-white">
                Email address
              </Label>
              <Input
                {...register('email')}
                type="email"
                className={cn(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                )}
              />
              {errors.email && (
                <Description className="mt-2 text-sm text-red-400">
                  {errors.email.message}
                </Description>
              )}
            </Field>
            <Field>
              <Label className="text-sm/6 font-medium text-white">
                Password
              </Label>
              <Input
                {...register('password')}
                type="password"
                className={cn(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                )}
              />
              {errors.password && (
                <Description className="mt-2 text-sm text-red-400">
                  {errors.password.message}
                </Description>
              )}
            </Field>
            <Field>
              <Label className="text-sm/6 font-medium text-white">
                Password
              </Label>
              <Input
                {...register('confirmPassword')}
                type="password"
                className={cn(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                )}
              />
              {errors.confirmPassword && (
                <Description className="mt-2 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </Description>
              )}
            </Field>

            <div className="flex w-full items-center justify-start">
              <Button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#404040] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[hover]:bg-[#525252] data-[open]:bg-gray-700"
              >
                Submit
              </Button>
            </div>
            <div className="text-sm/6 text-white/80">
              <span>Already have an account?</span>{' '}
              <Link
                href={'/signin'}
                className="inline-flex font-semibold text-white underline underline-offset-2"
              >
                Sign in here.
              </Link>
            </div>
          </Fieldset>
        </form>
      </div>
    </div>
  )
}
