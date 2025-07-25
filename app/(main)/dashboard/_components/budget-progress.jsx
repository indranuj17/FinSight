"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { updateBudget } from "@/app/actions/budget";

const BudgetProgress = ({ initialBudget, currentExpenses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString() || "");

  const {
    handlefetchFunction: updateBudgetFunction,
    error,
    isLoading,
    data: updatedBudget,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget ? (currentExpenses / initialBudget.amount) * 100 : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await updateBudgetFunction(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card className="mb-6 bg-white/70 backdrop-blur border border-slate-200 shadow-xl rounded-xl">
      <CardHeader>
        <div className="flex-1">
          <CardTitle className="text-base font-semibold text-gray-800">
            Monthly Budget (Default Account)
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription className="text-muted-foreground">
                  {initialBudget
                    ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4 text-gray-700" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {initialBudget && (
          <div className="space-y-2">
            <Progress
              value={Math.min(percentUsed, 100)}
              indicatorClassName={`${
                percentUsed >= 90
                  ? "bg-red-500"
                  : percentUsed >= 75
                  ? "bg-orange-400"
                  : "bg-green-600"
              }`}
            />

            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>{percentUsed.toFixed(1)}% used</span>
              <span>
                {percentUsed > 100
                  ? `Over by $${(currentExpenses - initialBudget.amount).toFixed(2)}`
                  : `Remaining: $${(initialBudget.amount - currentExpenses).toFixed(2)}`}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
