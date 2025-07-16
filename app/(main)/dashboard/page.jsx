import { getUserAccounts } from '@/app/actions/dashboard';
import CreateAccountDrawer from '@/components/create-account-drawer';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import React from 'react'
import AccountCard from './_components/account-card';
import { getCurrentBudget } from '@/app/actions/budget';
import BudgetProgress from './_components/budget-progress';

const DashboardPage = async() => {
  const accounts=await getUserAccounts();
  console.log(accounts);

  //For Budget Progress
  const defaultAccount=accounts?.find((account)=>account.isDefault);
  let budgetData=null
  if(defaultAccount){
     budgetData=await getCurrentBudget(defaultAccount.id); //returns budget object and expense
  }

  return (
    <div className='px-5'>
        {/* BUDGET PROGRESS */}
        {defaultAccount && <BudgetProgress initialBudget={budgetData?.budget} currentExpenses={budgetData?.currentExpenses || 0}/>}

        {/* OVERVIEW */}

        {/* ACCOUNTS GRID */}

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'> 
          <CreateAccountDrawer>
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-dashed ">
              <CardContent className="flex flex-col justify-center items-center text-muted-foreground h-full pt-5 ">
                <Plus className='w-10 h-10 mb-2'/>
                <p className='font-medium text-sm'>Add New Account</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>
          
          {accounts.length>0 && accounts?.map((account)=>{
            return <AccountCard key={account.id} account={account}/>; //semding each account(which is an obj) of the accounts array
          })}

        </div>
    </div>
  )
}

export default DashboardPage;