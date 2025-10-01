import { Nav } from '../../_components/layout/nav';

export default async function TransactionLayout({
  children,
  params,
}: LayoutProps<'/transaction/[hash]'>) {
  const { hash } = await params;
  return (
    <div className="flex flex-col flex-1">
      <Nav
        tabs={[
          {
            label: 'Overview',
            href: `/transaction/${hash}`,
          },
        ]}
      />
      <div className="flex flex-col py-6 md:py-8 flex-1">{children}</div>
    </div>
  );
}
