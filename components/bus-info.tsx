import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Bus, Clock, MapPin, Users } from "lucide-react"
import { busRoutes } from "@/lib/data"

export default function BusInfo({ bus }) {
  // Find the route for this bus
  const route = busRoutes.find((r) => r.id === bus.routeId)

  // Calculate the next stop
  const nextStopIndex = Math.floor(Math.random() * (route?.stops.length - 1))
  const nextStop = route?.stops[nextStopIndex]
  const nextNextStop = route?.stops[nextStopIndex + 1]

  // Calculate progress to next stop (random for demo)
  const progressToNextStop = Math.floor(Math.random() * 100)

  // Calculate estimated arrival time (random for demo)
  const estimatedMinutes = Math.floor(Math.random() * 10) + 1

  return (
    <Card className="border shadow-sm">
      <CardHeader style={{ borderBottom: `4px solid ${bus.routeColor}` }}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Bus className="mr-2 h-5 w-5" />
              {bus.name}
            </CardTitle>
            <CardDescription>
              Rute: {bus.routeName} • ID: {bus.id}
            </CardDescription>
          </div>
          <Badge style={{ backgroundColor: bus.routeColor }}>{bus.status || "Aktif"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Menuju: {nextStop?.name}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{estimatedMinutes} menit</span>
              </div>
            </div>
            <Progress value={progressToNextStop} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Penumpang: {bus.passengers || Math.floor(Math.random() * 30) + 5}</span>
            </div>
            <div>
              <span>Kapasitas: {bus.capacity || 40}</span>
            </div>
          </div>

          <div className="border-t pt-3 mt-3">
            <h4 className="font-medium mb-2">Halte Berikutnya:</h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-green-600" />
                <div>
                  <p className="font-medium">{nextStop?.name}</p>
                  <p className="text-xs text-gray-500">{nextStop?.address}</p>
                </div>
              </div>

              {nextNextStop && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                  <div>
                    <p className="font-medium">{nextNextStop.name}</p>
                    <p className="text-xs text-gray-500">{nextNextStop.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
