'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';

import { useResourceFetch } from './contexts/fetch/context';

export function Form() {
  const {
    queryFields,
    bodyFields,
    queryValues,
    bodyValues,
    handleQueryChange,
    handleBodyChange,
    response,
    error,
  } = useResourceFetch();

  const hasQueryFields = queryFields.length > 0;
  const hasBodyFields = bodyFields.length > 0;

  return (
    <CardContent className="flex flex-col gap-4 p-4 border-t">
      {!hasQueryFields && !hasBodyFields ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No input parameters required.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {hasQueryFields && (
            <div className="space-y-3">
              {queryFields.map(field => (
                <div key={`query-${field.name}`} className="space-y-1">
                  <Label htmlFor={`query-${field.name}`}>
                    {field.name}
                    {field.required ? (
                      <span className="text-destructive">*</span>
                    ) : null}
                  </Label>
                  <Input
                    id={`query-${field.name}`}
                    placeholder={field.description ?? field.type ?? 'Value'}
                    value={queryValues[field.name] ?? ''}
                    onChange={event =>
                      handleQueryChange(field.name, event.target.value)
                    }
                    aria-required={field.required}
                  />
                  {field.description && (
                    <p className="text-xs text-muted-foreground">
                      {field.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasBodyFields && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Body Parameters
              </h3>
              {bodyFields.map(field => (
                <div key={`body-${field.name}`} className="space-y-1">
                  <Label htmlFor={`body-${field.name}`}>
                    {field.name}
                    {field.required ? (
                      <span className="text-destructive">*</span>
                    ) : null}
                  </Label>
                  <Input
                    id={`body-${field.name}`}
                    placeholder={field.description ?? field.type ?? 'Value'}
                    value={bodyValues[field.name] ?? ''}
                    onChange={event =>
                      handleBodyChange(field.name, event.target.value)
                    }
                    aria-required={field.required}
                  />
                  {field.description && (
                    <p className="text-xs text-muted-foreground">
                      {field.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error and response display - always visible */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
      )}

      {response !== undefined && (
        <pre className="max-h-60 overflow-auto rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </CardContent>
  );
}
