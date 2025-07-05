const { useState } = require("react");
const { toast } = require("sonner");

const useFetch=(callBack)=>{
   const[data,setData]=useState(undefined);
   const[isLoading,setIsLoading]=useState(false);
   const[error,setError]=useState(null);

   const handlefetchFunction=async(...args)=>{
         setIsLoading(true);
         setError(null);
        try {
           
            const response=await callBack(...args);
            setData(response);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        }finally{
            setIsLoading(false);
        }
   };

   return {data,handlefetchFunction,isLoading,error,setData};
}

export default useFetch;