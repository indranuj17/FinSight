"use client";

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Pencil, X } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { updateBudget } from '@/app/actions/budget';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const BudgetProgress = ({initialBudget, currentExpenses}) => {
   
    const [isEditing,setIsEditing]=useState(false);
    const [newBudget,setNewBudget]=useState(
        initialBudget?.amount.toString() || ""
    )


    const percentUsed=initialBudget?(currentExpenses/initialBudget?.amount)*100:0;

    
    const handleCancel=()=>{
        setIsEditing(false);
        setNewBudget(initialBudget?.amount?.toString() || "")
    }

    //handle update
    const {handlefetchFunction:updateBudgetFunction, error, isLoading:updateBudgetLoading,data:updatedBudget }=useFetch(updateBudget);
    const handleBudgetUpdate=async()=>{
      const amount=parseFloat(newBudget);

      if(amount<0 || isNaN(amount)){
        toast.error("Please Enter a valid amount");
      }

      await updateBudgetFunction(amount);

      if(updatedBudget?.success){
        setIsEditing(false);
        toast.success("Budget updated Successfully");
      }
      else{
        toast.error("Could not update Budget");
      }
    }


    useEffect(()=>{
        if(error){
            toast.error("Could not update Budget");
        }
    },[error])

  return (
        
      <Card className="mb-6 hover:shadow-xl transform-shadow">
          
          <CardHeader>
           <div className="flex-1">
            <CardTitle>Monthly Budget (Default Account)</CardTitle>
            <div className="flex items-center gap-2 mt-1">
             {isEditing
             ?<div  className="flex items-center gap-2">
                <Input
                type="number"
                placeholder="Enter Amount"
                value={newBudget}
                onChange={(e)=>setNewBudget(e.target.value)}
                className="w-40"
                autoFocus
                />
                <Button variant="outline" size="icon" onClick={()=>handleBudgetUpdate()}><Check className='h-4 w-4 text-green-500'/></Button>
                <Button variant="outline" size="icon" onClick={()=>handleCancel()}><X className='h-4 w-4 text-red-500'/></Button>
             </div>
            
             :(<>
             <CardDescription>
                {initialBudget? `$${currentExpenses.toFixed(2)} spent from $${initialBudget.amount.toFixed(2)}`:`No Budget Set`}
             </CardDescription>

             <Button variant="ghost" className="h-6 w-6" onClick={()=>setIsEditing(true)}><Pencil className='w-4 h-4'/></Button>
             </>
             )
             }
             </div>
            </div>   
          </CardHeader>
            <CardContent>
        {initialBudget && (
          <div className="space-y-2">
         <Progress
  value={percentUsed}
  indicatorClassName={`${
    percentUsed >= 90
      ? "bg-red-500"
      : percentUsed >= 75
        ? "bg-orange-400"
        : "bg-green-600"
  }`}
/>

            <p className="text-xs text-muted-foreground text-right">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
         
        </Card>
        
  )
}

export default BudgetProgress