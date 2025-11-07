'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Heart, Home, Plus, Moon, Sun, Search, X, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { logout } from '@/store/slices/authSlice';
import { Badge } from '@/components/ui/badge';
import CreateProductModal from '@/components/CreateProductModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const favorites = useAppSelector((state) => state.favorites.items);
  const theme = useAppSelector((state) => state.theme.mode);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Sync search query with URL params
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // If not on home page, navigate to home with search query
    if (pathname !== '/') {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
    } else {
      // Update URL params without navigation
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery.trim()) {
        params.set('q', searchQuery);
      } else {
        params.delete('q');
      }
      router.push(`/?${params.toString()}`, { scroll: false });
    }
    
    setTimeout(() => setIsSearching(false), 300);
  };

  const clearSearch = () => {
    setSearchQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/');
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/favorites', label: 'Favorites', icon: Heart },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        {/* Top Row: Logo and Nav Items */}
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          <Link 
            href="/" 
            className="text-lg sm:text-xl md:text-2xl font-bold gradient-text hover:opacity-80 transition-opacity duration-200 truncate flex-shrink-0"
          >
            Go Shopping
          </Link>
          
          {/* Search Bar - Center */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-2 sm:mx-4 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 z-10" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 h-9 sm:h-10 text-sm border-2 focus:border-primary transition-all duration-200 rounded-lg shadow-sm focus:shadow-md focus:shadow-primary/10"
              />
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <Button 
                  type="submit" 
                  disabled={isSearching}
                  size="icon"
                  className="h-7 w-7 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                >
                  {isSearching ? (
                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Search className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </form>
          
          {/* Nav Items and Theme Toggle */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
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
            
            {/* Create Product Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="relative transition-all duration-200 hidden sm:flex hover:bg-accent/50"
            >
              <Plus className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Create Product</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCreateModalOpen(true)}
              className="sm:hidden h-9 w-9"
              aria-label="Create Product"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            {/* Mobile Search Button */}
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </Link>
            
            {/* Auth Button */}
            {auth.isAuthenticated && auth.user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative transition-all duration-200 hidden sm:flex hover:bg-accent/50"
                    >
                      <User className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden md:inline truncate max-w-[100px]">
                        {auth.user.firstName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{auth.user.firstName} {auth.user.lastName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{auth.user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Mobile logout button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="sm:hidden h-9 w-9"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative transition-all duration-200 hidden sm:flex hover:bg-accent/50"
                  >
                    <LogIn className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden md:inline">Login</span>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden h-9 w-9"
                    aria-label="Login"
                  >
                    <LogIn className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
            
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
        
        {/* Mobile Search Bar - Below */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 z-10" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 h-10 text-sm border-2 focus:border-primary transition-all duration-200 rounded-lg shadow-sm focus:shadow-md focus:shadow-primary/10"
            />
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <Button 
                type="submit" 
                disabled={isSearching}
                size="icon"
                className="h-8 w-8 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                {isSearching ? (
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Search className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
      
      <CreateProductModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </nav>
  );
}

