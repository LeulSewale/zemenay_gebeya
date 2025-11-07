'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import { productApi, Product, ProductsResponse } from '@/lib/api';
import { toast } from 'sonner';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<{ slug: string; name: string; url: string }[]>([]);
  
  // Get search query from URL params
  const searchQuery = searchParams.get('q') || '';
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [minRating, setMinRating] = useState<number>(0);
  
  // Sorting states
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const limit = 10;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await productApi.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch products with filters and sorting
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response: ProductsResponse;
        
        // If category is selected, fetch by category
        if (selectedCategory !== 'all') {
          response = await productApi.getProductsByCategory(selectedCategory);
        } else {
          // Fetch all products with sorting
          response = await productApi.getProducts(
            100, 
            0, 
            sortBy || undefined, 
            sortOrder
          );
        }
        
        setAllProducts(response.products);
        setSkip(0);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory, sortBy, sortOrder]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...allProducts];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.title?.toLowerCase() || '').includes(query) ||
          (p.description?.toLowerCase() || '').includes(query) ||
          (p.brand?.toLowerCase() || '').includes(query) ||
          (p.category?.toLowerCase() || '').includes(query)
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


  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      setSkip((prev) => prev + limit);
    }
  }, [loading, hasMore, limit]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 2000]);
    setMinRating(0);
    setSortBy('');
    setSortOrder('asc');
    setSkip(0);
    // Clear search query from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    window.history.pushState({}, '', `/?${params.toString()}`);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (priceRange[0] > 0 || priceRange[1] < 2000) count++;
    if (minRating > 0) count++;
    if (searchQuery.trim()) count++;
    if (sortBy) count++;
    return count;
  }, [selectedCategory, priceRange, minRating, searchQuery, sortBy]);

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

  // Helper function to render filters content (used in both sidebar and mobile sheet)
  const renderFiltersContent = () => {
    return (
      <>
        {/* Sorting Section */}
        <div className="space-y-3 pb-4 border-b border-border">
          <h4 className="text-sm font-semibold">Sort By</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Field</label>
              <Select value={sortBy || 'none'} onValueChange={(value) => setSortBy(value === 'none' ? '' : value)}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Default</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Order</label>
              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={2000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$2000</span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Minimum Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
          </label>
          <Slider
            value={[minRating]}
            onValueChange={(value) => setMinRating(value[0])}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>5</span>
          </div>
        </div>
      </>
    );
  };

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
      {/* Mobile Filter Button - Top Bar */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
     
        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="lg:hidden h-8 sm:h-9 relative text-xs sm:text-sm px-2 sm:px-3"
            >
              <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-[10px] sm:text-xs bg-primary text-primary-foreground">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 flex flex-col">
            <SheetHeader className="p-6 border-b border-border flex-shrink-0">
              <SheetTitle>Filters & Sort</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {renderFiltersContent()}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Layout: Sidebar + Products Grid */}
      <div className="flex gap-4 lg:gap-6">
        {/* Left Sidebar Filters - Desktop Only */}
        <aside className="hidden lg:block w-64 xl:w-80 flex-shrink-0">
          <div className="sticky top-24 bg-card border border-border rounded-lg shadow-md h-[calc(100vh-8rem)] flex flex-col">
            {/* Header - Fixed */}
            <div className="p-4 xl:p-6 border-b border-border flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Sort
              </h3>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs h-8"
                >
                  Clear All
                </Button>
              )}
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 xl:p-6 space-y-6">
              {renderFiltersContent()}
            </div>
          </div>
        </aside>

        {/* Products Grid - Main Content */}
        <main className="flex-1 min-w-0">
          {/* Active Filters Display */}
          {(activeFiltersCount > 0 || searchQuery) && (
            <div className="mb-4 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground hidden sm:inline">Active:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1 text-xs px-2 py-0.5">
                  <span className="hidden sm:inline">Search: </span>
                  <span className="truncate max-w-[100px] sm:max-w-none">{searchQuery}</span>
                  <button 
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete('q');
                      router.push(`/?${params.toString()}`, { scroll: false });
                    }} 
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-xs px-2 py-0.5">
                  <span className="hidden sm:inline">Category: </span>
                  <span className="truncate">
                    {categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}
                  </span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {loading &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={`skeleton-${i}-${skip}`} />
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
      </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
