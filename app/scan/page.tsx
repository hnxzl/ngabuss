"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, CreditCard, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ScanPage() {
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [manualCode, setManualCode] = useState("")
  const videoRef = useRef(null)
  const { toast } = useToast()

  // Handle QR code scanning
  const startScanning = async () => {
    setScanning(true)
    setScanned(false)
    setScanResult(null)

    try {
      // In a real app, we would use a QR code scanning library like jsQR
      // For this demo, we'll simulate scanning after a delay
      setTimeout(() => {
        const fakeTicketId = "TICKET-" + Math.floor(Math.random() * 10000)
        handleScanSuccess({
          ticketId: fakeTicketId,
          route: "Rute A - Terminal Pusat ke Terminal Timur",
          valid: Math.random() > 0.2, // 80% chance of being valid
          timestamp: new Date().toISOString(),
        })
      }, 3000)
    } catch (error) {
      console.error("Error starting camera:", error)
      toast({
        title: "Error",
        description: "Tidak dapat mengakses kamera. Silakan coba lagi.",
        variant: "destructive",
      })
      setScanning(false)
    }
  }

  const stopScanning = () => {
    setScanning(false)
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const handleScanSuccess = (result) => {
    setScanned(true)
    setScanResult(result)
    setScanning(false)

    toast({
      title: result.valid ? "Tiket Valid" : "Tiket Tidak Valid",
      description: result.valid
        ? `Tiket ${result.ticketId} berhasil divalidasi`
        : `Tiket ${result.ticketId} tidak valid atau sudah digunakan`,
      variant: result.valid ? "default" : "destructive",
    })
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (!manualCode.trim()) return

    // Simulate validation
    const isValid = manualCode.startsWith("BUS")

    handleScanSuccess({
      ticketId: manualCode,
      route: "Rute A - Terminal Pusat ke Terminal Timur",
      valid: isValid,
      timestamp: new Date().toISOString(),
    })

    setManualCode("")
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Scan Tiket</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>Scan QR code tiket untuk validasi perjalanan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full max-w-[300px] aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {scanning ? (
                  <>
                    <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-green-500 rounded-lg animate-pulse"></div>
                    </div>
                  </>
                ) : scanned ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-50">
                    {scanResult?.valid ? (
                      <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
                    ) : (
                      <AlertCircle className="w-16 h-16 text-red-500 mb-2" />
                    )}
                    <p className="text-lg font-medium text-center">
                      {scanResult?.valid ? "Tiket Valid" : "Tiket Tidak Valid"}
                    </p>
                    <p className="text-sm text-gray-500 text-center mt-1">ID: {scanResult?.ticketId}</p>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>

              <Button
                onClick={scanning ? stopScanning : startScanning}
                variant={scanning ? "destructive" : "default"}
                className="w-full max-w-[300px]"
              >
                {scanning ? "Berhenti Scan" : "Mulai Scan"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Input Manual</CardTitle>
            <CardDescription>Masukkan kode tiket secara manual</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticket-code">Kode Tiket</Label>
                  <Input
                    id="ticket-code"
                    placeholder="Contoh: BUS12345"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                  />
                </div>
                <Button type="submit">Validasi Tiket</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-4">
            <div className="w-full">
              <h3 className="font-medium mb-2">Informasi Tiket</h3>
              {scanResult ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">ID Tiket:</span>
                    <span className="text-sm font-medium">{scanResult.ticketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Rute:</span>
                    <span className="text-sm font-medium">{scanResult.route}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`text-sm font-medium ${scanResult.valid ? "text-green-600" : "text-red-600"}`}>
                      {scanResult.valid ? "Valid" : "Tidak Valid"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Waktu Scan:</span>
                    <span className="text-sm font-medium">
                      {new Date(scanResult.timestamp).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">Belum ada tiket yang di-scan</div>
              )}
            </div>

            <div className="w-full pt-4 border-t">
              <h3 className="font-medium mb-2">Pembayaran</h3>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <CreditCard className="h-4 w-4" />
                Beli Tiket Baru
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
