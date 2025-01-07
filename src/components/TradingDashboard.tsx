"use client";
import { useState } from "react";
import { OrderBook } from "./OrderBook";
import { CandlestickChart } from "./CandlestickChart";
import { useWebSocket } from "@/hooks/useWebSocket";
import { TRADING_PAIRS } from "../constant";

export function TradingDashboard() {
  const [selectedPair, setSelectedPair] = useState<string>(TRADING_PAIRS[0]);
  const { orderBooks, isConnected, subscribeToMarketData } = useWebSocket();

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <div className="lg:col-span-2">
          <CandlestickChart instrumentName={selectedPair} />
        </div>
        <div className="lg:col-span-1">
          <OrderBook
            tradingPairs={TRADING_PAIRS}
            selectedPair={selectedPair}
            onSelectPair={setSelectedPair}
            orderBooks={orderBooks}
            isConnected={isConnected}
            subscribeToMarketData={subscribeToMarketData}
          />
        </div>
      </div>
    </div>
  );
}
