import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import Navbar from '../components/navbar/navbar'
import FaqAbout from '../components/faq-about'
import Faq from '../components/faq'
import GetInTouch from '../components/get-in-touch'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'
import Switcher from '../components/switcher'

import { teamData } from '../data'

import { IconType } from 'react-icons'

interface TeamData{
    image: string;
    name: string;
    position: string;
    social: IconType[];
}

export default function Page() {
  return (
    <>
        <Navbar navlight={true} tagline={false}/> 

        <section className="relative table w-full py-32 lg:py-44 bg-no-repeat bg-center bg-cover" style={{backgroundImage:`url('/images/bg/3.jpg')`}}>
            <div className="absolute inset-0 bg-black opacity-80"></div>
            <div className="container relative">
                <div className="grid grid-cols-1 text-center mt-10">
                    <h3 className="md:text-3xl text-2xl md:leading-normal leading-normal font-semibold text-white">Instructors</h3>
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
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
                    {teamData.map((item:TeamData,index:number)=>{
                        return(
                            <div className="group text-center" key={index}>
                                <div className="relative inline-block mx-auto rounded-full overflow-hidden">
                                    <Image src={item.image} width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="" alt=""/>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black rounded-full opacity-0 group-hover:opacity-100 duration-500"></div>

                                    <ul className="list-none absolute start-0 end-0 -bottom-20 group-hover:bottom-5 duration-500">
                                        {item.social.map((el,index)=>{
                                            let Icon = el
                                            return(
                                                <li className="inline mx-[2px]" key={index}><Link href="" className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center bg-violet-600 text-white rounded-full"><Icon className="size-4"/></Link></li>
                                            )
                                        })}
                                    </ul>
                                </div>

                                <div className="content mt-3">
                                    <Link href="" className="text-lg font-medium hover:text-violet-600 duration-500">{item.name}</Link>
                                    <p className="text-slate-400">{item.position}</p>
                                </div>
                            </div>
                        )
                    })}
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
