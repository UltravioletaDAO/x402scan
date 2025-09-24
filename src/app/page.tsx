import { listTopRecipients } from "@/services/base-sql/list-top-recipients";

export default async function Home() {
  const topRecipients = await listTopRecipients({
    limit: 10,
    sortType: "total_amount",
  });
  console.log(topRecipients);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"></main>
    </div>
  );
}
