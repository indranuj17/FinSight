"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";



const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) serialized.balance = obj.balance.toNumber();
  if (obj.amount) serialized.amount = obj.amount.toNumber();
  return serialized;
};

export async function updateDefaultAccount(accountId){
    try {
        const {userId}=await auth();
        if(!userId){
            throw new Error("Unauthorized");
        }

        const user=await db.user.findUnique({
            where:{clerkUserId:userId}
        })

        if(!user){
            throw new Error("User not found");
        }
       
        //first unset any existing default account
        await db.account.updateMany({
            where:{userId:user.id, isDefault:true},
            data:{isDefault:false}
        })
        
        //set the account instructed by user thru accountId to default
        const account=await db.account.update({
            where:{id:accountId,userId:user.id},
            data:{isDefault:true}
        })

        revalidatePath("/dashboard");
        return {success:true, data:serializeTransaction(account)};
    } catch (error) {

        console.log("Error in the account.js in actions folder",error.message);
        return {success:false, error:error.message};
    }
}



export async function getAccountWithTransactions(accountId){
   const {userId}=await auth();
        if(!userId){
            throw new Error("Unauthorized");
        }

        const user=await db.user.findUnique({
            where:{clerkUserId:userId}
        })

        if(!user){
            throw new Error("User not found");
        }
        
    const account = await db.account.findUnique({
    where: {
      id: accountId,
      userId: user.id,
    },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
      _count: {
        select: { transactions: true },
      },
    },
  });

  return {
    ...serializeTransaction(account),
    transactions: account.transactions.map(serializeTransaction),
  };
}





// Function to bulk delete multiple transactions and update account balances accordingly
export async function bulkDeleteTransactions(transactionIds) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Find the user in the database based on Clerk userId
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");



    // Fetch all transactions that match the given IDs and belong to the authenticated user
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds }, //"Find  all records where the id is in the list transactionIds
        userId: user.id,
      },
    });

    // const accountId = transactions[0]?.accountId; // get from first transaction



    // Group and calculate how each account’s balance should be adjusted
    // If it's an EXPENSE, we need to add the amount back; if INCOME, subtract it
    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      const change =
        transaction.type === "EXPENSE"
          ? transaction.amount               // refund expense
          : -transaction.amount;            // remove income
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {}); // Start with empty object

    // Perform the deletion and balance update as a single transaction to ensure atomicity
    await db.$transaction(async (tx) => {
      // Delete all selected transactions
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });

      // Update the balance for each affected account
      for (const [accountId, balanceChange] of Object.entries(accountBalanceChanges)) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange, // increment can be positive or negative
            },
          },
        });
      }
    });

    // Revalidate relevant pages to show updated data
    revalidatePath("/dashboard");
    revalidatePath(`/accounts/[id]`,`page`);

    return { success: true }; // Return success status
  } catch (error) {
    // Catch and return any error that occurs
    return { success: false, error: error.message };
  }
}
