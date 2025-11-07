'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/api';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((fav) => fav.id === product.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(product));
    toast.success(
      isFavorite ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover-lift border-border/50 hover:border-primary/30 overflow-hidden">
        <CardHeader className="p-0 relative flex-shrink-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background hover:scale-110 shadow-lg"
              onClick={handleToggleFavorite}
            >
              <Heart
                className={`h-3.5 w-3.5 transition-all duration-200 ${
                  isFavorite 
                    ? 'fill-red-500 text-red-500 scale-110' 
                    : 'text-muted-foreground group-hover:text-red-500'
                }`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 space-y-2 flex-grow flex flex-col">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-tight">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap mt-auto">
            <Badge 
              variant="secondary" 
              className="bg-secondary/50 hover:bg-secondary transition-colors text-xs px-1.5 py-0.5"
            >
              {product.brand}
            </Badge>
            <div className="flex items-center gap-0.5 text-xs font-medium">
              <span className="text-yellow-500">★</span>
              <span className="text-foreground">{product.rating.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 border-t border-border/50 flex-shrink-0">
          <div className="flex w-full items-center justify-between">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              ${product.price}
            </span>
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
              product.stock > 0 
                ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                : 'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}>
              {product.stock > 0 ? product.stock : '0'}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

