import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bus, MapPin, QrCode } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-green-600 text-white">
        <Link className="flex items-center justify-center" href="/">
          <Bus className="h-6 w-6 mr-2" />
          <span className="font-bold">BusTracker</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Beranda
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/map">
            Peta
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/scan">
            Scan Tiket
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin">
            Admin
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Tracking Bus Transportasi
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Pantau lokasi bus secara real-time, lihat jadwal, dan lakukan transaksi dengan mudah.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/map">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Lihat Peta <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/scan">
                  <Button variant="outline">Scan Tiket</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Tracking Real-time</h3>
                  <p className="text-gray-500">
                    Pantau lokasi bus secara real-time dan ketahui estimasi waktu kedatangan di halte terdekat.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Bus className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Informasi Rute</h3>
                  <p className="text-gray-500">
                    Lihat informasi lengkap tentang rute bus, halte, dan jadwal keberangkatan.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <QrCode className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Transaksi Mudah</h3>
                  <p className="text-gray-500">
                    Lakukan transaksi dengan mudah menggunakan fitur scan QR code di aplikasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-green-50">
        <p className="text-xs text-gray-500">© 2025 BusTracker. Hak cipta dilindungi.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Syarat & Ketentuan
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Kebijakan Privasi
          </Link>
        </nav>
      </footer>
    </div>
  )
}
