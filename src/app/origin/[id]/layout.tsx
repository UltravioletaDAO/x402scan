export default function OriginLayout({
  children,
}: LayoutProps<'/origin/[id]'>) {
  return (
    <div className="flex flex-col flex-1">
      <div className="h-4 border-b bg-card" />
      {children}
    </div>
  );
}
