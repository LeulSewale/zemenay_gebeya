'use client';

import { useAppSelector } from '@/store/hooks';
import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const favorites = useAppSelector((state) => state.favorites.items);

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-6 sm:mb-8 space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">My Favorites</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {favorites.length} {favorites.length === 1 ? 'product' : 'products'} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4">
          <div className="relative">
            <Heart className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground/50 mb-4 animate-pulse" />
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
          </div>
          <p className="text-muted-foreground text-base sm:text-lg font-medium text-center">
            No favorite products yet
          </p>
          <p className="text-muted-foreground text-sm sm:text-base text-center">
            Start adding products to your favorites!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

