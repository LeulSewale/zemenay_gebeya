'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductCardSkeleton() {
  return (
    <Card className="h-full flex flex-col transition-all duration-300 border-border/50 overflow-hidden">
      <CardHeader className="p-0 relative flex-shrink-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
          {/* Heart button skeleton */}
          <Skeleton className="absolute top-2 right-2 h-8 w-8 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2 flex-grow flex flex-col">
        {/* Title skeleton - two lines */}
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center gap-2 flex-wrap mt-auto">
          {/* Badge skeleton */}
          <Skeleton className="h-5 w-16 rounded-full" />
          {/* Rating skeleton */}
          <Skeleton className="h-4 w-10 rounded" />
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 border-t border-border/50 flex-shrink-0">
        <div className="flex w-full items-center justify-between">
          {/* Price skeleton */}
          <Skeleton className="h-6 w-16" />
          {/* Stock skeleton */}
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
}

