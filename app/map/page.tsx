"use client"

import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bus, Clock, MapPin } from "lucide-react"
import BusInfo from "@/components/bus-info"
import { busRoutes } from "@/lib/data"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>,
})

export default function MapPage() {
  const [activeTab, setActiveTab] = useState("semua")
  const [buses, setBuses] = useState([])
  const [selectedBus, setSelectedBus] = useState(null)

  useEffect(() => {
    // Connect to WebSocket server
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3001")

    // Listen for bus location updates
    socket.on("busLocations", (data) => {
      setBuses(data)
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [])

  // For demo purposes, we'll use sample data
  useEffect(() => {
    const sampleBuses = busRoutes.flatMap((route) =>
      route.buses.map((bus) => ({
        ...bus,
        routeId: route.id,
        routeName: route.name,
        routeColor: route.color,
        position: {
          lat: bus.currentPosition.lat + (Math.random() * 0.01 - 0.005),
          lng: bus.currentPosition.lng + (Math.random() * 0.01 - 0.005),
        },
      })),
    )

    setBuses(sampleBuses)

    // Simulate movement
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          position: {
            lat: bus.position.lat + (Math.random() * 0.001 - 0.0005),
            lng: bus.position.lng + (Math.random() * 0.001 - 0.0005),
          },
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const filteredBuses = activeTab === "semua" ? buses : buses.filter((bus) => bus.routeId === activeTab)

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Peta Tracking Bus</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border shadow-sm">
            <CardContent className="p-0">
              <MapWithNoSSR buses={filteredBuses} routes={busRoutes} onBusSelect={setSelectedBus} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Rute Bus</CardTitle>
              <CardDescription>Pilih rute untuk melihat bus yang beroperasi</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="semua" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="semua">Semua Rute</TabsTrigger>
                  <TabsTrigger value="filter">Filter Rute</TabsTrigger>
                </TabsList>
                <TabsContent value="semua">
                  <p className="text-sm text-gray-500 mb-4">Menampilkan semua bus dari semua rute</p>
                </TabsContent>
                <TabsContent value="filter">
                  <div className="grid grid-cols-1 gap-2">
                    {busRoutes.map((route) => (
                      <Button
                        key={route.id}
                        variant={activeTab === route.id ? "default" : "outline"}
                        className="justify-start"
                        style={{
                          backgroundColor: activeTab === route.id ? route.color : "transparent",
                          color: activeTab === route.id ? "white" : "inherit",
                          borderColor: route.color,
                        }}
                        onClick={() => setActiveTab(route.id)}
                      >
                        <Bus className="mr-2 h-4 w-4" />
                        {route.name}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {selectedBus && <BusInfo bus={selectedBus} />}

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Informasi Halte</CardTitle>
              <CardDescription>Halte terdekat dan estimasi waktu kedatangan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {busRoutes
                  .find((r) => r.id === (activeTab === "semua" ? "route1" : activeTab))
                  ?.stops.slice(0, 3)
                  .map((stop, index) => (
                    <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                      <div className="flex-shrink-0 mt-1">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{stop.name}</h4>
                        <p className="text-sm text-gray-500">{stop.address}</p>
                        <div className="flex items-center mt-1 text-sm">
                          <Clock className="h-4 w-4 mr-1 text-amber-500" />
                          <span>Bus berikutnya: {Math.floor(Math.random() * 15) + 1} menit</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
