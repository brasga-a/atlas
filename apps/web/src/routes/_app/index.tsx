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

  useEffect(() => {
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
    <div className="flex flex-col flex-1 w-full h-full relative">
      {/* Painel de coordenadas */}
      <div className="absolute z-10 left-5 top-5">
        <div className="flex flex-col gap-1 bg-background/80 backdrop-blur-sm rounded-md px-3 py-2 text-sm shadow">
          {error ? (
            <span className="text-destructive">{error}</span>
          ) : position ? (
            <>
              <span>Lat: {position.lat.toFixed(6)}</span>
              <span>Lng: {position.lng.toFixed(6)}</span>
              {position.accuracy != null && (
                <span>Precisão: {Math.round(position.accuracy)}m</span>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">Obtendo localização...</span>
          )}
        </div>
      </div>

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
          className="flex-1"
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
  )
}
