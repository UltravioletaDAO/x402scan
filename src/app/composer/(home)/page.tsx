import { Body } from '@/app/_components/layout/page-utils';
import { Agents } from './_components/agents';
import { ComposerHomeHeading } from './_components/heading';
import { Tools } from './_components/tools';

export default function ComposerPage() {
  return (
    <div className="py-6 md:py-8">
      <ComposerHomeHeading />
      <Body>
        <Agents />
        <Tools />
      </Body>
    </div>
  );
}
