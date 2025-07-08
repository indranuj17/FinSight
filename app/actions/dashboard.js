"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma"; // ✅ Add this

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) serialized.balance = obj.balance.toNumber();
  if (obj.amount) serialized.amount = obj.amount.toNumber();
  return serialized;
};

export async function createAccount(data) {

  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // “Find the user in the database whose clerkUserId matches the currently authenticated userId from Clerk.”
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

            //convert balance to float before saving
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) throw new Error("Invalid Balance Amount");


    //Get Clerk's user ID using auth() → userId = "user_abc123xyz"

// Find the matching user in your own database via clerkUserId

// Now, user.id is your app’s primary key for that user → used for transactions, accounts, etc.

// ✅ You never store Clerk’s userId as your main user ID — you store it alongside your own.

     // Check if this is the user's first account
    const existingAccount = await db.account.findMany({
      where: { userId: user.id },
    });

      // If it's the first account, make it default regardless of user input
        // If not, use the user's preference
    const shouldBeDefault = existingAccount.length === 0 ? true : data.isDefault;


      // If this account should be default, unset other default accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAccount = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializedAccount = serializeTransaction(newAccount);
    revalidatePath("/dashboard");

    return { success: true, data: serializedAccount };

  } catch (error) {
    console.log("Error in the dashboard.js", error.message);
    throw new Error("Internal Server Error");
  }
}





export async function getUserAccounts(){
  const {userId}=await auth();

  if(!userId){
    throw new Error("Unauthorized");
  }

  const user=await db.user.findMany({
    where:{
      clerkUserId:userId,
    }
  });

  if(!user){
    throw new Error("User not found");
  }

  const accounts=await db.account.findMany({
    where:{userId:user.id},
    orderBy:{createdAt:"desc"},
    include:{
      _count:{
        select:{
          transactions:true
        }
      }
    }
  })

  const serializedAccount=accounts.map(serializeTransaction); //since accounts is an array...need to serialize each account in the accounts array
  return serializedAccount; //an array
}