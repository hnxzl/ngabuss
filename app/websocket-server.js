// This is a standalone WebSocket server for development
// In production, you would use a proper WebSocket service

const { Server } = require("socket.io")

// Create a new Socket.IO server
const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

// Store for bus locations
const busLocations = []

// Set up socket.io event handlers
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)

  // Send current bus locations to the new client
  socket.emit("busLocations", busLocations)

  // Listen for bus location updates from drivers
  socket.on("busLocation", (data) => {
    console.log("Received bus location:", data)

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
const PORT = process.env.PORT || 3001
io.listen(PORT)
console.log(`WebSocket server running on port ${PORT}`)
