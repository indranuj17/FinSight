"use client";


import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import Link from 'next/link';

const HeroSection = () => {

  const ImageRef=useRef();

  useEffect(()=>{},[])
  return (
    <div className='pb-20 px-4'>
      <div className='container mx-auto text-center'>
        <h1 className='text-5xl md:text-8xl lg:text-[105px] pb-6  bg-gradient-to-br from-blue-600 to-purple-700 font-extrabold tracking-tighter pr-2  text-transparent bg-clip-text'>Manage your Finances<br/> with Intelligence</h1> 
        <p>An AI powered Financial Management Platform that helps you track,analyze and optimize your spendings with useful and real-time Insights</p>
        
        <div className='flex justify-center space-x-4 mt-4'>
          <Link href="/dashboard">
          <Button size="lg" className="px-8">Get Started</Button>
          </Link>
          <Link href="#">
          <Button size="lg" variant="outline" className="px-4">Watch Demo</Button>
          </Link>
        </div>

        <div className='mt-12 shadow-2xl'>
        <div ref={ImageRef}>
          <Image src="/banner.jpg" alt="Banner" height={720} width={1280} className='rounded-lg mx-auto shadow-2xl border' priority/>
        </div>
        </div>

        </div>    
    </div>
  )
}

export default HeroSection;