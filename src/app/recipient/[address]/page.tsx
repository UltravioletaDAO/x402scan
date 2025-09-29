export default async function RecipientPage({
  params,
}: PageProps<'/recipient/[address]'>) {
  const { address } = await params;
  return <div>RecipientPage {address}</div>;
}
