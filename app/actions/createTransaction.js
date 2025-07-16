"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Helper to safely serialize Decimal amounts
const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

export async function CreateTransactions(data) {
  try {
    // 🔐 Auth check
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // 🔍 Find the logged-in user in DB
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    // 🔍 Find user's account
    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });
    if (!account) {
      throw new Error("Account not found");
    }

    // 🧮 Validate and convert amount
    const amount = Number(data.amount);
    if (isNaN(amount)) {
      throw new Error("Invalid amount");
    }

    // 🧾 Compute balance change
    const balanceChange = data.type === "EXPENSE" ? -amount : amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    // ✅ Transaction: create transaction & update account balance
    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          amount,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    // 🧹 Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath(`/accounts/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message || "Transaction creation failed");
  }
}

// 📆 Helper: Calculate next recurring date
function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      break;
  }

  return date;
}
