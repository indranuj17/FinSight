"use client"


import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'

const TransactionTable = ({transactions}) => {
  const filteredAndSortedTransactions=transactions;

  const handleSort=()=>{

  }
  return (
    <div className='space-y-4'>
   <div className='rounded-xl border'>
    <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[150px]"><Checkbox/></TableHead>
      <TableHead className="cursor-pointer" onClick={()=>handleSort("Date")}><div className='flex items-center justify-end'>Date</div></TableHead>
       <TableHead className="cursor-pointer" onClick={()=>handleSort("description")}><div className='flex items-center justify-end'>Description</div></TableHead>
      <TableHead className="cursor-pointer" onClick={()=>handleSort("category")}><div className='flex items-center justify-end'>Category</div></TableHead>
       <TableHead>Recurring</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {(filteredAndSortedTransactions.length===0)?
    (<TableRow>
      <TableCell className="text-center text-muted-foreground" colSpan={7}>No Transactions found</TableCell>
    </TableRow>
    ):(
     
      filteredAndSortedTransactions.map((transaction)=>{
        // for each row
        <TableRow key={transaction.id}>
          <TableCell><Checkbox/></TableCell>
          <TableCell>{format(transaction.date,"PP")}</TableCell>
          <TableCell>{transaction.amount}</TableCell>
        </TableRow>
      })
    )}
    
  </TableBody>
</Table>
</div>
</div>
  )
}

export default TransactionTable