"use client";

import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCaption, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { categoryColors } from '@/data/categories';
import {
  Tooltip, TooltipContent, TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCcw,
  Search,
  Trash,
  Trash2,
  X
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"






const TransactionTable = ({ transactions }) => {

  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);



  const router = useRouter();


//handle sorting
  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === "desc"
        ? "asc"
        : "desc",
    }));
  };


  //handle Selecting Checkboxes
  const handleSelect=(transactionId)=>{
    setSelectedIds((current)=> current.includes(transactionId) //current->the current array
    //  If the ID is already selected, remove it from the array (unselect)
    ?current.filter((item)=>item!==transactionId)
    // If the ID is not selected, add it to the  selectedIds array (select)
    :[...current,transactionId] //[...] creates a new array, combining the previous selected IDs with the new one.
  )
  }
  const handleSelectAll=()=>{
     setSelectedIds((current)=>current.length===filteredAndSortedTransactions.length
     ? []
     : filteredAndSortedTransactions.map((transactions)=>transactions.id)
    )
  }




  //Function to handle Bulk Delete
  const handleBulkDelete=()=>{

  }

  //Function to clear all filter
  const handleClearFilters=()=>{
    setRecurringFilter("");
    setTypeFilter("");
    setSearchTerm("");
  }



// FILTERED and SORTED Transactions ARRAY
const filteredAndSortedTransactions = useMemo(()=>{

  let result=[...transactions]; //create a new array with all the transactions

  //Apply Search Filter
  if(searchTerm){
    const searchTermLower=searchTerm.toLowerCase();
    result=result.filter((transaction)=>{
      return transaction.description?.toLowerCase().includes(searchTermLower);
      
    })
  }

  //Apply Recurring Filter
  if(recurringFilter){
    result=result.filter((transaction)=>
      recurringFilter=="recurring"?transaction.isRecurring:!transaction.isRecurring
    )
  }

  //Apply type Filter
  if(typeFilter){
    result=result.filter((transaction)=>
    transaction.type=typeFilter
    )
  }



result.sort((a, b) => {
    const field = sortConfig.field;

    if (field === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === "asc"
        ? dateA - dateB
        : dateB - dateA;
    }

    if (field === "amount") {
      return sortConfig.direction === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }

    if (field === "description" || field === "category") {
      return sortConfig.direction === "asc"
        ? a[field].localeCompare(b[field])
        : b[field].localeCompare(a[field]);
    }

    return 0;
  });

 return result;
},[searchTerm,typeFilter,recurringFilter,sortConfig,transactions]);








  

  const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
  };

  return (
    <div className="space-y-4">
     {/* FILTERS */}
    <div className='flex flex-col sm:flex-row gap-4'>

      <div className='relative flex-1'>
        <Search className='absolute h-4 w-4 left-2 top-2.5 text-muted-foreground'/>
        <Input placeholder="Search Transactions...." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="pl-8" />
      </div>

      <div className='flex gap-1'> 
        <Select value={typeFilter} onValueChange={(value)=>setTypeFilter(value)}> 
          {/* onValueChange-->When a new option is selected, it updates the typeFilter state with the chosen value. */}
           <SelectTrigger className="w-[140px] ">
             <SelectValue placeholder="All Types" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="INCOME">Income</SelectItem>
             <SelectItem value="EXPENSE">Expense</SelectItem>
           </SelectContent>
         </Select>

        <Select value={recurringFilter} onValueChange={(value)=>setRecurringFilter(value)}> 
          {/* onValueChange-->When a new option is selected, it updates the typeFilter state with the chosen value. */}
           <SelectTrigger className="w-[180px] ">
             <SelectValue placeholder="All Transactions" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="recurring">Recurring Only</SelectItem>
             <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
           </SelectContent>
         </Select>
         
         {selectedIds.length>0 && <div>
          <Button variant="destructive" size="sm" onClick={()=>handleBulkDelete()}><Trash2 className='w-4 h-4'/>Delete selected({selectedIds.length})</Button>
          </div>}

         {(typeFilter || searchTerm || recurringFilter) && <Button 
          variant="outline" className="border-red-500" title="Clear All Filters" onClick={()=>handleClearFilters()}><X className='w-5 h-4'/>
          </Button>}
         
      </div>

    </div>







      {/* TRANSACTIONS */}
      <div className="rounded-xl border">
        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">
                <Checkbox onCheckedChange={()=>handleSelectAll()} checked={selectedIds.length===filteredAndSortedTransactions.length && filteredAndSortedTransactions.length>0}/>
              </TableHead>

              <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                <div className="flex items-center justify-start">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ))}
                </div>
              </TableHead>

              <TableHead className="cursor-pointer" onClick={() => handleSort("description")}>
                <div className="flex items-center justify-start">Description</div>
              </TableHead>

              <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                 <div className="flex items-center justify-start">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ))}
                </div>
              </TableHead>

              <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                 <div className="flex items-center justify-start">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ))}
                </div>
              </TableHead>

              <TableHead>Recurring</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody >
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell className="text-center text-muted-foreground" colSpan={7}>
                  No Transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox onCheckedChange={()=>handleSelect(transaction.id)} checked={selectedIds.includes(transaction.id)}/> 
                      {/* //keeps the checkbox checked 
      if this transaction's ID is already in the selectedIds array. */}
                  </TableCell>

                  <TableCell>{format(transaction.date, "PP")}</TableCell>

                  <TableCell>{transaction.description}</TableCell>

                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="py-1 px-2 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>

                  <TableCell
                    style={{
                      color: transaction.type === "EXPENSE" ? "red" : "green",
                    }}
                    className="font-medium"
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}${transaction.amount.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    {transaction.isRecurring ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            className="gap-1 border-2 bg-purple-200 text-purple-700"
                            variant="outline"
                          >
                            <RefreshCcw className="w-3 h-3" />
                            {RECURRING_INTERVALS[transaction.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            New Date:
                            <div className="font-medium">
                              {format(transaction.nextRecurringDate, "PP")}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge className="gap-1 border-2" variant="outline">
                        <Clock className="w-3 h-3" />
                        One-Time
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" className="w-8 h-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel
                          className="cursor-pointer"
                          onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)}
                        >
                          Edit
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive cursor-pointer">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
