'use client'

import { useUser } from '@/app/_contexts/user-context'
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
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast, Toaster } from 'sonner'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
})

type Schema = z.infer<typeof schema>

export default function SignInPage() {
  const router = useRouter()
  const { fetchUser } = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Schema) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: data.email, password: data.password }),
    })

    if (!response.ok) {
      // const error = await response.json()
      toast.error('Error signing in')
      return
    }

    fetchUser()

    router.push('/')
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Toaster />
      <div className="absolute -z-10 block size-64 rounded-full bg-white/15 blur-2xl"></div>
      <div className="w-full max-w-lg px-4">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Fieldset className="space-y-6 rounded-xl bg-white/5 p-6 sm:p-10">
            <Legend className="text-base/7 font-semibold text-white">
              Sign in
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
            <div className="flex w-full items-center justify-start">
              <Button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-[#404040] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[hover]:bg-[#525252] data-[open]:bg-gray-700"
              >
                Submit
              </Button>
            </div>
          </Fieldset>
        </form>
      </div>
    </div>
  )
}
