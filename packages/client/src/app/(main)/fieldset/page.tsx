import {
  Description,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Select,
  Textarea,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

export default function Example() {
  return (
    <div className="w-full max-w-lg px-4">
      <Fieldset className="space-y-6 rounded-xl bg-white/5 p-6 sm:p-10">
        <Legend className="text-base/7 font-semibold text-white">
          Shipping details
        </Legend>
        <Field>
          <Label className="text-sm/6 font-medium text-white">
            Street address
          </Label>
          <Input
            className={clsx(
              'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
            )}
          />
        </Field>
        <Field>
          <Label className="text-sm/6 font-medium text-white">Country</Label>
          <Description className="text-sm/6 text-white/50">
            We currently only ship to North America.
          </Description>
          <div className="relative">
            <Select
              className={clsx(
                'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                // Make the text of each option black on Windows
                '*:text-black',
              )}
            >
              <option>Canada</option>
              <option>Mexico</option>
              <option>United States</option>
            </Select>
            <ChevronDownIcon
              className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
              aria-hidden="true"
            />
          </div>
        </Field>
        <Field>
          <Label className="text-sm/6 font-medium text-white">
            Delivery notes
          </Label>
          <Description className="text-sm/6 text-white/50">
            If you have a tiger, we'd like to know about it.
          </Description>
          <Textarea
            className={clsx(
              'mt-3 block w-full resize-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
            )}
            rows={3}
          />
        </Field>
      </Fieldset>
    </div>
  )
}
