'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Home, Plus, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { Badge } from '@/components/ui/badge';

export default function Navigation() {
  const pathname = usePathname();
  const favorites = useAppSelector((state) => state.favorites.items);
  const theme = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/product/create', label: 'Create Product', icon: Plus },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
        <Link 
          href="/" 
          className="text-lg sm:text-xl md:text-2xl font-bold gradient-text hover:opacity-80 transition-opacity duration-200 truncate"
        >
          Go Shopping
        </Link>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={`relative transition-all duration-200 hidden sm:flex ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                      : 'hover:bg-accent/50'
                  }`}
                >
                  <Icon className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                  {item.href === '/favorites' && favorites.length > 0 && (
                    <Badge className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-[10px] sm:text-xs bg-primary/20 text-primary font-semibold">
                      {favorites.length}
                    </Badge>
                  )}
                </Button>
                {/* Mobile icon-only buttons */}
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="icon"
                  className={`sm:hidden h-9 w-9 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : ''
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="h-4 w-4" />
                  {item.href === '/favorites' && favorites.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground font-semibold">
                      {favorites.length}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
            className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-accent/50 transition-all duration-200 hover:scale-110"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}

