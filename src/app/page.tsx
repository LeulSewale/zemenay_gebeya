'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { productApi, Product, ProductsResponse } from '@/lib/api';
import { toast } from 'sonner';

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [minRating, setMinRating] = useState<number>(0);
  
  const limit = 10;

  // Fetch all products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories
        const cats = await productApi.getCategories();
        setCategories(cats.filter((cat): cat is string => typeof cat === 'string'));
        
        // Fetch initial products
        const response = await productApi.getProducts(100, 0);
        setAllProducts(response.products);
        setFilteredProducts(response.products.slice(0, limit));
        setHasMore(response.products.length > limit);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...allProducts];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Apply price range filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Apply rating filter
    if (minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    setFilteredProducts(filtered.slice(0, skip + limit));
    setHasMore(filtered.length > skip + limit);
  }, [allProducts, searchQuery, selectedCategory, priceRange, minRating, skip, limit]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSkip(0);
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      setSkip((prev) => prev + limit);
    }
  }, [loading, hasMore, limit]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 2000]);
    setMinRating(0);
    setSearchQuery('');
    setSkip(0);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (priceRange[0] > 0 || priceRange[1] < 2000) count++;
    if (minRating > 0) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedCategory, priceRange, minRating, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 1000 &&
        !loading &&
        hasMore
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, handleLoadMore]);

  if (error && allProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-destructive text-lg mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Full Width Search Bar */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative group">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 z-10" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-20 sm:pr-28 md:pr-32 h-11 sm:h-12 md:h-14 text-sm sm:text-base border-2 focus:border-primary transition-all duration-200 rounded-lg shadow-sm focus:shadow-md focus:shadow-primary/10"
            />
            <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex gap-1 sm:gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 sm:p-1.5"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8 sm:h-9 relative text-xs sm:text-sm px-2 sm:px-3"
              >
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-[10px] sm:text-xs bg-primary text-primary-foreground">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              <Button 
                type="submit" 
                disabled={isSearching}
                className="h-8 sm:h-9 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-200 hover:scale-105 disabled:opacity-50 px-2 sm:px-3"
              >
                {isSearching ? (
                  <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4 md:p-6 shadow-lg space-y-3 sm:space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold">Filters</h3>
              <div className="flex gap-1 sm:gap-2">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs h-8 sm:h-9"
                  >
                    Clear All
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(false)}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Category Filter */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-9 sm:h-10 text-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium">
                  Price: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={2000}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Rating Filter */}
              <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                <label className="text-xs sm:text-sm font-medium">
                  Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
                </label>
                <Slider
                  value={[minRating]}
                  onValueChange={(value) => setMinRating(value[0])}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(activeFiltersCount > 0 || searchQuery) && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <span className="text-muted-foreground hidden sm:inline">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1 text-xs px-2 py-0.5">
                <span className="hidden sm:inline">Search: </span>
                <span className="truncate max-w-[100px] sm:max-w-none">{searchQuery}</span>
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-destructive">
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1 text-xs px-2 py-0.5">
                <span className="hidden sm:inline">Category: </span>
                <span className="truncate">{selectedCategory}</span>
                <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-destructive">
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 2000) && (
              <Badge variant="secondary" className="gap-1 text-xs px-2 py-0.5">
                <span className="hidden sm:inline">Price: </span>
                ${priceRange[0]}-${priceRange[1]}
                <button onClick={() => setPriceRange([0, 2000])} className="ml-1 hover:text-destructive">
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </Badge>
            )}
            {minRating > 0 && (
              <Badge variant="secondary" className="gap-1 text-xs px-2 py-0.5">
                <span className="hidden sm:inline">Rating: </span>
                {minRating}+
                <button onClick={() => setMinRating(0)} className="ml-1 hover:text-destructive">
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <span>
            Showing <span className="font-semibold">{filteredProducts.length}</span> of <span className="font-semibold">{allProducts.length}</span> products
          </span>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
        {filteredProducts.length === 0 && !loading ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground text-base sm:text-lg">
              No products found matching your criteria
            </p>
            {activeFiltersCount > 0 && (
              <Button onClick={clearFilters} variant="outline" className="mt-4 h-9 sm:h-10">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {loading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={`skeleton-${i}-${skip}`} className="space-y-3 sm:space-y-4">
                    <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                    <Skeleton className="h-3 sm:h-4 w-3/4" />
                    <Skeleton className="h-3 sm:h-4 w-1/2" />
                  </div>
                ))}
            </div>
            
            {hasMore && !loading && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <Button onClick={handleLoadMore} variant="outline" className="h-9 sm:h-10 px-6 sm:px-8 hover:scale-105 transition-transform">
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
