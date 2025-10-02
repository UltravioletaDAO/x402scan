import { api } from '@/trpc/server';

export const TopFacilitators = async () => {
  const facilitators = await api.facilitators.list({
    limit: 100,
  });

  console.log(facilitators);

  return (
    <div>
      <h2 className="text-2xl font-bold">Top Facilitators</h2>
    </div>
  );
};
