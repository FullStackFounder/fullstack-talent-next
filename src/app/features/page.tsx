import React from 'react'

import Navbar from '../components/navbar/navbar'
import Features from '../components/features'
import Client from '../components/client'
import FaqAbout from '../components/faq-about'
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
                    <h3 className="md:text-3xl text-2xl md:leading-normal leading-normal font-semibold text-white">Services / Features</h3>
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
            <Features/>
        </div>

        <div className="container relative lg:mt-24 mt-16">
            <div className="grid grid-cols-1 pb-8 text-center">
                <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">What Our Students Say ?</h3>

                <p className="text-slate-400 max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
            </div>

            <Client/>
        </div>

        <div className="container relative md:mt-24 mt-16">
            <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-6">
                <FaqAbout/>

                <div className="lg:col-span-6 md:col-span-5">
                    <h4 className="mb-4 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Questions & Answers</h4>
                    <p className="text-slate-400 max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
                    <Faq/>
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
