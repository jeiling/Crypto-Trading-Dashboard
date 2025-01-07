'use client';
import { useEffect } from 'react';
import { OrderBookData } from '@/types';

interface OrderBookProps {
  tradingPairs: readonly string[];
  selectedPair: string;
  onSelectPair: (pair: string) => void;
  orderBooks: OrderBookData;
  isConnected: boolean;
  subscribeToMarketData: (instrumentName: string) => void;
}

export function OrderBook({ 
  tradingPairs, 
  selectedPair, 
  onSelectPair,
  orderBooks,
  isConnected,
  subscribeToMarketData 
}: OrderBookProps) {
  useEffect(() => {
    if (isConnected) {
      tradingPairs.forEach(pair => {
        subscribeToMarketData(pair);
      });
    }
  }, [isConnected, subscribeToMarketData, tradingPairs]);


  return (
    <div className="grid grid-cols-3 gap-4">
      {tradingPairs.map(pair => (
        <div
          key={pair}
          onClick={() => onSelectPair(pair)}
          className={`bg-gray-800 p-4 rounded-lg cursor-pointer transition-colors ${
            selectedPair === pair ? 'ring-2 ring-blue-500' : 'hover:bg-gray-700'
          }`}
        >
          <h2 className="text-white text-lg font-bold mb-4 text-center">{pair}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-red-500 text-sm mb-2">Asks</h3>
              <div className="space-y-1">
                {orderBooks[pair]?.asks.map((ask, index) => (
                  <div key={index} className="grid grid-cols-2 text-xs">
                    <span className="text-red-400">{ask.price}</span>
                    <span className="text-right text-red-400">{ask.size}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-700" />
            <div>
              <h3 className="text-green-500 text-sm mb-2">Bids</h3>
              <div className="space-y-1">
                {orderBooks[pair]?.bids.map((bid, index) => (
                  <div key={index} className="grid grid-cols-2 text-xs">
                    <span className="text-green-400">{bid.price}</span>
                    <span className="text-right text-green-400">{bid.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 