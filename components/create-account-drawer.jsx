"use client";

import React, { use, useEffect, useState } from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema } from '@/app/lib/schema';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import useFetch from '@/hooks/use-fetch';
import { createAccount } from '@/app/actions/dashboard';
import { Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';





const CreateAccountDrawer = ({children}) => {
    const [open,setOpen]=useState(false);

    const{setValue,watch, handleSubmit,register,formState:{errors},reset}=useForm({
        resolver:zodResolver(accountSchema),
        defaultValues:{
            name:"",
            type:"CURRENT",
            balance:"",
            isDefault:false,
        }
    })

    const {data:newAccount,isLoading:createAccountLoading,error,handlefetchFunction:createAccountFetch}=useFetch(createAccount);


    const onSubmit=async(data)=>{
    console.log(data);
    await createAccountFetch(data);
    }

    useEffect(()=>{
      if(newAccount && !createAccountLoading){
        toast.success("Success",{description:"Account Created Successfully"});
        reset();
        setOpen(false);
      }
    },[createAccountLoading, newAccount]);

    useEffect(()=>{
      if(error){
        toast.error("Error",{description:error.message});
      }
    },[error]);


  return (
    <div>
  <Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild>{children}</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle> Create New Account</DrawerTitle>
    </DrawerHeader>
      <div className='pb-4 px-4'>
        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>

            <div className='space-y-2'>
                <label htmlFor="name" className='text-sm font-medium mb-1'>Account Name</label>
                <Input id="name" placeholder="e.g. Main Checking" {...register("name")}/> 
                {errors.name && (<p className='text-sm text-red-600'>{errors.name.message}</p>)}
            </div>


            <div className='space-y-2'>
                <label htmlFor="type" className='text-sm font-medium mb-1'>Account Type</label>
                <Select onValueChange={(value)=>(setValue('type',value))} defaultValue={watch("type")}>
                  <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select Type" />
                   </SelectTrigger>
                   <SelectContent>
                   <SelectItem value="CURRENT">Current</SelectItem>
                   <SelectItem value="SAVINGS">Savings</SelectItem>
                    </SelectContent>
                </Select>
                {errors.type && (<p className='text-sm text-red-600'>{errors.type.message}</p>)}
            </div>
            
           
            <div className='space-y-2'>
                <label htmlFor="name" className='text-sm font-medium mb-1'>Initial Balance</label>
                <Input id="balance" type="number" placeholder="0.00"  step="0.01" {...register("balance")}/> 
                {errors.balance && (<p className='text-sm text-red-600'>{errors.balance.message}</p>)}
            </div>


             <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label
                  htmlFor="isDefault"
                  className="text-base font-medium cursor-pointer"
                >
                  Set as Default
                </label>
                <p className="text-sm text-muted-foreground">
                  This account will be selected by default for transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>



            <div>
             <DrawerClose asChild>
              <Button type="button" variant="outline" className="flex-1" disabled={createAccountLoading}>Cancel</Button>
            </DrawerClose>
            <Button type="submit"  className="flex-1">
              {(createAccountLoading)?
              <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin'/>Creating Account....
              </>
              :("Create Account")
              }
              </Button> 
            </div>
           
        </form>
      </div>
  </DrawerContent>
</Drawer>
    </div>
  )
}

export default CreateAccountDrawer;




// User submits the form → handleSubmit(onSubmit) is triggered.

// Form data is validated using Zod schema via react-hook-form.

// If valid, onSubmit calls createAccountFetch(data) from your custom hook.

// useFetch handles loading, error, and calls the createAccount server action.

// createAccount checks auth, converts balance, handles default account logic, saves to DB.

// On success, useFetch updates state with response data.

// useEffect sees new account data → shows toast, resets form, closes drawer.

// If error, another useEffect shows an error toast.








