import { Body } from '@/app/_components/layout/page-utils';
import { Agents } from './_components/agents';
import { ComposerHomeHeading } from './_components/heading';
import { Tools } from './_components/tools';
import { OverallStats } from './_components/stats';

export default function ComposerPage() {
  return (
    <div>
      <ComposerHomeHeading />
      <Body>
        <Agents />
        <Tools />
        <OverallStats />
      </Body>
    </div>
  );
}
