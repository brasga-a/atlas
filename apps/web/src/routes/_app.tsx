import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex flex-col min-h-screen w-full relative">
      <Outlet />
    </main>
  )
}
