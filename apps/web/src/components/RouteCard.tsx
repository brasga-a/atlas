import { cn } from '#/lib/utils'
import { BusFront, ChevronRight, Footprints } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

type RouteLeg =
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

type RouteCardProps = {
  route: {
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
}

export function RouteCard({ route }: RouteCardProps) {
  return (
    <Button
      variant={'outline'}
      className={cn(
        'flex flex-col h-auto! p-2',
        route.recommended && 'border-emerald-600',
      )}
    >
      <div className={'flex justify-between items-start w-full'}>
        <div className="flex flex-col items-start items-center gap-1">
          <div className="flex items-start gap-2 font-semibold tracking-tight">
            <h1 className="font-semibold">{route.duration} min</h1>
            {route.recommended && (
              <Badge className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600">
                Recomendado
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {route.departure} – {route.arrival}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">
            {route.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </div>
      </div>

      <div className="flex w-full items-center gap-2">
        {route.legs.map((leg, index) => (
          <RouteLeg
            key={`${route.id}-${index}`}
            leg={leg}
            isLast={index === route.legs.length - 1}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 w-full">
        <p className="text-xs text-muted-foreground">{route.description}</p>

        {route.live && (
          <Badge variant={'outline'} className="border-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Ao vivo
          </Badge>
        )}
      </div>
    </Button>
  )
}

function RouteLeg({ leg, isLast }: { leg: RouteLeg; isLast: boolean }) {
  return (
    <>
      {leg.type === 'walk' && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Footprints className="size-4" />
          <span>{leg.duration} min</span>
        </div>
      )}

      {leg.type === 'bus' && (
        <Badge
          className="rounded-sm h-6"
          style={{
            backgroundColor: `${leg.color} text-white!`,
            color: leg.color,
          }}
        >
          <BusFront className="size-4 text-white" />
          <span className="text-white">{leg.line}</span>
        </Badge>
      )}

      {leg.type === 'subway' && (
        <Badge
          className="rounded-sm size-6 text-white!"
          style={{
            backgroundColor: `${leg.color}`,
            color: leg.color,
          }}
        >
          {leg.line}
        </Badge>
      )}

      {leg.type === 'train' && (
        <Badge
          className="rounded-sm size-6 text-white!"
          style={{
            backgroundColor: `${leg.color}`,
            color: leg.color,
          }}
        >
          {leg.line}
        </Badge>
      )}

      {!isLast && (
        <ChevronRight className="size-3.5 text-muted-foreground/60" />
      )}
    </>
  )
}
