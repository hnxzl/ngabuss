// Sample data for bus routes and stops

export const busRoutes = [
  {
    id: "route1",
    name: "Rute A - Terminal Pusat ke Terminal Timur",
    description: "Rute dari Terminal Pusat menuju Terminal Timur melalui pusat kota",
    color: "#4CAF50", // Green
    path: [
      [-6.2088, 106.8456], // Jakarta center point
      [-6.208, 106.847],
      [-6.207, 106.849],
      [-6.206, 106.851],
      [-6.205, 106.853],
      [-6.204, 106.855],
      [-6.203, 106.857],
      [-6.202, 106.859],
    ],
    stops: [
      {
        name: "Terminal Pusat",
        address: "Jl. Terminal Pusat No. 1",
        lat: -6.2088,
        lng: 106.8456,
      },
      {
        name: "Halte Thamrin",
        address: "Jl. MH Thamrin No. 10",
        lat: -6.207,
        lng: 106.849,
      },
      {
        name: "Halte Sudirman",
        address: "Jl. Jenderal Sudirman No. 25",
        lat: -6.205,
        lng: 106.853,
      },
      {
        name: "Terminal Timur",
        address: "Jl. Terminal Timur No. 1",
        lat: -6.202,
        lng: 106.859,
      },
    ],
    buses: [
      {
        id: "bus101",
        name: "Bus A-101",
        capacity: 40,
        currentPosition: {
          lat: -6.208,
          lng: 106.847,
        },
      },
      {
        id: "bus102",
        name: "Bus A-102",
        capacity: 40,
        currentPosition: {
          lat: -6.205,
          lng: 106.853,
        },
      },
    ],
  },
  {
    id: "route2",
    name: "Rute B - Terminal Barat ke Terminal Selatan",
    description: "Rute dari Terminal Barat menuju Terminal Selatan melalui area bisnis",
    color: "#2196F3", // Blue
    path: [
      [-6.21, 106.84], // Starting point
      [-6.211, 106.838],
      [-6.212, 106.836],
      [-6.213, 106.834],
      [-6.214, 106.832],
      [-6.215, 106.83],
      [-6.216, 106.828],
      [-6.217, 106.826],
    ],
    stops: [
      {
        name: "Terminal Barat",
        address: "Jl. Terminal Barat No. 1",
        lat: -6.21,
        lng: 106.84,
      },
      {
        name: "Halte Gajah Mada",
        address: "Jl. Gajah Mada No. 15",
        lat: -6.212,
        lng: 106.836,
      },
      {
        name: "Halte Hayam Wuruk",
        address: "Jl. Hayam Wuruk No. 30",
        lat: -6.215,
        lng: 106.83,
      },
      {
        name: "Terminal Selatan",
        address: "Jl. Terminal Selatan No. 1",
        lat: -6.217,
        lng: 106.826,
      },
    ],
    buses: [
      {
        id: "bus201",
        name: "Bus B-201",
        capacity: 35,
        currentPosition: {
          lat: -6.211,
          lng: 106.838,
        },
      },
      {
        id: "bus202",
        name: "Bus B-202",
        capacity: 35,
        currentPosition: {
          lat: -6.215,
          lng: 106.83,
        },
      },
    ],
  },
  {
    id: "route3",
    name: "Rute C - Terminal Utara ke Terminal Pusat",
    description: "Rute dari Terminal Utara menuju Terminal Pusat melalui kawasan perumahan",
    color: "#FF9800", // Orange
    path: [
      [-6.2, 106.85], // Starting point
      [-6.201, 106.849],
      [-6.202, 106.848],
      [-6.203, 106.847],
      [-6.204, 106.846],
      [-6.205, 106.845],
      [-6.206, 106.844],
      [-6.207, 106.843],
      [-6.208, 106.842],
      [-6.2088, 106.8456], // End at Terminal Pusat
    ],
    stops: [
      {
        name: "Terminal Utara",
        address: "Jl. Terminal Utara No. 1",
        lat: -6.2,
        lng: 106.85,
      },
      {
        name: "Halte Kemayoran",
        address: "Jl. Kemayoran No. 20",
        lat: -6.203,
        lng: 106.847,
      },
      {
        name: "Halte Gunung Sahari",
        address: "Jl. Gunung Sahari No. 35",
        lat: -6.206,
        lng: 106.844,
      },
      {
        name: "Terminal Pusat",
        address: "Jl. Terminal Pusat No. 1",
        lat: -6.2088,
        lng: 106.8456,
      },
    ],
    buses: [
      {
        id: "bus301",
        name: "Bus C-301",
        capacity: 30,
        currentPosition: {
          lat: -6.201,
          lng: 106.849,
        },
      },
      {
        id: "bus302",
        name: "Bus C-302",
        capacity: 30,
        currentPosition: {
          lat: -6.205,
          lng: 106.845,
        },
      },
    ],
  },
]
