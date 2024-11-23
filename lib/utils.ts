import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRLNumber(value: string): string {
  // Remove any non-digit characters except comma
  const cleanValue = value.replace(/[^\d,]/g, '');
  
  // Convert comma to dot for calculations
  const numberValue = cleanValue.replace(',', '.');
  
  // Parse the number
  const number = parseFloat(numberValue);
  
  // If it's not a valid number, return empty string
  if (isNaN(number)) return '';
  
  // Format the number to Brazilian currency format
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseBRLNumber(value: string): number {
  return parseFloat(value.replace(/[^\d,-]/g, "").replace(",", "."));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
