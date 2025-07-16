import { getUserAccounts } from '@/app/actions/dashboard';
import { defaultCategories } from '@/data/categories';
import React, { Suspense } from 'react'
import AddTransactions from './_components/add-transactions';
import { BarLoader } from 'react-spinners';

const CreateTransactions = async() => {
  const accounts=await getUserAccounts();

  return (
    <div className='mw-3xl mx-auto px-5'>
        <h2  className='text-6xl md:text-8xl lg:text-[105px] pb-6  bg-gradient-to-br from-blue-600 to-purple-600 font-extrabold tracking-tighter pr-2  text-transparent bg-clip-text'>Add Transaction</h2>
      <Suspense  fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
    <AddTransactions accounts={accounts} categories={defaultCategories}/>
    </Suspense>
    </div>
  )
}

export default CreateTransactions;