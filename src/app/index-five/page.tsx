import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import Tagline from '../components/navbar/tagline'
import Navbar from '../components/navbar/navbar'
import Counter from '../components/counter'
import VideoModalTwo from '../components/video-modal-two'
import CoursesTwo from '../components/courses/courses-two'
import Client from '../components/client'
import Faq from '../components/faq'
import FaqAbout from '../components/faq-about'
import Team from '../components/team'
import Blog from '../components/blog'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'
import Switcher from '../components/switcher'

import { counterData, coursesData } from '../data'

interface CounterData{
    value: number;
    symbol: string;
    title: string;
}
interface CoursesData{
    id: number;
    image: string;
    tag1: string;
    tag2: string;
    amount: number;
    lessons: number;
    students: number;
    title: string;
    desc: string;
    user: string;
    name: string;
}

export default function Page() {
  return (
    <>
        <Tagline/>
        <Navbar tagline={true} navlight={false}/>

        <section className="relative overflow-hidden md:py-44 py-36">
            <div className="container relative md:mt-16 mt-6">
                <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 items-center gap-6">
                    <div className="lg:col-span-7">
                        <h6 className="text-yellow-500 font-semibold mb-3 uppercase">100% Satisfaction Guarantee</h6>
                        <h1 className="font-bold lg:leading-normal leading-normal tracking-wide text-4xl lg:text-5xl mb-5">Learn Product Design <br/> in <span className="bg-gradient-to-l from-fuchsia-500 to-violet-600 text-transparent bg-clip-text">16 weeks</span></h1>
                        <p className="text-slate-400 text-lg max-w-xl">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
                        
                    <VideoModalTwo/>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="relative md:shrink-0">
                                <Image src='/images/course/1.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="xl:size-56 lg:size-44 md:size-40 size-44 object-cover shadow shadow-slate-100 dark:shadow-slate-800 rounded-s-full" alt=""/>

                                <div className="overflow-hidden after:content-[''] after:absolute after:size-12 after:bg-fuchsia-500 after:top-0 after:-start-6 after:-z-1 after:rounded-full"></div>
                            </div>
                            
                            <div className="relative md:shrink-0">
                                <Image src='/images/course/2.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="xl:size-56 lg:size-44 md:size-40 size-44 object-cover shadow shadow-slate-100 dark:shadow-slate-800 rounded-full" alt=""/>
                                
                                <div className="overflow-hidden after:content-[''] after:absolute after:size-24 after:bg-violet-600/40 after:-top-10 after:-end-0 after:-z-1 after:rounded-lg after:rotate-[36deg]"></div>
                            </div>
                            
                            <div className="relative md:shrink-0">
                                <Image src='/images/course/3.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="xl:size-56 lg:size-44 md:size-40 size-44 object-cover shadow shadow-slate-100 dark:shadow-slate-800 rounded-xl" alt=""/>
                                
                                <div className="overflow-hidden after:content-[''] after:absolute after:size-40 after:bg-yellow-400 after:-bottom-10 after:-start-10 after:-z-1 after:rounded-full"></div>
                            </div>
                            
                            <div className="relative md:shrink-0">
                                <Image src='/images/course/4.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="xl:size-56 lg:size-44 md:size-40 size-44 object-cover shadow shadow-slate-100 dark:shadow-slate-800 rounded-e-full" alt=""/>
                                
                                <div className="overflow-hidden after:content-[''] after:absolute after:size-6 after:bg-violet-600/60 after:bottom-10 after:-end-12 after:-z-1 after:rounded-md"></div>
                                <div className="overflow-hidden after:content-[''] after:absolute after:size-6 after:bg-fuchsia-500/60 after:-bottom-12 after:start-10 after:-z-1 after:rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="relative py-12 bg-violet-600">
            <div className="container relative">
                <div className="grid lg:grid-cols-12 grid-cols-1 md:text-start text-center justify-center">
                    <div className="lg:col-start-2 lg:col-span-10">
                        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-2 items-center gap-6">
                            {counterData.map((item:CounterData,index:number)=>{
                                return(
                                    <div className="counter-box text-center" key={index}>
                                        <h1 className="text-white lg:text-4xl text-3xl font-semibold mb-2"><Counter className="counter-value" value={item.value}></Counter>{item.symbol}</h1>
                                        <h5 className="counter-head text-white uppercase font-medium">{item.title}</h5>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="relative md:py-24 py-16">
        <div className="container relative">
            <div className="grid grid-cols-1 pb-6 text-center">
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Explore Our Best Courses</h4>
                <p className="text-slate-400 max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 mt-6 gap-6">
                {coursesData.slice(0,8).map((item:CoursesData,index:number)=>{
                    return(
                        <CoursesTwo item={item} key={index}/>
                    )
                })}
            </div>

            <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
                <div className="md:col-span-12 text-center">
                    <Link href="/list" className="text-slate-400 hover:text-violet-600 duration-500 ease-in-out">See More Courses <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </div>
            </div>
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
            <div className="grid grid-cols-1 pb-6 text-center">
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Expert Instructors</h4>

                <p className="text-slate-400 max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
            </div>

            <Team/>
        </div>

        <div className="container relative md:mt-24 mt-16">
            <div className="grid grid-cols-1 pb-6 text-center">
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Blogs Or News</h4>

                <p className="text-slate-400 max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
            </div>

            <Blog/>
        </div>
    </section>

    <Footer/>
    <ScrollToTop/>
    <Switcher/>
    </>
  )
}
