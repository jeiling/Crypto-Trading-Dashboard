"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useKline } from "@/hooks/useKline";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

const ApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-800 animate-pulse" />,
}) as typeof ReactApexChart;

export function CandlestickChart({
  instrumentName,
}: {
  instrumentName: string;
}) {
  const { candlesticks: klineCandlesticks } = useKline(instrumentName, "1h");

  const [chartData, setChartData] = useState<{
    options: ApexOptions;
    series: {
      data: { x: number; y: number[] }[];
    }[];
  }>({
    options: {
      chart: {
        type: "candlestick",
        height: 400,
        animations: {
          enabled: true,
          speed: 800,
        },
        toolbar: {
          show: false,
        },
      },
      theme: {
        mode: "dark",
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeFormatter: {
            year: "yyyy",
            month: "MMM 'yy",
            day: "dd MMM",
            hour: "HH:mm",
          },
        },
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
        labels: {
          formatter: (value: number) => value.toFixed(4),
        },
        floating: false,
        decimalsInFloat: 4,
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#26a69a",
            downward: "#ef5350",
          },
        },
      },
      tooltip: {
        enabled: true,
        theme: "dark",
        x: {
          format: "yyyy MMM dd HH:mm",
        },
      },
    },
    series: [
      {
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (klineCandlesticks.length > 0) {
      const validCandles = klineCandlesticks.filter(
        (candle) => typeof candle.t === "number"
      );
      const prices = validCandles.flatMap((candle) => [candle.h, candle.l]);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const padding = (maxPrice - minPrice) * 0.1;

      setChartData((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          yaxis: {
            ...prev.options.yaxis,
            min: minPrice - padding,
            max: maxPrice + padding,
          },
        },
        series: [
          {
            data: validCandles.map((candle) => ({
              x: candle.t ?? 0, // Provide default value of 0 if t is undefined
              y: [candle.o, candle.h, candle.l, candle.c],
            })),
          },
        ],
      }));
    }
  }, [klineCandlesticks]);

  if (!klineCandlesticks) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="h-[400px] w-full bg-gray-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-bold">{instrumentName}</h2>
      </div>
      <div className="h-[400px] w-full">
        <ApexChart
          options={chartData.options}
          series={chartData.series}
          type="candlestick"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}
