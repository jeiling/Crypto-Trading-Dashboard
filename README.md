# Crypto.com Market Data Dashboard

A real-time cryptocurrency trading dashboard built with Next.js that displays order books and candlestick charts from Crypto.com's WebSocket API.

## Features

- Real-time order book data for 6 trading pairs
- Live 1-minute candlestick chart for BTCUSD-PERP using ApexCharts
- WebSocket connection with automatic reconnection
- Efficient data handling with throttling
- Responsive design with Tailwind CSS

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charting:** React ApexCharts
- **State Management:** React Context
- **WebSocket:** Native WebSocket API
- **Performance:** Throttling, Memoization

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/crypto-market-dashboard.git

# Install dependencies
npm install

# Create environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                   # Next.js app router
├── components/           # React components
│   ├── OrderBook.tsx
│   └── CandlestickChart.tsx
├── contexts/             # React contexts
│   └── WebSocketContext.tsx
├── hooks/               # Custom hooks
│   ├── useKline.ts
│   └── useWebSocket.ts
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## WebSocket Implementation

The application maintains a persistent WebSocket connection to Crypto.com's market data API with the following features:

- Automatic reconnection on disconnection
- Heartbeat message handling
- Message throttling for performance
- Efficient order book updates

## Chart Implementation

The candlestick chart is implemented using React ApexCharts with the following features:

- Real-time updates
- Custom theme configuration
- Responsive design
- Time-based x-axis
- Price-based y-axis with 4 decimal precision
- Custom tooltip formatting

## Performance Optimizations

- WebSocket message throttling
- Memoized components
- Efficient order book updates
- React.memo for heavy components
- Dynamic imports for ApexCharts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Crypto.com API Documentation](https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html)
- [ApexCharts Documentation](https://apexcharts.com/docs/react-charts/)
