import { getAccountWithTransactions } from '@/app/actions/account'
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners';
import TransactionTable from '../_components/transactionTable';

const AccountsPage = async ({params}) => {

  const accountData=await getAccountWithTransactions(params.id);

  console.log(accountData);
 //If you want transactions as a separate variable and the rest of the fields in account, do:
  const {transactions,...account}=accountData;

  if(!accountData){
    return notFound();
  }
  return (
  <div className="space-y-8 px-5"> 
    <div className="flex gap-4 items-end justify-between"> 
      <div>
         <h1 className='text-5xl sm:text-6xl lg:text-[105px] pb-2  bg-gradient-to-br from-blue-600 to-purple-700 font-bold tracking-tighter pr-2  text-transparent bg-clip-text'>{account.name}</h1>
         <p className="text-muted-foreground">{account.type.charAt(0)+account.type.slice(1).toLowerCase()} Account</p>
      </div>

      <div className="text-right pb-2">
        <div className="text-xl sm:text-3xl font-bold">${parseFloat(account.balance).toFixed(2)}</div>
        <p className="text-sm text-muted-foreground">{account._count.transactions} Transactions</p>
      </div>
    </div>
 

   {/* Transactions Table */}
      <Suspense fallback={<BarLoader className="mt-4 w-full " />}>
        <TransactionTable transactions={transactions} />
      </Suspense>

      {/* Chart Section - Add your chart here if needed */}
    </div>
  );
};

export default AccountsPage;