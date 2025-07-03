import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { LayoutDashboard, PenBox, PiggyBank } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { checkUser } from '@/lib/checkUser.js'


const Header = async() => {

  await checkUser();

  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">


    <nav className="container mx-auto px-0.5 py-4 flex items-center justify-between">
        
        
        <Link href="/">
        <Image 
         src="/Logo.png"
         alt="FinSightLogo"
         height={60}       // increase height
         width={100}        // increase width
        className="h-12 w-auto object-contain"
        />
        </Link>



        <div className='flex items-center space-x-4'>

        <SignedIn>
           <Link href={"/dashboard"} className='text-gray-400 hover:text-blue-400'>
             <Button variant="outline" className={'cursor-pointer'}>
               <LayoutDashboard size={18} />
               <span className='hidden md:inline text-black'>Dashboard</span>
             </Button>
          </Link>

           <Link href={"/transaction/create"} className='text-gray-400 hover:text-blue-400'>
             <Button variant="default" className={'cursor-pointer'}>
               <PenBox size={18} />
               <span className='hidden md:inline text-white'>Add Transactions</span>
             </Button>
          </Link>
        </SignedIn>
          


          <SignedOut>
              <SignInButton forceRedirectUrl='/dashboard'>
              <Button variant="outline" className={'cursor-pointer'}>Login</Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton appearance={
                {
                  elements:{
                    avatarBox:"w-16 h-16",
                  },
                }
              }/>
            </SignedIn>
        </div>
    </nav>
      
    </div>
  )
}

export default Header