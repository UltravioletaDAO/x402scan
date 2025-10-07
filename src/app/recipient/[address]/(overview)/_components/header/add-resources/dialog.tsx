'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/client';
import { Methods } from '@/types/x402';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const AddResourcesDialog = () => {
  const [url, setUrl] = useState('');

  const { mutate: addResource, isPending } = api.resources.register.useMutation(
    {
      onSuccess: data => {
        toast.success('Resource added successfully');
        console.log('Resource added successfully', data);
      },
      onError: e => {
        toast.error('Failed to add resource');
        console.error('Failed to add resource', e);
      },
    }
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="size-4" />
          Add Resources
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Resources</DialogTitle>
          <DialogDescription>
            Add resources to your recipient account.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Resource URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <Button
          type="submit"
          disabled={isPending}
          onClick={() => addResource({ url, method: Methods.GET })}
        >
          {isPending ? 'Adding...' : 'Add'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
