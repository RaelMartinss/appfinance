"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

const assetTypes = [
  { value: 'stocks', label: 'Ações' },
  { value: 'investment-funds', label: 'Fundos de Investimentos' },
  { value: 'fiis', label: 'FIIs' },
  { value: 'crypto', label: 'Criptomoedas' },
  { value: 'stocks-us', label: 'Stocks' },
  { value: 'reits', label: 'REITs' },
  { value: 'bdrs', label: 'BDRs' },
  { value: 'etfs', label: 'ETFs' },
  { value: 'etfs-international', label: 'ETFs Internacionais' },
  { value: 'treasury', label: 'Tesouro Direto' },
  { value: 'fixed-income', label: 'Renda Fixa' },
  { value: 'others', label: 'Outros' },
];

function PortfolioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const symbol = searchParams.get('symbol') || '';
  const price = parseFloat(searchParams.get('price') || '0');
  const shortName = searchParams.get('name') || '';

  const [assetType, setAssetType] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = parseFloat(quantity) * price;

  const handleSubmit = async (type: 'buy' | 'sell') => {
    if (!assetType) {
      toast.error('Selecione o tipo de ativo');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol,
          shortName,
          type,
          assetType,
          quantity: parseFloat(quantity),
          price,
          date: date.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update portfolio');
      }
      const data = await response.json();

      console.log('setIsSubmitting - data', data);

      toast.success(
        type === 'buy' 
          ? 'Compra realizada com sucesso!' 
          : 'Venda realizada com sucesso!'
      );
      router.push('/');
    } catch (error) {
      toast.error('Erro ao processar a operação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Ordem a Mercado</h1>

      <div className="flex items-center justify-between mb-8 bg-card p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-semibold">{symbol[0]}</span>
          </div>
          <div>
            <h2 className="font-semibold">{shortName}</h2>
            <p className="text-sm text-muted-foreground">{symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold">
            {price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
        </div>
      </div>

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">Comprar</TabsTrigger>
          <TabsTrigger value="sell">Vender</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tipo de Ativo
              </label>
              <Select value={assetType} onValueChange={setAssetType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de ativo" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Data da Compra
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Quantidade
                </label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Valor unitário:</span>
                <span>
                  {price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total do investimento:</span>
                <span>
                  {total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => handleSubmit('buy')}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Confirmar Compra'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="sell" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tipo de Ativo
              </label>
              <Select value={assetType} onValueChange={setAssetType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de ativo" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Data da Venda
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Quantidade
                </label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Valor unitário:</span>
                <span>
                  {price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total da venda:</span>
                <span>
                  {total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              variant="destructive"
              onClick={() => handleSubmit('sell')}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Confirmar Venda'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PortfolioContent />
    </Suspense>
  );
}