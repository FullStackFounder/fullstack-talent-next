import React from 'react'
import Link from 'next/link'

import Navbar from '../components/navbar/navbar'
import FaqAbout from '../components/faq-about'
import Faq from '../components/faq'
import GetInTouch from '../components/get-in-touch'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'
import Switcher from '../components/switcher'

import { MdOutlineCheckCircleOutline } from 'react-icons/md'

export default function Page() {
  return (
    <>
        <Navbar  navlight={true} tagline={false}/>  

        <section className="relative table w-full py-32 lg:py-44 bg-no-repeat bg-center bg-cover" style={{backgroundImage:`url('/images/bg/3.jpg')`}}>
            <div className="absolute inset-0 bg-black opacity-80"></div>
            <div className="container relative">
                <div className="grid grid-cols-1 text-center mt-10">
                    <h3 className="md:text-3xl text-2xl md:leading-normal leading-normal font-semibold text-white">Pricing Plans</h3>
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
                <div className="lg:flex justify-center">
                    <div className="lg:w-4/5">
                        <div className="group md:flex items-center justify-between p-6 rounded-lg shadow hover:shadow-md shadow-slate-100 dark:shadow-slate-800 transition-all duration-500">
                            <div className="md:w-36">
                                <h3 className="text-xl text-violet-600 font-semibold">Weekly</h3>
                        
                                <div className="flex mt-3">
                                    <span className="text-lg">$</span>
                                    <span className="text-2xl font-semibold">9</span>
                                    <span className="text-lg self-end">/ Week</span>
                                </div>
                            </div>

                            <ul className="list-none">
                                <li className="text-slate-400 mt-2"><span className="text-violet-600 text-lg me-2"><MdOutlineCheckCircleOutline className="align-middle inline-block"/></span>Full Access</li>
                                <li className="text-slate-400 mt-2"><span className="text-violet-600 text-lg me-2"><MdOutlineCheckCircleOutline className="align-middle inline-block"/></span>Source Files</li>
                            </ul>

                            <ul className="list-none">
                                <li className="text-slate-400 mt-2"><span className="text-violet-600 text-lg me-2"><MdOutlineCheckCircleOutline className="align-middle inline-block"/></span>Free Appointments</li>
                                <li className="text-slate-400 mt-2"><span className="text-violet-600 text-lg me-2"><MdOutlineCheckCircleOutline className="align-middle inline-block"/></span>Enhanced Security</li>
                            </ul>

                            <div className="md:w-36 md:text-end">
                                <Link href="" className="h-8 px-3 tracking-wide inline-flex items-center justify-center font-medium rounded-md border border-violet-600/20 hover:bg-violet-600 text-violet-600 hover:text-white text-sm md:mt-0 mt-4">Login Now</Link>
                            </div>
                        </div>

                        <div className="group md:flex items-center justify-between p-6 rounded-lg shadow hover:shadow-md shadow-slate-100 dark:shadow-slate-800 transition-all duration-500 mt-6">
                            <div className="md:w-36">
                                <h3 className="text-xl text-violet-600 font-semibold">Monthly</h3>
                        
                                <div className="flex mt-3">
                                    <span className="text-lg">$</span>
                                    <span className="text-2xl font-semibold">29</span>
                                    <span className="text-lg self-end">/ Month</span>
                                </div>
                            </div>

                            <ul className="list-none">
                                <li className="text-slate-400 mt-2"><span className="text-violet-600 text-lg me-2"><MdOutlineCheckCircleOutline className="align-middle inline-block"/></span>Full Access</li>
                                <li className="text-slate-400 mt-2"><span className="text-violet-600 text-lg me-2"><MdOutlineCheckCircleOutline className="align-middle inline-block"/></span>Source Files</li>
                            </ul>

                            <ul className="list-none">
                                <li className="text-slate-400 mt-2"><span className="text-violet-600 text-lg me-2"><MdOutlineCheckCircleOutline className="align-middle inline-block"/></span>Free Appointments</li>
                                <li className="text-slate-400 mt-2"><span className="text-violet-600 text-lg me-2"><MdOutlineCheckCircleOutline className="align-middle inline-block"/></span>Enhanced Security</li>
                            </ul>

                            <div className="md:w-36 md:text-end">
                                <Link href="" className="h-8 px-3 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600/10 hover:bg-violet-600 text-violet-600 hover:text-white text-sm md:mt-0 mt-4">Join Now</Link>
                            </div>
                        </div>

                        <div className="group md:flex items-center justify-between p-6 rounded-lg shadow hover:shadow-md shadow-slate-100 dark:shadow-slate-800 transition-all duration-500 mt-6">
                            <div className="md:w-36">
                                <h3 className="text-xl text-violet-600 font-semibold">Yearly</h3>
                        
                                <div className="flex mt-3">
                                    <span className="text-lg">$</span>
                                    <span className="text-2xl font-semibold">299</span>
                                    <span className="text-lg self-end">/ Year</span>
                                </div>
                            </div>

                            <ul className="list-none">
                                <li className="text-slate-400 mt-2"><span className="text-violet-600 text-lg me-2"><MdOutlineCheckCircleOutline className="align-middle inline-block"/></span>Full Access</li>
                                <li className="text-slate-400 mt-2"><span className="text-violet-600 text-lg me-2"><MdOutlineCheckCircleOutline className="align-middle inline-block"/></span>Source Files</li>
                            </ul>

                            <ul className="list-none">
                                <li className="text-slate-400 mt-2"><span className="text-violet-600 text-lg me-2"><MdOutlineCheckCircleOutline className="align-middle inline-block"/></span>Free Appointments</li>
                                <li className="text-slate-400 mt-2"><span className="text-violet-600 text-lg me-2"><MdOutlineCheckCircleOutline className="align-middle inline-block"/></span>Enhanced Security</li>
                            </ul>

                            <div className="md:w-36 md:text-end">
                                <Link href="" className="h-8 px-3 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600 text-white text-sm md:mt-0 mt-4">Subscribe Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
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
