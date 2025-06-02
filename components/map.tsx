"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export default function Map({ buses, routes, onBusSelect }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})
  const routeLinesRef = useRef([])

  // Fix Leaflet icon issues
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return

    // Center on Jakarta, Indonesia
    const map = L.map(mapRef.current).setView([-6.2088, 106.8456], 13)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
    }
  }, [])

  // Draw routes
  useEffect(() => {
    if (!mapInstanceRef.current || !routes) return

    // Clear previous routes
    routeLinesRef.current.forEach((line) => line.remove())
    routeLinesRef.current = []

    // Draw each route
    routes.forEach((route) => {
      const routeLine = L.polyline(route.path, {
        color: route.color,
        weight: 5,
        opacity: 0.7,
      }).addTo(mapInstanceRef.current)

      // Add route stops
      route.stops.forEach((stop) => {
        const stopIcon = L.divIcon({
          html: `<div class="flex items-center justify-center w-6 h-6 bg-white rounded-full border-2" style="border-color: ${route.color}">
                  <div class="w-2 h-2 rounded-full" style="background-color: ${route.color}"></div>
                </div>`,
          className: "bus-stop-marker",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold">${stop.name}</h3>
              <p class="text-sm">${stop.address}</p>
            </div>
          `)
      })

      routeLinesRef.current.push(routeLine)
    })
  }, [routes])

  // Update bus markers
  useEffect(() => {
    if (!mapInstanceRef.current || !buses) return

    const map = mapInstanceRef.current
    const existingMarkers = markersRef.current

    // Remove buses that are no longer in the data
    Object.keys(existingMarkers).forEach((id) => {
      if (!buses.find((bus) => bus.id === id)) {
        existingMarkers[id].remove()
        delete existingMarkers[id]
      }
    })

    // Update or add buses
    buses.forEach((bus) => {
      const busIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 rounded-full text-white" style="background-color: ${bus.routeColor || "#3B82F6"}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="15" cy="18" r="2"/></svg>
              </div>`,
        className: "bus-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      if (existingMarkers[bus.id]) {
        // Update existing marker
        existingMarkers[bus.id].setLatLng([bus.position.lat, bus.position.lng])
      } else {
        // Create new marker
        const marker = L.marker([bus.position.lat, bus.position.lng], { icon: busIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold">${bus.name}</h3>
              <p class="text-sm">Rute: ${bus.routeName}</p>
              <p class="text-sm">Nomor: ${bus.id}</p>
            </div>
          `)
          .on("click", () => {
            if (onBusSelect) {
              onBusSelect(bus)
            }
          })

        existingMarkers[bus.id] = marker
      }
    })

    markersRef.current = existingMarkers
  }, [buses, onBusSelect])

  return <div ref={mapRef} className="h-[600px] w-full" />
}
