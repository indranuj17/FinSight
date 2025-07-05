import React, { Suspense } from 'react'
import DashboardPage from './page'
import {BarLoader} from "react-spinners"

const Dashboardlayout = () => {
  return (
    <div className='px-6'>
       <h1  className='text-6xl md:text-8xl lg:text-[105px] pb-6  bg-gradient-to-br from-blue-600 to-purple-700 font-extrabold tracking-tighter pr-2  text-transparent bg-clip-text'>Dashboard</h1>
     <Suspense  fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
       <DashboardPage/>
       </Suspense>
    </div>
  )
}

export default Dashboardlayout;