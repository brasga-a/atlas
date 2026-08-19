import { Button } from '#/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '#/components/ui/drawer'
import { HugeiconsIcon } from '@hugeicons/react'
import { createFileRoute } from '@tanstack/react-router'

import { useState } from 'react'

import { ModeToggle } from '#/components/mode-toggle'
import { RouteCard } from '#/components/RouteCard'
import { ArrowUp01FreeIcons } from '@hugeicons/core-free-icons'

export const mockRoutes = [
  {
    id: 'recommended',
    duration: 32,
    departure: '14:32',
    arrival: '15:04',
    price: 5.2,
    recommended: true,
    live: true,
    color: 'green',
    description: 'A cada 2–4 min do Consolação',
    legs: [
      {
        type: 'walk',
        duration: 5,
      },
      {
        type: 'subway',
        line: '2',
        color: '#2F6DB2',
      },
      {
        type: 'subway',
        line: '11',
        color: '#7A4CC2',
      },
      {
        type: 'walk',
        duration: 6,
      },
    ],
  },
  {
    id: 'recommended',
    duration: 10,
    departure: '14:32',
    arrival: '15:04',
    price: 5.2,
    recommended: false,
    live: true,
    color: 'green',
    description: 'A cada 2–4 min do Consolação',
    legs: [
      {
        type: 'walk',
        duration: 5,
      },
      {
        type: 'subway',
        line: '1',
        color: '#2F6DB2',
      },
    ],
  },

  {
    id: 'cptm',
    duration: 36,
    departure: '14:33',
    arrival: '15:09',
    price: 5.2,
    recommended: false,
    live: false,
    color: 'red',
    description: 'Próximo trem em 3 min da Paulista',
    legs: [
      {
        type: 'walk',
        duration: 8,
      },
      {
        type: 'train',
        line: '12',
        color: '#D92D20',
      },
      {
        type: 'walk',
        duration: 6,
      },
    ],
  },

  {
    id: 'bus',
    duration: 42,
    departure: '14:35',
    arrival: '15:17',
    price: 4.4,
    recommended: false,
    live: true,
    color: 'blue',
    description: 'Ônibus em 2 min da Av. Paulista',
    legs: [
      {
        type: 'walk',
        duration: 4,
      },
      {
        type: 'bus',
        line: '875A-10',
        color: '#2563EB',
      },
      {
        type: 'walk',
        duration: 7,
      },
    ],
  },

  {
    id: 'connections',
    duration: 48,
    departure: '14:31',
    arrival: '15:19',
    price: 5.6,
    recommended: false,
    live: false,
    color: 'purple',
    description: 'Mais conexões',
    legs: [
      {
        type: 'walk',
        duration: 6,
      },
      {
        type: 'subway',
        line: '2',
        color: '#2F6DB2',
      },
      {
        type: 'subway',
        line: '15',
        color: '#16A34A',
      },
      {
        type: 'train',
        line: '12',
        color: '#DC2626',
      },
      {
        type: 'walk',
        duration: 8,
      },
    ],
  },
] as const

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
  const [hasRoute, setHasRoute] = useState(false)

  return (
    <div className="flex justify-between items-ender p-4">
      {/* <AnimatePresence>
        <motion.div
          initial={{ height: 54 }}
          animate={{ height: 120, transition: { ease: 'easeOut' } }}
          className="w-full rounded-xl border bg-card"
        >
          <Badge className="rounded-md">3459-10</Badge>
        </motion.div>
      </AnimatePresence> */}
      <Drawer>
        <DrawerTrigger render={<Button variant={'ghost'} />}>
          <HugeiconsIcon icon={ArrowUp01FreeIcons} />
        </DrawerTrigger>
        <DrawerContent className={'mx-2 max-h-[300px] overflow-hidden'}>
          <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[300px] scrollbar-none scroll-fade">
            {mockRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </DrawerContent>
      </Drawer>
      <ModeToggle />
    </div>
  )
}
