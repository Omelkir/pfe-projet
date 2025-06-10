'use client'
import React from 'react'

import { motion } from 'framer-motion'

import Chatbot from '../analyza/chatbot'

export const FadeUp = (delay: any) => {
  return {
    initial: {
      opacity: 0,
      y: 50
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        duration: 0.5,
        delay: delay,
        ease: 'easeInOut'
      }
    }
  }
}

const Hero = () => {
  return (
    <motion.div
      variants={FadeUp(0.8)}
      initial='initial'
      animate='animate'
      className='bg2 relative flex items-center justify-center text-center px-4 pb-12'
    >
      <div className='container grid grid-cols-1 md:grid-cols-2 min-h-[650px]'>
        <div className='flex flex-col justify-center py-14 md:py-0 relative '>
          <div className='text-center md:text-left mt-20 md:mt-0 space-y-2 lg:max-w-[400px]'>
            <motion.h1
              variants={FadeUp(0.6)}
              initial='initial'
              animate='animate'
              className='text-2xl md:text-3xl lg:text-5xl font-bold !leading-snug'
            >
              Réservez votre <span className='text-second'>Consultation</span> en toute simplicité !
            </motion.h1>
            <motion.h1
              variants={FadeUp(0.6)}
              initial='initial'
              animate='animate'
              className='text-sm md:text-xl lg:text-xl !leading-snug'
            >
              Analyse intelligente des bilans médicaux - Laissez l’IA vous aider !
            </motion.h1>

            <motion.div
              variants={FadeUp(0.8)}
              initial='initial'
              animate='animate'
              className='flex justify-center md:justify-start pb-12'
            >
              {/* <button
                className='primary-btn flex items-center gap-2 group mt-6 text-sm md:text-xl'
                onClick={() => {
                  router.push('/front_page/analyza')
                }}
              >
                <FaRobot className='mr-2 text-xl md:text-2xl' />
                Commencer
                <IoIosArrowRoundForward className='text-3xl group-hover:translate-x-3 group-hover:-rotate-45 duration-300' />
              </button> */}
            </motion.div>
          </div>
        </div>
        <Chatbot />
      </div>
    </motion.div>
  )
}

export default Hero
