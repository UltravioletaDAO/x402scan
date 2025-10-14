import { Body, Heading } from '@/app/_components/layout/page-utils';
import { RegisterResourceForm } from './_components/form';

export default function RegisterResourcePage() {
  return (
    <div>
      <Heading
        title="Register Resource"
        description="Add a resource to be tracked by x402scan."
      />
      <Body>
        <RegisterResourceForm />
      </Body>
    </div>
  );
}
