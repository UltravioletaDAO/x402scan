import { ScrollText } from 'lucide-react';
import { Breadcrumb } from '../../_components/breadcrumb';
import { Separator } from '../../_components/separator';

export default function NewsPage() {
  return (
    <>
      <Separator />
      <Breadcrumb
        href="/resources"
        image={null}
        name="Resources"
        Fallback={ScrollText}
      />
    </>
  );
}
