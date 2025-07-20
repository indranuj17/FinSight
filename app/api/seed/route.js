import { seedTransactions } from "@/app/actions/seed";

export async function POST() {
  const result = await seedTransactions();
  return Response.json(result);
}
