'use client';

import { scanRec } from '@/app/api/scan-rec.js'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useFetch from '@/hooks/use-fetch';
import { Camera, Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const RecieptScanner = ({ onScanComplete }) => {
  const fileInputRef = useRef(null);

  const {
    isLoading: scanRecLoading,
    data: scannedData,
    handlefetchFunction: scanRecFunction,
  } = useFetch(scanRec);

  const handleRecScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    await scanRecFunction(file);
  };

  console.log(scannedData);

 const hasScannedOnce = useRef(false);

useEffect(() => {
  if (scannedData && !scanRecLoading && !hasScannedOnce.current) {
    hasScannedOnce.current = true;
    onScanComplete?.(scannedData);
    
  }
}, [scanRecLoading, scannedData, onScanComplete]);


  return (
    <div>
      <Input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleRecScan(file);
          }
        }}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 hover:opacity-90 transition-opacity text-white hover:text-white"
        disabled={scanRecLoading}
        onClick={() => fileInputRef.current?.click()}
      >
        {scanRecLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default RecieptScanner;
