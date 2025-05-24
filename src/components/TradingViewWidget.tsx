
import { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  ticker: string;
  timeframe: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewWidget = ({ ticker, timeframe }: TradingViewWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    
    const timeframeMap: { [key: string]: string } = {
      '1M': '1',
      '5M': '5',
      '15M': '15',
      '1H': '60',
      '4H': '240',
      '1D': 'D'
    };

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: ticker,
      interval: timeframeMap[timeframe] || 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      backgroundColor: 'rgba(31, 41, 55, 1)',
      gridColor: 'rgba(55, 65, 81, 1)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com'
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [ticker, timeframe]);

  return (
    <div className="tradingview-widget-container h-full">
      <div ref={containerRef} className="tradingview-widget h-full"></div>
    </div>
  );
};

export default TradingViewWidget;
