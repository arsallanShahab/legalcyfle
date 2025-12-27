import React from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number, spanClasses: string) => React.ReactNode;
  className?: string;
}

export function BentoGrid<T>({
  items,
  renderItem,
  className,
}: BentoGridProps<T>) {
  const count = items.length;

  // Dynamic Grid Configuration
  const getGridConfig = (count: number) => {
    if (count >= 10) return "md:grid-cols-4 md:auto-rows-[200px]";
    if (count >= 7) return "md:grid-cols-4 md:auto-rows-[220px]";

    switch (count) {
      case 6:
        return "md:grid-cols-3 md:auto-rows-[240px]";
      case 5:
        return "md:grid-cols-4 md:auto-rows-[240px]";
      case 4:
        return "md:grid-cols-4 md:auto-rows-[240px]";
      case 3:
        return "md:grid-cols-3 md:auto-rows-[240px]";
      case 2:
        return "md:grid-cols-2 md:auto-rows-[400px]";
      case 1:
        return "md:grid-cols-1 md:auto-rows-[500px]";
      default:
        return "md:grid-cols-4 md:auto-rows-[240px]";
    }
  };

  const getItemSpan = (index: number, count: number) => {
    // 10+ Items: 4 cols x 4 rows (Dense)
    if (count >= 10) {
      if (index === 0) return "md:col-span-2 md:row-span-2"; // Top Left Big
      if (index === 1) return "md:col-span-2 md:row-span-1"; // Top Right Wide
      if (index === 2 || index === 3) return "md:col-span-1 md:row-span-1"; // Middle Right
      if (index >= 4 && index <= 7) return "md:col-span-1 md:row-span-1"; // Row 3 Standard
      if (index === 8 || index === 9) return "md:col-span-2 md:row-span-1"; // Bottom Row Wide
      return "md:col-span-1 md:row-span-1"; // Overflow items
    }

    // 9 Items: 4 cols x 3 rows
    if (count === 9) {
      if (index === 0) return "md:col-span-2 md:row-span-2"; // Top Left Big
      return "md:col-span-1 md:row-span-1"; // Rest 1x1
    }

    // 8 Items: 4 cols x 3 rows
    if (count === 8) {
      if (index === 0) return "md:col-span-2 md:row-span-2"; // Top Left Big
      if (index === 1) return "md:col-span-1 md:row-span-2"; // Top Right Tall
      return "md:col-span-1 md:row-span-1"; // Rest 1x1
    }

    // 7 Items: 4 cols x 3 rows
    if (count === 7) {
      if (index === 0) return "md:col-span-2 md:row-span-2"; // Top Left Big
      if (index === 1) return "md:col-span-2 md:row-span-1"; // Top Right Wide
      if (index === 6) return "md:col-span-2 md:row-span-1"; // Bottom Right Wide
      return "md:col-span-1 md:row-span-1";
    }

    if (count === 6) {
      // 6 items: 3 cols x 3 rows
      // Item 0: 2x2 (Top Left)
      if (index === 0) return "md:col-span-2 md:row-span-2";
      return "md:col-span-1 md:row-span-1";
    }
    if (count === 5) {
      // 5 items: 4 cols x 2 rows
      // Item 0: 2x2 (Left)
      if (index === 0) return "md:col-span-2 md:row-span-2";
      return "md:col-span-1 md:row-span-1";
    }
    if (count === 4) {
      // 4 items: 4 cols x 2 rows
      // Item 0: 2x2 (Left)
      // Item 1: 1x2 (Right Tall)
      if (index === 0) return "md:col-span-2 md:row-span-2";
      if (index === 1) return "md:col-span-1 md:row-span-2";
      return "md:col-span-1 md:row-span-1";
    }
    if (count === 3) {
      // 3 items: 3 cols x 2 rows
      // Item 0: 2x2
      if (index === 0) return "md:col-span-2 md:row-span-2";
      return "md:col-span-1 md:row-span-1";
    }
    return "md:col-span-1 md:row-span-1";
  };

  return (
    <div
      className={cn("grid grid-cols-1 gap-4", getGridConfig(count), className)}
    >
      {items.map((item, index) => {
        const spanClasses = getItemSpan(index, count);
        return (
          <React.Fragment key={index}>
            {renderItem(item, index, spanClasses)}
          </React.Fragment>
        );
      })}
    </div>
  );
}
