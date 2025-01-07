"use client";
import { useState, useEffect, useCallback } from "react";
import { CandlestickData, KlineResponse } from "../types";

export function useKline(instrumentName: string, timeframe: string = "1h") {
  const [candlesticks, setCandlesticks] = useState<CandlestickData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKlineData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const end = Math.floor(Date.now() / 1000);
      const start = end - 30 * 24 * 60 * 60; // NOTE: 前三十天

      const response = await fetch(
        `/api/candlestick?` +
          new URLSearchParams({
            instrument_name: instrumentName,
            timeframe,
            start_ts: start.toString(),
            end_ts: end.toString(),
          }).toString()
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: KlineResponse = await response.json();

      if (data.code === 0 && data.result.data) {
        const klineData = data.result.data
          .map((candle) => ({
            t: candle.t,
            o: parseFloat(candle.o),
            h: parseFloat(candle.h),
            l: parseFloat(candle.l),
            c: parseFloat(candle.c),
            v: parseFloat(candle.v),
          }))
          .sort((a, b) => a.t - b.t);

        setCandlesticks(klineData);
      }
    } catch (error) {
      console.error("Error fetching kline data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [instrumentName, timeframe]);

  useEffect(() => {
    fetchKlineData();

    const intervalId = setInterval(fetchKlineData, 60000);

    return () => clearInterval(intervalId);
  }, [fetchKlineData]);

  return {
    candlesticks,
    isLoading,
    error,
    refetch: fetchKlineData,
  };
}
