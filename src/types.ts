export interface OrderBookEntry {
    price: string;
    size: string;
    count: string;
  }
  
export  interface OrderBookData {
    [instrument: string]: {
      asks: OrderBookEntry[];
      bids: OrderBookEntry[];
      timestamp: number;
    };
  }

  export interface WebSocketMessage {
    id?: number;
    method: string;
    params?: {
      channels: string[];
    };
    code?: number;
    result?: {
      channel: string;
      subscription: string;
      data: OrderBookDataItem[] | CandlestickWSData[];
      instrument_name: string;
    };
  }

  export interface CandlestickData {
    t: number | undefined;  // timestamp
    o: number;  // open
    h: number;  // high
    l: number;  // low
    c: number;  // close
    v: number;  // volume
  }

  export interface KlineResponse {
    code: number;
    method: string;
    result: {
      instrument_name: string;
      interval: string;
      data: Array<{
        t: number;
        o: string;
        h: string;
        l: string;
        c: string;
        v: string;
      }>;
    };
  }


export interface OrderBookDataItem {
  asks: [string, string, string][];
  bids: [string, string, string][];
  t?: number;
}

export interface CandlestickWSData {
  t: number;
  o: string;
  h: string;
  l: string;
  c: string;
  v: string;
}