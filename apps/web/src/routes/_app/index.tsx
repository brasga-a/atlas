import { Map } from '@/components/ui/map'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_app/')({ component: Home })

type userPosition = {
  lat: number
  lng: number
  accuracy?: number
}

const defaultPosition: userPosition = {
  lat: -23.550306,
  lng: -46.634167,
}

function Home() {
  const [currentPosition, setcurrentPosition] =
    useState<userPosition>(defaultPosition)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setcurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
          console.log(
            'Navigator Current Position | lat: ' +
              position.coords.latitude +
              ' lng: ' +
              position.coords.longitude +
              ' accuracy: ' +
              position.coords.accuracy,
          )
          setIsLoading(false)
        },
        (error) => {
          console.error(error)
        },
      )
    }
    getLocation()
  }, [])

  return (
    <div className="flex flex-col flex-1 w-full h-full relative">
      <div className="absolute z-10 left-5 top-5">
        <div className="flex flex-col gap-1">
          <span>Lat: {currentPosition.lat}</span>
          <span>Lng: {currentPosition.lng}</span>
          {currentPosition.accuracy != null && (
            <span>Accuracy: {currentPosition.accuracy}</span>
          )}
        </div>
      </div>
      <Map
        className="flex-1"
        center={[currentPosition.lng, currentPosition.lat]}
        zoom={17}
      />
    </div>
  )
}
