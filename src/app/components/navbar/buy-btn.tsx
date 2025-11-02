'use client'
import React, { useState, useRef, useEffect } from 'react';


import { FiLock, FiLogOut, FiSearch, FiSettings, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import team1 from '../../assets/images/team/1.jpg'
import Link from 'next/link';
import Image from 'next/image';

export default function BuyBtn({navlight}:{navlight:boolean}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
  
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const dropdownRef2 = useRef<HTMLDivElement | null>(null);
    const dropdownRef3 = useRef<HTMLDivElement | null>(null);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
    const toggleDropdown2 = () => {
      setIsOpen2(!isOpen2);
    };
    const toggleDropdown3 = () => {
      setIsOpen3(!isOpen3);
    };
  
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current) {
        setIsOpen(false);
      }
    };
    const handleClickOutside2 = (event: MouseEvent) => {
      if (dropdownRef2.current) {
        setIsOpen2(false);
      }
    };
    const handleClickOutside3 = (event: MouseEvent) => {
      if (dropdownRef3.current) {
        setIsOpen3(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('mousedown', handleClickOutside2);
      document.addEventListener('mousedown', handleClickOutside3);
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('mousedown', handleClickOutside2);
        document.removeEventListener('mousedown', handleClickOutside3);
      };
    }, []);

    
  return (
    <>
        <ul className="buy-button list-none mb-0">
            <li className="inline-block relative">
                {!navlight &&
                    <button className="text-[20px] size-8 inline-flex items-center justify-center tracking-wide align-middle" type="button" onClick={toggleDropdown3}>
                        <i className="align-middle"><FiSearch/></i>
                    </button> 
                }
                {navlight && 
                    <button className="text-[20px] size-8 inline-flex items-center justify-center tracking-wide align-middle" type="button" onClick={toggleDropdown3}>
                        <FiSearch className="iconoir-search align-middle login-btn-primary"></FiSearch>
                        <FiSearch className="iconoir-search text-white align-middle login-btn-light"></FiSearch>
                    </button>    
                } 
                
            </li>

            <li className="dropdown inline-block relative mx-[4px]">
                <button onClick={toggleDropdown} className="dropdown-toggle size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-violet-600 border border-violet-600 text-white" type="button">
                    <FiShoppingCart className="size-4"/>
                </button>
                <div ref={dropdownRef} className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-60 rounded-md bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 ${isOpen ? '' : 'hidden'}`}>
                    <ul className="py-3 text-start">
                        <li className="px-3">Your shopping cart is empty.</li>
                    </ul>
                </div>
            </li>

            <li className="dropdown inline-block relative">
                <button onClick={toggleDropdown2} className="dropdown-toggle items-center" type="button">
                    <span className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-violet-600 border border-violet-600 text-white"><Image src='/images/team/1.jpg' width={30} height={30} className="rounded-full size-[30px]" alt=""/></span>
                </button>
                <div ref={dropdownRef2} className={`dropdown-menu absolute end-0 m-0 mt-4 z-10 w-44 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 ${isOpen2 ? '' : 'hidden'}`}>
                    <ul className="py-2 text-start">
                        <li>
                            <Link href="" className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-violet-600 dark:hover:text-white"><FiUser className="size-4 me-2"/>Profile</Link>
                        </li>
                        <li>
                            <Link href="" className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-violet-600 dark:hover:text-white"><FiSettings className="size-4 me-2"/>Settings</Link>
                        </li>
                        <li className="border-t border-gray-100 dark:border-gray-800 my-2"></li>
                        <li>
                            <Link href="" className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-violet-600 dark:hover:text-white"><FiLock className="size-4 me-2"/>Lockscreen</Link>
                        </li>
                        <li>
                            <Link href="" className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-violet-600 dark:hover:text-white"><FiLogOut className="size-4 me-2"/>Logout</Link>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
        <div className={`fixed w-full h-[100vh] top-0 left-0 flex justify-center ${isOpen3 ? '' : 'hidden'}`} style={{backgroundColor:"rgba(0, 0, 0, 0.5)"}}>
          <div id="" className="rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-11/12 max-w-5xl mt-20 fixed ">
              <div className="relative w-full h-auto">
                  <form method="dialog" className="modal-backdrop">
                      <button className="size-5 rounded-md flex justify-center items-center absolute top-0 end-0 btn-ghost" onClick={toggleDropdown3}><FiX className="size-4"></FiX></button>
                  </form>
                  <div className="p-6 text-center">
                      <form className="relative">
                          <i className="iconoir-search text-lg absolute top-2.5 end-0"></i>
                          <input type="text" className="w-full py-2 px-3 bg-transparent focus:outline-none rounded-md pe-6 h-10" name="s" id="searchItem" placeholder="Search..."/>
                      </form>
                  </div>
              </div>
          </div>
        </div>
                
        
    </>
  )
}
