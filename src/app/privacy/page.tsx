import React from 'react'
import Link from 'next/link'

import Navbar from '../components/navbar/navbar'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'
import Switcher from '../components/switcher'

import { termsData } from '../data'

export default function Page() {
  return (
    <>
        <Navbar navlight={true} tagline={false}/> 

        <section className="relative table w-full py-32 lg:py-44 bg-no-repeat bg-center bg-cover" style={{backgroundImage:`url('/images/bg/3.jpg')`}}>
            <div className="absolute inset-0 bg-black opacity-80"></div>
            <div className="container relative">
                <div className="grid grid-cols-1 text-center mt-10">
                    <h3 className="md:text-3xl text-2xl md:leading-normal leading-normal font-semibold text-white">Privacy Policy</h3>
                </div>
            </div>
        </section>
        <div className="relative">
            <div className="shape overflow-hidden z-1 text-white dark:text-slate-900">
                <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                </svg>
            </div>
        </div>

        <section className="relative lg:py-24 py-16">
        <div className="container relative">
            <div className="md:flex justify-center">
                <div className="md:w-3/4">
                    <div className="p-6 bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 rounded-md">
                        <h5 className="text-xl font-medium mb-4">Overview :</h5>
                        <p className="text-slate-400">It seems that only fragments of the original text remain in the Lorem Ipsum texts used today. One may speculate that over the course of time certain letters were added or deleted at various positions within the text.</p>
                        <p className="text-slate-400">In the 1960s, the text suddenly became known beyond the professional circle of typesetters and layout designers when it was used for Letraset sheets (adhesive letters on transparent film, popular until the 1980s) Versions of the text were subsequently included in DTP programmes such as PageMaker etc.</p>
                        <p className="text-slate-400">There is now an abundance of readable dummy texts. These are usually used when a text is required purely to fill a space. These alternatives to the classic Lorem Ipsum texts are often amusing and tell short, funny or nonsensical stories.</p>
                    
                        <h5 className="text-xl font-medium mb-4 mt-6">We use your information to :</h5>
                        <ul className="list-unstyled text-slate-400 mt-4">
                            {termsData.map((item:any, index:number)=>{
                                return(
                                    <li className="flex mt-2" key={index}><i className="mdi mdi-arrow-right text-violet-600 align-middle me-2"></i>{item}</li>
                                )
                            })}
                        </ul>

                        <h5 className="text-xl font-medium mb-4 mt-6">Information Provided Voluntarily :</h5>
                        <p className="text-slate-400">In the 1960s, the text suddenly became known beyond the professional circle of typesetters and layout designers when it was used for Letraset sheets (adhesive letters on transparent film, popular until the 1980s) Versions of the text were subsequently included in DTP programmes such as PageMaker etc.</p>

                        <div className="mt-6">
                            <Link href="" className="h-10 px-5 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600 text-white">Print</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <Footer/>
    
    <ScrollToTop/>
    <Switcher/>
    </>
  )
}
