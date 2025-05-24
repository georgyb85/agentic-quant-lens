
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  ticker: string;
  date: string;
  link: string;
}
