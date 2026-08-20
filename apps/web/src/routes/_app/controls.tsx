import { Button } from '#/components/ui/button'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { AnimatePresence, motion } from 'motion/react'

import { useEffect, useState } from 'react'

import { ModeToggle } from '#/components/mode-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  CancelCircleFreeIcons,
  InspectCodeFreeIcons,
  MapPinIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Menu } from 'lucide-react'

import * as z from 'zod'

import { RouteCard } from '#/components/RouteCard'
import { Field, FieldGroup } from '#/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '#/components/ui/input-group'
import { cn } from '#/lib/utils'
import { useForm } from '@tanstack/react-form'
import { mockRoutes } from './mock-routes'

const formSchema = z.object({
  userLocate: z.string().min(1),
  destiny: z.string().min(1),
})

export type RouteLeg =
  | {
      type: 'walk'
      duration: number
    }
  | {
      type: 'bus'
      line: string
      color: string
    }
  | {
      type: 'subway'
      line: string
      color: string
    }
  | {
      type: 'train'
      line: string
      color: string
    }

export type MockRoute = {
  id: string
  duration: number
  departure: string
  arrival: string
  price: number
  recommended: boolean
  live: boolean
  color: string
  description: string
  legs: readonly RouteLeg[]
}

export const Route = createFileRoute('/_app/controls')({
  ssr: false,
  component: RouteComponent,
})

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(false)

  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      userLocate: '',
      destiny: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsOpen(true)
      console.log(value)
    },
  })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords

      form.setFieldValue('userLocate', `${latitude},${longitude}`)
    })
  }, [])

  return (
    <div className="flex flex-col flex-1 justify-between items-ender">
      {/* <Drawer>
        <DrawerTrigger render={<Button variant={'outline'} className={''} />}>
          Open Route Selector
        </DrawerTrigger>
        <DrawerContent
          className={'max-h-[300px] overflow-hidden rounded-t-4xl! bg-blue-500'}
        >
          <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[300px] scrollbar-none scroll-fade">
            {mockRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </DrawerContent>
      </Drawer> */}

      {/* controls */}
      <div className="flex items-center justify-between w-full p-4">
        <Button
          variant="outline"
          size="icon-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <HugeiconsIcon icon={InspectCodeFreeIcons} />
        </Button>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon-lg" />}
            >
              <Menu />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate({ to: '/' })}>
                Map
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {/* Route card*/}
        <motion.div
          animate={{
            height: isOpen ? 350 : 56,
            margin: isOpen ? 0 : 16,
            padding: isOpen ? 16 : 6,
            alignItems: isOpen ? 'start' : 'center',
            borderRadius: isOpen ? '20px 20px 0px 0px' : 12,
            transition: { ease: 'easeOut' },
          }}
          className={'flex flex-col border flex bg-card overflow-y-auto gap-4'}
        >
          {/* Search input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="w-full"
          >
            <FieldGroup className="w-full">
              <form.Field
                name="destiny"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <InputGroup
                        className={cn(
                          'rounded-md! bg-transparent! h-10 w-full px-1 gap-1',
                          isOpen && 'rounded-lg!',
                        )}
                      >
                        <InputGroupAddon>
                          <HugeiconsIcon icon={MapPinIcon} className="size-5" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onKeyDown={(e) => {
                            if (e.key == 'Enter') {
                              e.preventDefault()
                              form.handleSubmit()
                            }
                          }}
                          enterKeyHint="search"
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Pesquisar destino..."
                          autoComplete="off"
                        />
                        {field.state.value && (
                          <InputGroupButton
                            type="button"
                            size="icon-sm"
                            className="text-muted-foreground"
                            onClick={() => {
                              setIsOpen(false)
                              field.handleChange('')
                            }}
                          >
                            <HugeiconsIcon
                              icon={CancelCircleFreeIcons}
                              className="size-5"
                            />
                          </InputGroupButton>
                        )}
                      </InputGroup>
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </form>

          {/* Routes */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: isOpen ? 1 : 0,
            }}
            className="w-full flex flex-col gap-2  overflow-y-auto max-h-[300px] scrollbar-none scroll-fade"
          >
            {mockRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
