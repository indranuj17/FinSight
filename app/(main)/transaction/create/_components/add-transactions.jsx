"use client"

import { CreateTransactions, updateTransaction } from '@/app/actions/createTransaction'
import { transactionSchema } from '@/app/lib/schema'
import useFetch from '@/hooks/use-fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from 'date-fns'
import { Calendar1Icon, Loader2 } from 'lucide-react'

import { Calendar } from '@/components/ui/calendar'
import { Switch } from '@/components/ui/switch'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import RecieptScanner from './reciept-scanner'


const AddTransactions=({accounts,categories,editMode=false, initialData=null})=>{



    const searchParams=useSearchParams();
    const editId=searchParams.get("edit");

    const {setValue,watch,formState:{errors},register,handleSubmit,getValues,reset}=useForm({
        resolver:zodResolver(transactionSchema),
         defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

    const {isLoading:transactionLoading, 
      handlefetchFunction:transactionFunction,
      data:transactionResult
    }=useFetch(editMode?updateTransaction:CreateTransactions);
  
    const type = watch("type"); // ✅ watch form value
    const date=watch("date"); //Using watch("date") lets you dynamically read the selected date from your form state
    const isRecurring=watch("isRecurring");

    const filteredCategories=categories.filter((cat)=>cat.type===type);

    const router=useRouter();
    

    const onSubmit=async(data)=>{
      try {
         const formData={
          ...data,
          amount:parseFloat(data.amount),
         };

         if(editMode){
          await transactionFunction(editId,formData);
         }
        else{
         await transactionFunction(formData);
        }
      
      } catch (error) {
        console.log(Error);
        toast.error("Something went wrong while creating transaction")
      };
    }
   useEffect(() => {
  if (!transactionLoading && transactionResult) {
    if (transactionResult.success) {
      toast.success(editMode?"Transaction updated successfully":"Transaction created successfully");
      reset();
      router.push(`/accounts/${transactionResult.data.accountId}`);
    } else {
      toast.error(transactionResult.error || "Something went wrong");
    }
  }
}, [transactionLoading, transactionResult,editMode]);


const handleScanComplete=async(scannedData)=>{
 
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
      toast.success("Receipt scanned successfully");
    }
  };



    return (
        
    <form className="space-y-4 max-w-4xl w-full mx-auto px-2 sm:px-4" onSubmit={handleSubmit(onSubmit)}>
        {/* AI RECIEPT SCANNER */}

        <RecieptScanner onScanComplete={handleScanComplete}/>

       

       {/* Main Form elements */}


       {/* Type */}
       <div className='space-y-6'>
        <label className='text-sm font-medium'>Type</label>
         <Select onValueChange={(value)=>setValue("type",value)} defaultValue={type}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              
            </SelectContent>
          </Select>
         {errors.type && (<p className='text-sm text-red-500'>{errors.type.message}</p>)}
       </div>

       {/* Amount and Account */}
      <div className='grid gap-6 md:grid-cols-2'>
        
       <div className='space-y-2'>
        <label className='text-sm font-medium'>Amount</label>
         <Input
         type="number"
         placeholder="0.00"
         step="0.01"
        {...register("amount")}
         />
         {errors.amount && (<p className='text-sm text-red-500'>{errors.amount.message}</p>)}
       </div>

       <div className='space-y-2'>
        <label className='text-sm font-medium'>Account</label>
         <Select onValueChange={(value)=>setValue("accountId",value)} defaultValue={getValues("accountId")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account)=>
                <SelectItem key={account.id} value={account.id}>{account.name}(${parseFloat(account.balance).toFixed(2)})</SelectItem>          
            )}

            <CreateAccountDrawer>
                <Button className="select-none items-center w-full" variant="ghost" >Create Account</Button>
            </CreateAccountDrawer>
            </SelectContent>
          </Select>
         {errors.accountId && (<p className='text-sm text-red-500'>{errors.accountId.message}</p>)}
       </div>

       </div>
        
        {/* Category */}
         <div className='space-y-2'>
        <label className='text-sm font-medium'>Category</label>
         <Select onValueChange={(value)=>setValue("category",value)} defaultValue={getValues("category")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((cat)=>
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>          
            )}
            </SelectContent>
          </Select>
         {errors.category && (<p className='text-sm text-red-500'>{errors.category.message}</p>)}
       </div>


          <div className='space-y-2'>
        <label className='text-sm font-medium'>Date</label>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full pl-3 text-left font-normal">
              {date?format(date, "PPP"):<span>Pick a date</span>}
              <Calendar1Icon className='w-5 h-5 ml-auto opacity-70'/>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
             mode="single"
             selected={date}
             onSelect={(date)=>setValue("date",date)}
             disabled={(date)=>date>new Date() || date<new Date("1900-01-01")}
             initialFocus
            ></Calendar>
          </PopoverContent>
        </Popover>
         
         {errors.date && (<p className='text-sm text-red-500'>{errors.date.message}</p>)}
       </div>


      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
        </div>

      {/* isRecurring Toggle */}
         <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label
                  
                  className="text-base font-medium cursor-pointer"
                >
                 Recurring Transaction
                </label>
                <p className="text-sm text-muted-foreground">
                  Set up recurring schedule for this transaction 
                </p>
              </div>
              <Switch
                id="isRecurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setValue("isRecurring", checked)}
              />
            </div>

            {/* Recurring Interval */}
            {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Recurring Interval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-sm text-red-500">
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

       {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-1/2"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" className="w-1/2" disabled={transactionLoading}>
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  );
}

export default AddTransactions;