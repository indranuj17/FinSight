"use client";

import { updateDefaultAccount } from '@/app/actions/account';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

const AccountCard = ({account}) => {
    const {name,id,balance,isDefault,type}=account;

    
    const{isLoading:updateDefaultLoading, data:updatedAccount, error,handlefetchFunction:updateDefaultFunction }=useFetch(updateDefaultAccount);
    
    const handleDefaultChange=async(e)=>{
        e.preventDefault();
        if(isDefault){
            toast.warning("You atleast need one default account");
            return;
        }
        await updateDefaultFunction(id);
    }

    useEffect(()=>{
      if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
    },[updatedAccount])

    
  return (

<div className='hover:shadow-xl transition-shadow group relative'>
    
    <Card className="hover:shadow-xl transition-shadow cursor-pointer border-dashed">
     <Link href={`/accounts/${id}`}>
   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium capitalize">{name}</CardTitle>
     <Switch checked={isDefault} onClick={handleDefaultChange} disabled={updateDefaultLoading}/>
  </CardHeader>
  
  <CardContent>
    <div className="text-2xl font-bold">
        ${parseFloat(balance).toFixed(2)}
    </div>
    <p className='text-xs text-muted-foreground '>
       {type.charAt(0)+type.slice(1).toLowerCase()} Account
    </p>
  </CardContent>
  <CardFooter className="flex justify-between text-sm text-muted-foreground mt-2">
    <div className='flex items-center'>
    <ArrowUpRight className="mr-1 h-4 w-4 text-green-500"/>
    Income
    </div>
    <div className='flex items-center'>
        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500"/>
         Expense
    </div>
  </CardFooter>
  </Link>
</Card>
    </div>
  )
}

export default AccountCard;