'use client'
import React from 'react'

import { FaCalendarCheck, FaHeartbeat, FaMapMarkerAlt, FaMicroscope, FaRobot, FaUserMd } from 'react-icons/fa'

import { motion } from 'framer-motion'

import { FadeUp } from '../Hero/Hero'

const AproposDeNous = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className='py-6 px-6 md:py-12 md:px-12 bg-[#7ee3e7] md:bg-bg4 bg-cover bg-center justify-items-center md:flex md:justify-between font-bold md:items-center'
    >
      {/* Div modifiée avec ml-auto pour la pousser à droite */}
      <div className='flex flex-col justify-items-center md:ml-auto md:w-1/2'>
        <div className='space-y-6'>
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className='text-3xl text-center md:text-left md:text-4xl font-bold !leading-snug'
          >
            Qui sommes-nous ?
          </motion.h1>
          <div className='flex flex-col gap-6 text-left md:text-left'>
            <motion.div
              variants={FadeUp(0.2)}
              initial='initial'
              whileInView={'animate'}
              viewport={{ once: true }}
              className='flex items-center gap-4 p-6 bg-[#f4f4f4] rounded-2xl hover:bg-white duration-300 hover:shadow-2xl'
            >
              <FaUserMd className='text-3xl md:text-3xl mr-2 hidden md:block' />
              <p className='text-[15px]'>
                MediConnect est une plateforme digitale innovante qui centralise toutes les informations sur les
                médecins et laboratoires en Tunisie.
              </p>
            </motion.div>
            <motion.div
              variants={FadeUp(0.2)}
              initial='initial'
              whileInView={'animate'}
              viewport={{ once: true }}
              className='flex items-center gap-4 p-6 bg-[#f4f4f4] rounded-2xl hover:bg-white duration-300 hover:shadow-2xl'
            >
              <FaMapMarkerAlt className='text-3xl mr-2 hidden md:block' />
              <p className='text-[15px]'>
                Elle couvre toutes les spécialités médicales et permet aux patients de rechercher des professionnels de
                santé, consulter leurs coordonnées et réserver des rendez-vous en ligne.
              </p>
            </motion.div>
            <motion.div
              variants={FadeUp(0.2)}
              initial='initial'
              whileInView={'animate'}
              viewport={{ once: true }}
              className='flex items-center gap-4 p-6 bg-[#f4f4f4] rounded-2xl hover:bg-white duration-300 hover:shadow-2xl'
            >
              <FaCalendarCheck className='text-3xl mr-2 hidden md:block' />
              <p className='text-[15px]'>
                Les utilisateurs peuvent prendre rendez-vous en ligne rapidement et efficacement.
              </p>
            </motion.div>
            <motion.div
              variants={FadeUp(0.2)}
              initial='initial'
              whileInView={'animate'}
              viewport={{ once: true }}
              className='flex items-center gap-4 p-6 bg-[#f4f4f4] rounded-2xl hover:bg-white duration-300 hover:shadow-2xl'
            >
              <FaMicroscope className='text-3xl mr-2 hidden md:block' />
              <p className='text-[15px]'>
                MediConnect intègre les laboratoires d’analyses pour une meilleure gestion des examens médicaux.
              </p>
            </motion.div>
            <motion.div
              variants={FadeUp(0.2)}
              initial='initial'
              whileInView={'animate'}
              viewport={{ once: true }}
              className='flex items-center gap-4 p-6 bg-[#f4f4f4] rounded-2xl hover:bg-white duration-300 hover:shadow-2xl'
            >
              <FaRobot className='text-3xl mr-2 hidden md:block' />
              <p className='text-[15px]'>
                Grâce à une intelligence artificielle avancée, la plateforme analyse les bilans médicaux et fournit des
                interprétations précises.
              </p>
            </motion.div>
            <motion.div
              variants={FadeUp(0.2)}
              initial='initial'
              whileInView={'animate'}
              viewport={{ once: true }}
              className='flex items-center gap-4 p-6 bg-[#f4f4f4] rounded-2xl hover:bg-white duration-300 hover:shadow-2xl'
            >
              <FaHeartbeat className='text-3xl mr-2 hidden md:block' />
              <p className='text-[15px]'>
                MediConnect facilite l’accès aux soins et offre un parcours médical plus fluide et accessible à tous.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AproposDeNous
