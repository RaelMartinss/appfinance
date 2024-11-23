import { StockAnalyzer } from '@/components/stock-analyzer';

export default function CalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
        Investment Calculator
      </h1>
      <StockAnalyzer />
    </div>
  );
}