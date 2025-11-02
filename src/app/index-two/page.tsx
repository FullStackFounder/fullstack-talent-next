import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import Navbar from '../components/navbar/navbar'
import Features from '../components/features'
import AboutOne from '../components/about-one'
import Categories from '../components/categories'
import CoursesSlider from '../components/courses/courses-slider'
import Cta from '../components/cta'
import Team from '../components/team'
import Client from '../components/client'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'
import Switcher from '../components/switcher'

export default function Page() {
  return (
    <>
     <Navbar navlight={true} tagline={false}/>  

    <section className="relative md:py-24 py-16 bg-gradient-to-tr to-violet-950 via-violet-700 from-fuchsia-600">
        <div className="absolute inset-0  bg-no-repeat bg-top bg-cover opacity-20" style={{backgroundImage:`url('/images/bg/bg.png')`}}></div>
        <div className="container relative">
            <div className="grid grid-cols-1 text-center mt-12">
                <span className="text-yellow-400 font-semibold mb-3 uppercase">#OnlineLearning</span>
                <h1 className="font-bold lg:leading-normal leading-normal tracking-wide text-4xl lg:text-5xl text-white mb-5">Find The Best Online Courses <br/> For Your Bright Future</h1>
                <p className="text-white/50 text-lg max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
                
                <div className="mt-6">
                    <Link href="" className="h-12 px-6 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-yellow-500 text-white">View Courses <i className="mdi mdi-arrow-right align-middle ms-1"></i></Link>
                </div>
            </div>
        </div>

        <div className="container-fluid relative mt-10">
            <div className="grid grid-cols-5 items-center lg:gap-4 md:gap-2 gap-1 xl:mx-36 mx-3">
                <div>
                    <Image src='/images/home/1.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="rounded-md shadow shadow-white/30" alt=""/>
                </div>

                <div className="grid md:grid-cols-1 grid-cols-1 lg:gap-4 md:gap-2 gap-1">
                    <div>
                        <Image src='/images/home/2.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="rounded-md shadow shadow-white/30" alt=""/>
                    </div>

                    <div>
                        <Image src='/images/home/3.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="rounded-md shadow shadow-white/30" alt=""/>
                    </div>
                </div>

                <div>
                    <Image src='/images/home/4.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="rounded-md shadow shadow-white/30" alt=""/>
                </div>

                <div className="grid md:grid-cols-1 grid-cols-1 lg:gap-4 md:gap-2 gap-1">
                    <div>
                        <Image src='/images/home/5.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="rounded-md shadow shadow-white/30" alt=""/>
                    </div>

                    <div>
                        <Image src='/images/home/6.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="rounded-md shadow shadow-white/30" alt=""/>
                    </div>
                </div>

                <div>
                    <Image src='/images/home/7.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="rounded-md shadow shadow-white/30" alt=""/>
                </div>
            </div>
        </div>
    </section> 

    <section className="relative md:py-24 py-16">
        <div className="container relative">
            <div className="grid grid-cols-1 pb-6 text-center">
                <span className="text-violet-600 font-semibold mb-3 uppercase">Categories</span>
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Explore 1500+ Free Education Courses</h4>

                <p className="text-slate-400 max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
            </div>

           <Categories/>
        </div>

        <div className="container relative md:mt-24 mt-16">
            <AboutOne title={true}/>
        </div>

        <div className="container relative md:mt-24 mt-16">
            <div className="grid grid-cols-1 pb-6 text-center">
                <span className="text-violet-600 font-semibold mb-3 uppercase">Courses</span>
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Explore Our Best Courses</h4>

                <p className="text-slate-400 max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
            </div>

           <CoursesSlider/>

            <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
                <div className="md:col-span-12 text-center">
                    <Link href="/grid" className="text-slate-400 hover:text-violet-600 duration-500 ease-in-out">See More Courses <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </div>
            </div>
        </div>

        <div className="container relative lg:mt-24 mt-16">
            <div className="grid grid-cols-1 pb-6 text-center">
                <span className="text-violet-600 font-semibold mb-3 uppercase">Services</span>
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Discover Powerful Features</h4>

                <p className="text-slate-400 max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
            </div>

            <Features/>
        </div>
    </section>

    <Cta/>

    <section className="relative lg:py-24 py-16">
        <div className="container relative">
            <div className="grid grid-cols-1 pb-6 text-center">
                <span className="text-violet-600 font-semibold mb-3 uppercase">Teachers</span>
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Expert Instructors</h4>

                <p className="text-slate-400 max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
            </div>
            <Team/>
        </div>

        <div className="container relative lg:mt-24 mt-16">
            <div className="grid grid-cols-1 pb-8 text-center">
                <span className="text-violet-600 font-semibold mb-3 uppercase">Reviews</span>
                <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">What Our Students Say ?</h3>

                <p className="text-slate-400 max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
            </div>

            <Client/>
        </div>
    </section>

    <Footer/>
    <ScrollToTop/>

    <Switcher/>
    </>
  )
}
