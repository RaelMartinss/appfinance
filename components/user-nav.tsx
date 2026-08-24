"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

interface UserNavProps {
  user: { name: string | null; email: string } | null;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className='flex items-center space-x-2 p-4'>
        <Avatar className="h-5 w-5">
            <AvatarFallback>
              <User className="h-3 w-3" />
              
            </AvatarFallback>
          </Avatar>
          <span>{user?.name}</span>
        </div>
        {/* <DropdownMenuLabel>Conta</DropdownMenuLabel> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={isLoading}
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
