
import { NewsItem } from "@/types/news";

export const generateMockNews = (): NewsItem[] => [
  {
    id: "1",
    title: "Tesla Reports Strong Q4 Earnings Beat",
    summary: "Tesla exceeded analyst expectations with strong quarterly results driven by increased vehicle deliveries and margin improvements.",
    sentiment: "positive",
    ticker: "TSLA",
    date: "2025-05-24",
    link: "https://example.com/tesla-earnings"
  },
  {
    id: "2",
    title: "Amazon Web Services Faces Increased Competition",
    summary: "AWS market share under pressure as competitors Microsoft Azure and Google Cloud gain ground in enterprise cloud services.",
    sentiment: "negative",
    ticker: "AMZN",
    date: "2025-05-23",
    link: "https://example.com/aws-competition"
  },
  {
    id: "3",
    title: "Google's AI Breakthrough in Quantum Computing",
    summary: "Alphabet announces significant advancement in quantum computing technology, potentially revolutionizing AI capabilities.",
    sentiment: "positive",
    ticker: "GOOG",
    date: "2025-05-22",
    link: "https://example.com/google-quantum"
  },
  {
    id: "4",
    title: "Bitcoin ETF Approval Drives Institutional Adoption",
    summary: "SEC approval of spot Bitcoin ETFs leads to increased institutional investment and price stability in cryptocurrency markets.",
    sentiment: "positive",
    ticker: "BTC",
    date: "2025-05-21",
    link: "https://example.com/bitcoin-etf"
  },
  {
    id: "5",
    title: "Ethereum Network Upgrade Improves Scalability",
    summary: "Latest Ethereum upgrade reduces transaction costs and improves network throughput, addressing long-standing scalability concerns.",
    sentiment: "positive",
    ticker: "ETH",
    date: "2025-05-20",
    link: "https://example.com/ethereum-upgrade"
  }
];
