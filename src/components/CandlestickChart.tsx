
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from "recharts";

interface CandlestickChartProps {
  ticker: string;
  timeframe: string;
}

const CandlestickChart = ({ ticker, timeframe }: CandlestickChartProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate market data generation
    const generateMarketData = () => {
      const data = [];
      let price = ticker === "BTC" ? 45000 : ticker === "ETH" ? 3000 : 150;
      
      for (let i = 0; i < 100; i++) {
        const change = (Math.random() - 0.5) * price * 0.02;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * price * 0.01;
        const low = Math.min(open, close) - Math.random() * price * 0.01;
        const volume = Math.random() * 1000000;
        
        data.push({
          date: new Date(Date.now() - (100 - i) * 86400000).toLocaleDateString(),
          open,
          high,
          low,
          close,
          volume,
          price: close,
        });
        
        price = close;
      }
      return data;
    };

    setData(generateMarketData());
  }, [ticker, timeframe]);

  const formatPrice = (value: number) => {
    if (ticker === "BTC" || ticker === "ETH") {
      return `$${value.toLocaleString()}`;
    }
    return `$${value.toFixed(2)}`;
  };

  const currentPrice = data.length > 0 ? data[data.length - 1]?.price : 0;
  const previousPrice = data.length > 1 ? data[data.length - 2]?.price : 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">{ticker}</h3>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">{formatPrice(currentPrice)}</span>
            <span className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? '+' : ''}{formatPrice(priceChange)} ({priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-right text-sm text-gray-400">
          <div>Timeframe: {timeframe}</div>
          <div>Last Updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={formatPrice}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff'
              }}
              labelStyle={{ color: '#9CA3AF' }}
              formatter={(value: number) => [formatPrice(value), 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={10}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={10}
            />
            <Bar dataKey="volume" fill="#6B7280" opacity={0.6} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff'
              }}
              formatter={(value: number) => [value.toLocaleString(), 'Volume']}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CandlestickChart;
