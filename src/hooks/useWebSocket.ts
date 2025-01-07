"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { throttle } from "lodash";
import { WebSocketMessage, OrderBookData, OrderBookDataItem } from "../types";
import { WS_URL, RECONNECT_DELAY, HEARTBEAT_INTERVAL,orderBookCount } from "../constant";

export function useWebSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<
    ReturnType<typeof setInterval> | undefined
  >(undefined);
  const messageIdCounterRef = useRef(1);
  const [orderBooks, setOrderBooks] = useState<OrderBookData>({});
  const [isConnected, setIsConnected] = useState(false);
  const subscribedChannelsRef = useRef<Set<string>>(new Set());

  const getNextMessageId = useCallback(() => messageIdCounterRef.current++, []);

  const sendMessage = useCallback(
    (message: Partial<WebSocketMessage>) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        const fullMessage = { ...message, id: getNextMessageId() };
        socketRef.current.send(JSON.stringify(fullMessage));
      }
    },
    [getNextMessageId]
  );

  const handleHeartbeat = useCallback(
    (messageId: number) => {
      sendMessage({
        id: messageId,
        method: "public/respond-heartbeat",
      });
    },
    [sendMessage]
  );

  const processOrderBookData = useCallback((instrument: string, data: OrderBookDataItem) => {
    if (data && Array.isArray(data.asks) && Array.isArray(data.bids)) {
      setOrderBooks((prev) => ({
        ...prev,
        [instrument]: {
          asks: data.asks.slice(0, orderBookCount).map((item) => ({
            price: Number(item[0]).toFixed(2),
            size: Number(item[1]).toFixed(4),
            count: item[2],
          })),
          bids: data.bids.slice(0, orderBookCount).map((item) => ({
            price: Number(item[0]).toFixed(2),
            size: Number(item[1]).toFixed(4),
            count: item[2],
          })),
          timestamp: data.t || Date.now(),
        },
      }));
    }
  }, [orderBookCount]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.method === "public/heartbeat") {
          handleHeartbeat(message.id!);
          return;
        }

        if (message.result?.data) {
          const { channel, data, instrument_name } = message.result;

          if (channel === "book" && 'asks' in data[0]) {
            processOrderBookData(instrument_name, data[0] as OrderBookDataItem);
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
    [handleHeartbeat, processOrderBookData]
  );

  const subscribeToMarketData = useCallback(
    (instrumentName: string) => {
      if (!isConnected) return;

      const subscription = {
        method: "subscribe",
        params: {
          channels: [`book.${instrumentName}`],
        },
      };

      if (!subscribedChannelsRef.current.has(subscription.params.channels[0])) {
        console.log("Subscribing to:", subscription.params.channels[0]);
        sendMessage(subscription);
        subscribedChannelsRef.current.add(subscription.params.channels[0]);
      }
    },
    [isConnected, sendMessage]
  );

  const throttledHandleMessage = useCallback(
    (event: MessageEvent) => {
      throttle(handleMessage, 100, { leading: true, trailing: true })(event);
    },
    [handleMessage]
  );

  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket(WS_URL);
        socketRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);
          subscribedChannelsRef.current.clear();

          heartbeatIntervalRef.current = setInterval(() => {
            sendMessage({ method: "public/heartbeat" });
          }, HEARTBEAT_INTERVAL);
        };

        ws.onmessage = throttledHandleMessage;

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected, reconnecting...");
          setIsConnected(false);
          clearInterval(heartbeatIntervalRef.current);
          setTimeout(connect, RECONNECT_DELAY);
        };
      } catch (error) {
        console.error("Connection error:", error);
        setTimeout(connect, RECONNECT_DELAY);
      }
    };

    connect();

    return () => {
      clearInterval(heartbeatIntervalRef.current);
      socketRef.current?.close();
    };
  }, [sendMessage, throttledHandleMessage]);

  return {
    orderBooks,
    isConnected,
    subscribeToMarketData,
  };
}
