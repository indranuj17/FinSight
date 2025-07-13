"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";



// Fetch the current user's budget and current month's expenses for a given account
export async function getCurrentBudget(accountId) {
  try {
    // Get the logged-in user's ID using auth provider (e.g., Clerk)
    const { userId } = await auth();

    // If no user ID is found, throw an error
    if (!userId) throw new Error("Unauthorized");

    // Find the user in the database using their Clerk user ID
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    // If user not found in DB, throw an error
    if (!user) {
      throw new Error("User not found");
    }

    // Fetch the budget record for the current user
    const budget = await db.budget.findFirst({
      where: {
        userId: user.id,
      },
    });

    // Get the current date
    const currentDate = new Date();

    // Calculate the start of the current month (e.g., 1st July)
    const startOfMonth = new Date(
      currentDate.getFullYear(),   // Current year
      currentDate.getMonth(),      // Current month (0-based index)
      1                            // First day of the month
    );

    // Calculate the end of the current month (e.g., 31st July)
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,  // Next month
      0                            // Day 0 of next month = last day of current month
    );

    // Aggregate all EXPENSE transactions for the current user within the current month and selected account
    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,           // Only this user's transactions
        type: "EXPENSE",           // Only expense-type transactions
        date: {
          gte: startOfMonth,       // Greater than or equal to 1st of month
          lte: endOfMonth,         // Less than or equal to end of month
        },
        accountId,                 // Filter by selected account ID
      },
      _sum: {
        amount: true,              // Sum up the `amount` field
      },
    });

    // Return the budget and current expenses in a usable format
    return {
      // If a budget is found, convert Decimal amount to number, otherwise return null
      budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,

      // If expenses exist, convert to number; otherwise, return 0
      currentExpenses: expenses._sum.amount
        ? expenses._sum.amount.toNumber()
        : 0,
    };
  } catch (error) {
    // Log any errors and rethrow them to be handled by the caller
    console.error("Error fetching budget:", error);
    throw error;
  }
}





// Function to update or create the user's budget
export async function updateBudget(amount) {
  try {

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // 5. Upsert the budget:
    // - If a budget for the user exists, update the amount
    // - If not, create a new budget entry with the userId and amount
    const budget = await db.budget.upsert({
      where: {
        userId: user.id,  // Match by user ID
      },
      update: {
        amount,           // Update amount if budget exists
      },
      create: {
        userId: user.id,  // Create new record if none exists
        amount,           // With the specified amount
      },
    });

    // 6. Invalidate and revalidate the "/dashboard" route to reflect changes
    revalidatePath("/dashboard");

    // 7. Return success response with the updated budget,
    // converting Decimal to number for frontend use
    return {
      success: true,
      data: { ...budget, amount: budget.amount.toNumber() },
    };
  } catch (error) {
    // 8. If an error occurs, log it and return an error response
    console.error("Error updating budget:", error);
    return { success: false, error: error.message };
  }
}
