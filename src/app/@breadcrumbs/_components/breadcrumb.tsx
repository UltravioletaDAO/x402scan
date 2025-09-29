import React from "react";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

// import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react";
import type { Route } from "next";

interface Props<T extends string> {
  href: Route<T>;
  image: string | null;
  name: string;
  Fallback: LucideIcon;
  mobileHideText?: boolean;
  disabled?: boolean;
}

export const Breadcrumb = <T extends string>({
  href,
  image,
  name,
  Fallback,
  mobileHideText = false,
  disabled = false,
}: Props<T>) => {
  return (
    <Link
      href={href}
      className={cn(disabled && "pointer-events-none")}
      aria-disabled={disabled}
    >
      <div className="flex items-center gap-2 cursor-pointer">
        <Avatar className={cn("rounded-md overflow-hidden bg-card size-5")}>
          {image ? (
            <AvatarImage src={image} className="size-full" />
          ) : (
            <AvatarImage />
          )}
          <AvatarFallback
            className={cn(
              "size-full flex items-center justify-center border rounded-md",
              "size-5"
            )}
          >
            <Fallback className="size-3" />
          </AvatarFallback>
        </Avatar>
        <p
          className={cn(
            "font-semibold text-sm",
            mobileHideText && "hidden md:block"
          )}
        >
          {name}
        </p>
      </div>
    </Link>
  );
};

// export const LoadingBreadcrumb = () => {
//   return (
//     <div className="flex items-center gap-2 cursor-pointer">
//       <Skeleton className="size-5" />
//       <Skeleton className="w-16 h-[14px]" />
//     </div>
//   );
// };
