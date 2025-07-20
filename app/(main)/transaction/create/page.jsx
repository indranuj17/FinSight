import { getUserAccounts } from '@/app/actions/dashboard';
import { defaultCategories } from '@/data/categories';
import React, { Suspense } from 'react'
import AddTransactions from './_components/add-transactions';
import { BarLoader } from 'react-spinners';
import { getTransaction } from '@/app/actions/createTransaction';

const CreateTransactions = async({searchParams}) => {
  const accounts=await getUserAccounts();
  
   const editId=searchParams?.edit;

   let initialData=null;
   if(editId){
      const transaction=await getTransaction(editId);
      initialData=transaction;
   }


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2  className='pl-2 text-4xl fonr-bol md:text-4xl lg:text-[90px] pb-6  bg-gradient-to-br from-blue-600 to-purple-600 font-extrabold tracking-tighter pr-2  text-transparent bg-clip-text'>{editId?"Edit":"Add"} Transaction</h2>
      <Suspense  fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />} >
    <AddTransactions accounts={accounts} categories={defaultCategories} editMode={!!editId} initialData={initialData}/>
    </Suspense>
    </div>
  )
}

export default CreateTransactions;