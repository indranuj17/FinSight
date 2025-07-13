"use client";

import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import React, { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

const AccountChart = ({transactions}) => {

const [dateRange,setDateRange]=useState("1M");



const filteredData = useMemo(() => {
  // Get the selected date range object (like { days: 7 } or { days: 30 })
  const range = DATE_RANGES[dateRange];
  // Get the current date and time
  const now = new Date();
  // Calculate the start date of the range:
  // If a number of days is specified, subtract that many days from today and get the start of that day
  // Otherwise, use the Unix epoch start (Jan 1, 1970)
  const startDate = range.days
    ? startOfDay(subDays(now, range.days))  // e.g., 7 days ago, starting from 00:00
    : startOfDay(new Date(0));              // fallback to earliest possible date

  // Step 1: Filter transactions that fall between startDate and now (inclusive) //AN ARRAY OF OBJECTS(TRANSACTIONS)
  const filteredTransactions = transactions.filter(
    (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
  );


  //"Go through each transaction in the filteredTransaction array and accumulate/group them into a single result object — in this case, by date."
   const grouped=filteredTransactions.reduce((acc,transaction)=>{//transaction  is iterator
    const date=format(new Date(transaction.date),"MMM dd");
    
    // Initialize the group entry if it doesn't exist
    if(!acc[date]){
        acc[date]={date,income:0,expense:0};
    }
    else{
        if(transaction.type=="INCOME"){
            acc[date].income+=transaction.amount;
        }
        else{
            acc[date].expense+=transaction.amount;
        }
    }

    return acc;// Return accumulator for the next iteration
   },{});


   // Convert to array and sort by date
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

}, [transactions,dateRange]);


//filteredData-->

// [
//   { date: "Jul 10", income: 500, expense: 200 },
//   { date: "Jul 11", income: 300, expense: 100 },
//   { date: "Jul 12", income: 0, expense: 150 },
//    ......
// ]

console.log(filteredData);


const totals = useMemo(() => {
  // Use reduce to calculate total income and total expense from the filteredData array
  return filteredData.reduce(
    (acc, day) => ({
      // Add each day's income to the accumulated total income
      income: acc.income + day.income,
      // Add each day's expense to the accumulated total expense
      expense: acc.expense + day.expense,
    }),
    // Initial value of the accumulator: 0 income and 0 expense
    { income: 0, expense: 0 }
  );
}, [filteredData]); // Only recompute when filteredData changes


  return (
    

       <Card>
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
           <CardTitle className="text-base font-normal">Transaction Overview</CardTitle>
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
         <SelectTrigger className="w-[140px]">
           <SelectValue placeholder="Select Date Range" />
         </SelectTrigger>
         <SelectContent>
            {/* Loop over each entry in the DATE_RANGES object
 Object.entries(DATE_RANGES) gives an array of [key, value] pairs, like:
 [
   ["7D", { label: "Last 7 Days", days: 7 }],   ["1M", { label: "Last Month", days: 30 }],
   ...
] */}
       {Object.entries(DATE_RANGES).map(([key, { label }]) => (
  
         // For each key (e.g., "7D", "1M", etc.), render a <SelectItem>
         <SelectItem key={key} value={key}>
           {/* Display the label (e.g., "Last 7 Days", "Last Month") */}
           {label}
         </SelectItem>
))}
         </SelectContent>
       </Select>
 
         </CardHeader>


         <CardContent>
           
           <div className="flex justify-around mb-6 text-sm">

             <div className='text-center'>
                <p className=' text-muted-foreground'>Total Income</p>
                <p className='text-green-500 font-bold text-lg'>${totals.income.toFixed(2)}</p>
             </div>
             <div className='text-center'>
                <p className=' text-muted-foreground'>Total Expense</p>
                <p className='text-red-500 font-bold text-lg'>${totals.expense.toFixed(2)}</p>
             </div>
             <div className='text-center'>
                <p className=' text-muted-foreground'>Net</p>
                <p className={`text-lg font-bold ${totals.income>=totals.expense?"text-green-500":"text-red-500"}`}>${(totals.income-totals.expense).toFixed(2)}</p>
             </div>

           </div>

            <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, undefined]}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "2px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
           

        
  )
}

export default AccountChart