"use client";

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Fund, Portfolio } from '@/lib/types';

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
  const [assets, setAssets] = useState<Portfolio[]>([]);

  useEffect(() => {
    const fetchPortfolioHome = async () => {
      const userte = await fetch('/api/auth/user');
      const userId = await userte.json();
      const response = await fetch(`/api/portfolio?userId=${userId.id}`);
      const data = await response.json();
      
      setAssets(data);  // Atualiza os dados no estado
    };
    fetchPortfolioHome();
  }, []);

  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto -mx-4 lg:mx-0">
      <table className="min-w-full px-4 lg:px-0">
        <thead>
          <tr className="border-b">
              <th className="text-left p-4">Data da Compra</th>
              <th className="text-left p-4">Grupo</th>
              <th className="text-left p-4">Ticker</th>
              <th className="text-right p-4">Ações</th>
              <th className="text-right p-4">Preço Médio</th>
              <th className="text-right p-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                {formatDate(new Date(asset.lastUpdate))} {/* Usando a função para formatar a data */}
              </td>
              <td className="p-4">{asset.assetType}</td>
              <td className="p-4">{asset.symbol}</td>
              <td className="p-4 text-right">
                {asset.quantity?.toLocaleString() || '0'} {/* Verificando se shares é válido */}
              </td>
              <td className="p-4 text-right">
                {Number(asset.averagePrice).toLocaleString('pt-BR', {
                  style: 'decimal',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
              <td className="p-4 text-right">
                {((asset.quantity || 0) * (asset.averagePrice || 0)).toLocaleString('pt-BR', {style: 'decimal', maximumFractionDigits: 2})}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
