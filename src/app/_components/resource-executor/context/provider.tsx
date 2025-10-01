import { ResourceExecutorContext } from './context';
import { useX402Test } from '@/app/_hooks/x402/use-test';
import { Methods } from '@/types/methods';

interface Props {
  resource: string;
  method: Methods | undefined;
  children: React.ReactNode;
}

export const ResourceExecutorProvider: React.FC<Props> = ({
  children,
  resource,
  method,
}) => {
  const { isLoading, rawResponse, error, x402Response, parseErrors, refetch } =
    useX402Test(resource, { method: method ?? Methods.GET }, { enabled: true });

  return (
    <ResourceExecutorContext.Provider
      value={{
        resource,
        method,
        response: x402Response,
        isLoading,
        error,
        parseErrors,
        refetch: () => void refetch(),
        rawResponse,
      }}
    >
      {children}
    </ResourceExecutorContext.Provider>
  );
};
