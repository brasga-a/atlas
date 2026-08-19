import { Map } from '@/components/ui/map'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_app/')({
  ssr: false,
  component: Home,
})

type UserPosition = {
  lat: number
  lng: number
  accuracy?: number
}

function Home() {
  const [position, setPosition] = useState<UserPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasDestiny, setHasDestiny] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada neste navegador.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({
          lat: coords.latitude,
          lng: coords.longitude,
          accuracy: coords.accuracy,
        })
      },
      (err) => setError(err.message),
    )
  }, [])

  return (
    <div className="flex flex-col flex-1 w-full h-full">
      <div className="relative flex-1">
        {/* Loader enquanto aguarda geolocalização */}
        {!position && !error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex gap-1">
              <span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full" />
              <span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:150ms]" />
              <span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* Map só monta após ter a posição real */}
        {position && (
          <Map
            className="h-full absolute z-0"
            center={[position.lng, position.lat]}
            zoom={17}
          />
        )}

        {/* Fallback de erro sem mapa */}
        {error && (
          <div className="flex-1 bg-muted flex items-center justify-center text-muted-foreground text-sm">
            Não foi possível carregar o mapa sem permissão de localização.
          </div>
        )}
      </div>
    </div>
  )
}
