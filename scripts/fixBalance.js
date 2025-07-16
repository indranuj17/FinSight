
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function fixBalance() {
  try {
    const accounts = await db.account.findMany({
      include: {
        transactions: true,
      },
    });

    for (const account of accounts) {
      const actualBalance = account.transactions.reduce((acc, transaction) => {
        return transaction.type === "EXPENSE"
          ? acc - Number(transaction.amount)
          : acc + Number(transaction.amount);
      }, 0);

      await db.account.update({
        where: { id: account.id },
        data: {
          balance: actualBalance,
        },
      });

      console.log(`✅ Fixed balance for account: ${account.name}`);
    }

    console.log("🎉 All account balances updated.");
  } catch (err) {
    console.error("❌ Error fixing balances:", err);
  } finally {
    await db.$disconnect();
  }
}

fixBalance();
