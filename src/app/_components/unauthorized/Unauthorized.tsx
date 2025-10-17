import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Unauthorized() {
  return (
    <Card className="gap-4 flex flex-col">
      <CardHeader className="flex flex-col items-center text-center">
        <ShieldAlert className="size-12 text-destructive mb-4" />
        <CardTitle className="text-xl font-bold">Access Denied</CardTitle>
        <CardDescription className="text-base">
          You don&apos;t have permission to access this page.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href="/" className="flex-1" prefetch={false}>
          <Button variant="outline" className="w-full">
            Back to Home
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

