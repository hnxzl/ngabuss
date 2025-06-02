"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Bus, MapPin, AlertTriangle, CheckCircle2, Send } from "lucide-react"
import { io } from "socket.io-client"
import { busRoutes } from "@/lib/data"

export default function AdminPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isTracking, setIsTracking] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState("")
  const [selectedBus, setSelectedBus] = useState("")
  const [status, setStatus] = useState("active")
  const [position, setPosition] = useState(null)
  const [watchId, setWatchId] = useState(null)
  const [socket, setSocket] = useState(null)
  const [logs, setLogs] = useState([])
  const { toast } = useToast()

  // Connect to WebSocket server
  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3001")

    socketInstance.on("connect", () => {
      setIsConnected(true)
      addLog("Terhubung ke server")
    })

    socketInstance.on("disconnect", () => {
      setIsConnected(false)
      addLog("Terputus dari server")
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  // Add log entry
  const addLog = (message, type = "info") => {
    setLogs((prev) => [
      {
        id: Date.now(),
        message,
        type,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 19), // Keep only the last 20 logs
    ])
  }

  // Start tracking location
  const startTracking = () => {
    if (!selectedRoute || !selectedBus) {
      toast({
        title: "Error",
        description: "Pilih rute dan bus terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation tidak didukung oleh browser ini",
        variant: "destructive",
      })
      return
    }

    // Start watching position
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setPosition({ lat: latitude, lng: longitude })

        // Send position to server via WebSocket
        if (socket && isConnected) {
          socket.emit("busLocation", {
            busId: selectedBus,
            routeId: selectedRoute,
            position: { lat: latitude, lng: longitude },
            status,
            timestamp: new Date().toISOString(),
          })

          addLog(`Posisi dikirim: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        }
      },
      (error) => {
        console.error("Error getting location:", error)
        addLog(`Error: ${error.message}`, "error")
        toast({
          title: "Error",
          description: `Gagal mendapatkan lokasi: ${error.message}`,
          variant: "destructive",
        })
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
    )

    setWatchId(id)
    setIsTracking(true)
    addLog("Mulai melacak lokasi")

    toast({
      title: "Tracking Aktif",
      description: "Lokasi bus sedang dilacak dan dikirim ke server",
    })
  }

  // Stop tracking location
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }

    setIsTracking(false)
    addLog("Berhenti melacak lokasi")

    toast({
      title: "Tracking Berhenti",
      description: "Lokasi bus tidak lagi dilacak",
    })
  }

  // Send manual update
  const sendManualUpdate = () => {
    if (!selectedRoute || !selectedBus) {
      toast({
        title: "Error",
        description: "Pilih rute dan bus terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    // For demo, we'll use the current position or a default one
    const posToSend = position || { lat: -6.2088, lng: 106.8456 }

    if (socket && isConnected) {
      socket.emit("busLocation", {
        busId: selectedBus,
        routeId: selectedRoute,
        position: posToSend,
        status,
        timestamp: new Date().toISOString(),
      })

      addLog(`Update manual dikirim: ${posToSend.lat.toFixed(6)}, ${posToSend.lng.toFixed(6)}`)

      toast({
        title: "Update Terkirim",
        description: "Posisi bus berhasil diperbarui secara manual",
      })
    } else {
      toast({
        title: "Error",
        description: "Tidak terhubung ke server",
        variant: "destructive",
      })
    }
  }

  // Get buses for selected route
  const busesForRoute = selectedRoute ? busRoutes.find((r) => r.id === selectedRoute)?.buses || [] : []

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Panel Admin (Supir)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Tracking Lokasi</CardTitle>
                  <CardDescription>Kirim lokasi bus secara real-time</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`}
                  ></div>
                  <span className="text-sm">{isConnected ? "Terhubung" : "Terputus"}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="route">Rute</Label>
                    <Select value={selectedRoute} onValueChange={setSelectedRoute} disabled={isTracking}>
                      <SelectTrigger id="route">
                        <SelectValue placeholder="Pilih rute" />
                      </SelectTrigger>
                      <SelectContent>
                        {busRoutes.map((route) => (
                          <SelectItem key={route.id} value={route.id}>
                            {route.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bus">Bus</Label>
                    <Select value={selectedBus} onValueChange={setSelectedBus} disabled={isTracking || !selectedRoute}>
                      <SelectTrigger id="bus">
                        <SelectValue placeholder="Pilih bus" />
                      </SelectTrigger>
                      <SelectContent>
                        {busesForRoute.map((bus) => (
                          <SelectItem key={bus.id} value={bus.id}>
                            {bus.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status Bus</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="delay">Terlambat</SelectItem>
                      <SelectItem value="full">Penuh</SelectItem>
                      <SelectItem value="maintenance">Perbaikan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-tracking"
                    checked={isTracking}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        startTracking()
                      } else {
                        stopTracking()
                      }
                    }}
                  />
                  <Label htmlFor="auto-tracking">Tracking Otomatis</Label>
                </div>

                {position && (
                  <div className="p-3 bg-gray-50 rounded-md text-sm">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 mr-1 text-green-600" />
                      <span className="font-medium">Lokasi Saat Ini:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-500">Latitude:</span>
                        <span className="ml-2 font-mono">{position.lat.toFixed(6)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Longitude:</span>
                        <span className="ml-2 font-mono">{position.lng.toFixed(6)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={sendManualUpdate}
                disabled={!isConnected || !selectedRoute || !selectedBus}
              >
                <Send className="h-4 w-4 mr-2" />
                Kirim Update Manual
              </Button>

              <Button
                onClick={isTracking ? stopTracking : startTracking}
                variant={isTracking ? "destructive" : "default"}
                disabled={!isConnected || (!isTracking && (!selectedRoute || !selectedBus))}
              >
                {isTracking ? "Berhenti Tracking" : "Mulai Tracking"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Log Aktivitas</CardTitle>
              <CardDescription>Riwayat aktivitas dan pengiriman data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] overflow-y-auto border rounded-md p-2 bg-gray-50">
                {logs.length > 0 ? (
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div key={log.id} className="text-sm flex items-start space-x-2">
                        <span className="text-gray-500 whitespace-nowrap">{log.timestamp}</span>
                        <span className="text-gray-500">|</span>
                        {log.type === "error" ? (
                          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={log.type === "error" ? "text-red-600" : ""}>{log.message}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    Belum ada aktivitas
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Informasi Rute</CardTitle>
              <CardDescription>Detail rute yang sedang aktif</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedRoute ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{busRoutes.find((r) => r.id === selectedRoute)?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {busRoutes.find((r) => r.id === selectedRoute)?.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Halte di Rute Ini:</h4>
                    <div className="space-y-2">
                      {busRoutes
                        .find((r) => r.id === selectedRoute)
                        ?.stops.map((stop, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                {index + 1}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{stop.name}</p>
                              <p className="text-xs text-gray-500">{stop.address}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Bus className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="font-medium text-gray-500">Pilih Rute</h3>
                  <p className="text-sm text-gray-400">Informasi rute akan ditampilkan di sini</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Bantuan</CardTitle>
              <CardDescription>Panduan penggunaan panel admin</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tracking">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="tracking">Tracking</TabsTrigger>
                  <TabsTrigger value="status">Status</TabsTrigger>
                </TabsList>
                <TabsContent value="tracking" className="space-y-4">
                  <div className="text-sm space-y-2">
                    <p>1. Pilih rute dan bus yang sedang Anda kendarai</p>
                    <p>2. Aktifkan "Tracking Otomatis" untuk mengirim lokasi secara berkala</p>
                    <p>3. Pastikan GPS perangkat Anda aktif dan akurat</p>
                    <p>4. Gunakan "Kirim Update Manual" jika diperlukan</p>
                  </div>
                </TabsContent>
                <TabsContent value="status" className="space-y-4">
                  <div className="text-sm space-y-2">
                    <p>
                      <strong>Aktif:</strong> Bus beroperasi normal
                    </p>
                    <p>
                      <strong>Terlambat:</strong> Bus mengalami keterlambatan
                    </p>
                    <p>
                      <strong>Penuh:</strong> Bus sudah penuh penumpang
                    </p>
                    <p>
                      <strong>Perbaikan:</strong> Bus sedang dalam perbaikan
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
