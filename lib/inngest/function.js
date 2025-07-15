import { sendEmail } from "@/app/actions/send-email";
import { db } from "../prisma";
import { inngest } from "./client";
import EmailTemplate from "@/email/template";

// ✅ Inngest Scheduled Function - runs every 6 hours
export const CheckBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async () => {
      // This query fetches all budgets from the database and includes the associated user and that user’s default account.
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    // budgets --> Array of [budgets (+ user (+ default account(s)))]
    // const budgets = [
    //   { budget1 data with user and accounts[] }, accounts filtered to default accounts
    //   { budget2 data with user and accounts[] },
    //   ...
    // ];
    // E.g---
    // [
    //   {
    //     id: "budget1",
    //     userId: "user123",
    //     amount: 10000,
    //     lastAlertSent: "2024-06-01T00:00:00Z",

    //     user: {
    //       id: "user123",
    //       name: "Indranuj",
    //       // Only default accounts are included:
    //       accounts: [
    //         {
    //           id: "account456",
    //           isDefault: true,
    //           name: "Primary Wallet",
    //         }
    //       ]
    //     }
    //   },
    //   ...
    // ]

    // loop thru each budget
    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) continue;

      // Step 3: Check this individual budget
      await step.run(`check-budget-${budget.id}`, async () => {
        const startDate = new Date();     // Get today's date
        startDate.setDate(1);             // Set date to first of current month (start of month)

        // Step 4: Calculate total expenses for this month for this user’s default account
        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,             // Filter by this user
            accountId: defaultAccount.id,      // Only consider their default account
            type: "EXPENSE",                   // Only sum expenses
            date: {
              gte: startDate,                  // Only from the start of the month
            },
          },
          _sum: {
            amount: true,                      // Sum the 'amount' field
          },
        });

        // Step 5: Compute how much of the budget is used
        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        // Step 6: Check if alert should be sent
        if (
          percentageUsed >= 80 &&   // Alert threshold: 80% usage
          (!budget.lastAlertSent || // Either no previous alert sent, or
            isNewMonth(new Date(budget.lastAlertSent), new Date())) // it's a new month since last alert
        ) {

          // TODO: You’d send an email/SMS/notification alert here
          await sendEmail({
            to: "indranujdev015@gmail.com",
            subject: `Budget-Alert for ${defaultAccount.name}`,
            react: EmailTemplate({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed: percentageUsed.toFixed(1),
                budgetAmount: parseFloat(budgetAmount.toString()).toFixed(1),
                totalExpenses: totalExpenses.toFixed(1),
                accountName: defaultAccount.name,
              },
            }),
          });

          // update `budget.lastAlertSent` to prevent repeat alerts in same month
          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });
        }
      });
    }
  }
);

// Helper function
function isNewMonth(lastAlertSent, currentDate){
  return (
    lastAlertSent.getMonth() !== currentDate.getMonth() ||
    lastAlertSent.getFullYear() !== currentDate.getFullYear()
  );
}
