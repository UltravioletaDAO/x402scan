import { Breadcrumb } from './_components/breadcrumb';

export default function BreadcrumbLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb
        href="/"
        image={null}
        Fallback={null}
        name="x402scan"
        textClassName="font-bold font-mono"
        mobileHideText={true}
      />
      {children}
    </>
  );
}
