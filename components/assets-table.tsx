"use client";

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Fund } from '@/lib/types';

interface Asset {
  id: number;
  lastUpdate: string;
  assetType: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
}

interface ApiResponse {
  portfolio: Asset[];
}

export function AssetsTable() {
  const [assets, setAssets] = useState<Fund[]>([]);

  useEffect(() => {
    const fetchPortfolioHome = async () => {
      const response = await fetch('/api/portfolio');
      const data: Fund[] = await response.json();
      console.log(data);  // Verifique os dados retornados pela API
      setAssets(data);  // Atualiza os dados no estado
    };
    fetchPortfolioHome();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Data inválida' : format(date, 'dd/MM/yyyy');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Purchase Date</th>
            <th className="text-left p-4">Group</th>
            <th className="text-left p-4">Ticker</th>
            <th className="text-right p-4">Shares</th>
            <th className="text-right p-4">Average Price</th>
            <th className="text-right p-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                {formatDate(asset.last_update)} {/* Usando a função para formatar a data */}
              </td>
              <td className="p-4">{asset.asset_type}</td>
              <td className="p-4">{asset.symbol}</td>
              <td className="p-4 text-right">
                {asset.quantity?.toLocaleString() || '0'} {/* Verificando se shares é válido */}
              </td>
              <td className="p-4 text-right">
                {asset.average_price?.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }) || 'R$ 0,00'} {/* Verificando se averagePrice é válido */}
              </td>
              <td className="p-4 text-right">
                {((asset.quantity || 0) * (asset.average_price || 0)).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
