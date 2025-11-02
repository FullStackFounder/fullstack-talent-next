'use client'
import React from 'react'
import {Link as Link1} from 'react-scroll'

import Navbar from '../components/navbar/navbar'
import Faq from '../components/faq'
import GetInTouch from '../components/get-in-touch'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'
import Switcher from '../components/switcher'

export default function Page() {
  return (
    <>
       <Navbar navlight={true} tagline={false}/> 

       <section className="relative table w-full py-32 lg:py-44 bg-no-repeat bg-center bg-cover" style={{backgroundImage:`url('/images/bg/3.jpg')`}}>
            <div className="absolute inset-0 bg-black opacity-80"></div>
            <div className="container relative">
                <div className="grid grid-cols-1 text-center mt-10">
                    <h3 className="md:text-3xl text-2xl md:leading-normal leading-normal font-semibold text-white">Frequently Asked Questions</h3>
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
                <div className="grid md:grid-cols-12 grid-cols-1 gap-6">
                    <div className="lg:col-span-4 md:col-span-5">
                        <div className="rounded-md shadow dark:shadow-gray-700 p-6 sticky top-20">
                            <ul className="list-unstyled sidebar-nav mb-0 py-0" id="navmenu-nav">
                                <li className="navbar-item p-0"><Link1 activeClass="active" spy={true} smooth={true} duration={500} to="tech" className="text-base font-medium navbar-link">Buying Questions</Link1></li>
                                <li className="navbar-item mt-3 p-0"><Link1 activeClass="active" spy={true} smooth={true} duration={500} to="general" className="text-base font-medium navbar-link">General Questions</Link1></li>
                                <li className="navbar-item mt-3 p-0"><Link1 activeClass="active" spy={true} smooth={true} duration={500} to="payment" className="text-base font-medium navbar-link">Payments Questions</Link1></li>
                                <li className="navbar-item mt-3 p-0"><Link1 activeClass="active" spy={true} smooth={true} duration={500} to="support" className="text-base font-medium navbar-link">Support Questions</Link1></li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-8 md:col-span-7">
                        <div id="tech">
                            <h5 className="text-xl font-semibold mb-6">Buying Product</h5>

                            <Faq/>
                        </div>

                        <div id="general" className="mt-6">
                            <h5 className="text-xl font-semibold mb-6">General Questions</h5>

                            <Faq/>
                        </div>

                        <div id="payment" className="mt-6">
                            <h5 className="text-xl font-semibold mb-6">Payments Questions</h5>

                            <Faq/>
                        </div>

                        <div id="support" className="mt-6">
                            <h5 className="text-xl font-semibold mb-6">Support Questions</h5>

                            <Faq/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container relative lg:mt-24 mt-16">
                <GetInTouch/>
            </div>
        </section>

        <Footer/>
        
        <ScrollToTop/>
        <Switcher/>
    </>
  )
}
