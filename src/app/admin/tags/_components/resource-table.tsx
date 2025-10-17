'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { api, type RouterOutputs } from '@/trpc/client';
import { EditTagModal } from './edit-tag-modal';
import { ControlMenu } from './control-menu';
import type { RowSelectionState } from '@tanstack/react-table';

type Resource =
  RouterOutputs['resources']['list']['paginated']['items'][number];

const PAGE_SIZE = 25;

export const ResourceTable = () => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading } = api.resources.list.paginated.useQuery({
    skip: page * PAGE_SIZE,
    limit: PAGE_SIZE,
  });

  const resources = data?.items ?? [];
  const hasNextPage = data?.hasNextPage ?? false;

  const selectedResources = Object.keys(rowSelection)
    .filter(key => rowSelection[key])
    .map(id => resources.find(r => r.id === id))
    .filter(Boolean) as Resource[];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ControlMenu
          selectedResources={selectedResources}
          onSuccess={() => setRowSelection({})}
        />
      </div>

      <DataTable
        columns={columns}
        data={resources}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        onRowClick={row => setSelectedResource(row.original)}
        page={page}
        onPageChange={setPage}
        hasNextPage={hasNextPage}
        enableRowSelection={true}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        getRowId={(row, index) => row?.id ?? `loading-${index}`}
      />

      {selectedResource && (
        <EditTagModal
          open={!!selectedResource}
          onOpenChange={open => !open && setSelectedResource(null)}
          resourceId={selectedResource.id}
          resourceName={selectedResource.resource}
          pagination={{
            skip: page * PAGE_SIZE,
            limit: PAGE_SIZE,
          }}
        />
      )}
    </div>
  );
};
