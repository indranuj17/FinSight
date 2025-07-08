"use client";

import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const ImageRef = useRef();

  useEffect(() => {}, []);

  return (
    <div className='pb-20 px-4'>
      <div className='container mx-auto text-center'>

        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-5xl md:text-8xl lg:text-[105px] pb-6 bg-gradient-to-br from-blue-600 to-purple-700 font-extrabold tracking-tighter pr-2 text-transparent bg-clip-text'
        >
          Manage your Finances<br /> with Intelligence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className='text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'
        >
          An AI powered Financial Management Platform that helps you track, analyze, and optimize your spendings with useful and real-time Insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className='flex justify-center space-x-4 mt-6'
        >
          <Link href="/dashboard">
            <Button size="lg" className="px-8">Get Started</Button>
          </Link>
          <Link href="#">
            <Button size="lg" variant="outline" className="px-4">Watch Demo</Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className='mt-12 shadow-2xl'
          ref={ImageRef}
        >
          <Image
            src="/banner.jpg"
            alt="Banner"
            height={720}
            width={1280}
            className='rounded-lg mx-auto shadow-2xl border'
            priority
          />
        </motion.div>

      </div>
    </div>
  );
};

export default HeroSection;
