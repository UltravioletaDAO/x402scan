import { Body } from '@/app/_components/layout/page-utils';
import { Agents } from './_components/agents';
import { ComposerHomeHeading } from './_components/heading';

export default function ComposerPage() {
  return (
    <div className="py-6 md:py-8">
      <ComposerHomeHeading />
      <Body>
        <Agents />
      </Body>
    </div>
  );
}
