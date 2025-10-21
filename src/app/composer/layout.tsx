import { Nav } from '../_components/layout/nav';

export default function ComposerLayout({ children }: LayoutProps<'/composer'>) {
  return (
    <div className="flex flex-col flex-1">
      <Nav
        tabs={[
          {
            label: 'Home',
            href: '/composer',
          },
          {
            label: 'Chat',
            href: '/composer/chat',
            subRoutes: ['/composer/chat/'],
          },
          {
            label: 'Agents',
            href: '/composer/agents',
            subRoutes: ['/composer/agent/', '/composer/agents/'],
          },
          {
            label: 'Transactions',
            href: '/transactions',
          },
        ]}
      />
      <div className="flex flex-col py-6 md:py-8 flex-1">{children}</div>
    </div>
  );
}
