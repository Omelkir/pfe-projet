'use client'
import React from 'react'

import type { CSSProperties } from 'react'

import classnames from 'classnames'

import { FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { TbWorldWww } from 'react-icons/tb'
import { motion } from 'framer-motion'

// Third-party Imports
import styled from '@emotion/styled'

import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

import themeConfig from '@configs/themeConfig'
import MaterioLogo from '@core/svg/Logo'

const Footer = ({ color }: { color?: CSSProperties['color'] }) => {
  type LogoTextProps = {
    color?: CSSProperties['color']
  }

  const LogoText = styled.span<LogoTextProps>`
    color: ${({ color }) => color ?? 'white'};
    font-size: 1.25rem;
    line-height: 1.2;
    font-weight: 600;
    letter-spacing: 0.15px;
    // text-transform: uppercase;
    margin-inline-start: 10px;
  `

  return (
    <footer className='pt-6 bg-[#5e829f]'>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className='justify-items-center pb-6'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left'>
          {/* first section */}
          <div className='max-w-[400px] mx-auto'>
            <div className='flex items-center min-bs-[24px]'>
              <MaterioLogo className='text-[22px] text-primary' />
              <LogoText color={color}>{themeConfig.templateName}</LogoText>
            </div>
            <p className='text-dark2 text-white text-sm mt-6'>
              Une plateforme digitale centralisant les infos sur les médecins et laboratoires en Tunisie, avec avis,
              réservation en ligne et analyses médicales basées sur l’IA.
            </p>
          </div>

          {/* second section */}
          <div className='max-w-[400px] mx-auto'>
            <h1 className='text-xl md:text-2xl text-white'>Contact</h1>
            <div className='text-dark2'>
              <ul className='text-sm list-none'>
                <li className='cursor-pointer hover:text-secondary duration-200 text-white'>
                  Email: mediconnect048@gmail.com
                </li>
                <li className='cursor-pointer hover:text-secondary duration-200 text-white'>Tél: +216 99 559 992</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className='justify-items-center bg-[#2c4964]'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 text-center'>
          <div
            className={classnames(
              verticalLayoutClasses.footerContent,
              'flex items-center justify-between flex-wrap gap-3 text-white text-sm'
            )}
          >
            <p>
              <span>{`© ${new Date().getFullYear()}, Made with `}</span>
              <span>{`❤️`}</span>
              <span>{`, MediConnect `}</span>
            </p>
          </div>
          <div className='flex justify-center md:justify-start space-x-6 py-3'>
            <a href=''>
              <FaWhatsapp className='text-white cursor-pointer hover:text-primary hover:scale-105 duration-200 text-xl' />
            </a>
            <a href=''>
              <FaInstagram className='text-white cursor-pointer hover:text-primary hover:scale-105 duration-200 text-xl' />
            </a>
            <a href=''>
              <TbWorldWww className='text-white cursor-pointer hover:text-primary hover:scale-105 duration-200 text-xl' />
            </a>
            <a href=''>
              <FaYoutube className='text-white cursor-pointer hover:text-primary hover:scale-105 duration-200 text-xl' />
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer
