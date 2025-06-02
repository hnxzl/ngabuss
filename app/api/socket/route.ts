import { Server } from "socket.io"
import { NextResponse } from "next/server"

// Store for bus locations (in a real app, this would be a database)
const busLocations = []

// This is a workaround for Next.js API routes with socket.io
// In a production app, you would use a separate WebSocket server
export async function GET(req) {
  // Check if socket.io server is already initialized
  if (!(global as any).io) {
    console.log("Initializing Socket.io server...")
    const io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    })

    // Set up socket.io event handlers
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      // Send current bus locations to the new client
      socket.emit("busLocations", busLocations)

      // Listen for bus location updates from drivers
      socket.on("busLocation", (data) => {
        // Update the bus location in our store
        const index = busLocations.findIndex((bus) => bus.busId === data.busId)
        if (index !== -1) {
          busLocations[index] = data
        } else {
          busLocations.push(data)
        }

        // Broadcast the updated locations to all clients
        io.emit("busLocations", busLocations)
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })

    // Start the socket.io server
    io.listen(3001)(
      // Store the io instance globally
      global as any,
    ).io = io
  }

  return NextResponse.json({ status: "Socket.io server running" })
}
