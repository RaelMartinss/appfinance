import { StockAnalyzer } from '@/components/stock-analyzer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
        Sistema de Gestão Financeira
        </h1>
        <StockAnalyzer />
      </div>
    </main>
  );
}