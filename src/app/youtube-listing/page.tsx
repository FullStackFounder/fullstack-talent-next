import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import Navbar from '../components/navbar/navbar'
import CoursesSidebar from '../components/courses/courses-sidebar'
import Newsletter from '../components/newsletter'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'
import Switcher from '../components/switcher'

import { FiBook, FiChevronRight, FiUsers } from 'react-icons/fi'

import { youtubeList } from '../data'

interface YoutubeList{
    id: number;
    video: string;
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
        <Navbar navlight={false} tagline={false}/>

        <section className="relative py-5 bg-slate-50 dark:bg-slate-800 mt-[74px]">
            <div className="container relative">
                <div className="grid md:grid-cols-12 grid-cols-1 gap-2 items-center">
                    <div className="lg:col-span-5 md:col-span-4">
                        <h3 className="text-2xl md:leading-normal leading-normal font-semibold">Courses</h3>
                    </div>

                    <div className="lg:col-span-7 md:col-span-8 md:text-end">
                        <ul className="tracking-[0.5px] mb-0 inline-flex items-center">
                            <li className="inline-block text-slate-400 dark:text-white/60 duration-500 ease-in-out hover:text-violet-600 dark:hover:text-white"><Link href="/">Edupath</Link></li>
                            <li className="inline-block text-slate-500 dark:text-white/60 mx-0.5 ltr:rotate-0 rtl:rotate-180"><FiChevronRight className="align-middle"/></li>
                            <li className="inline-block text-slate-400 dark:text-white/60 duration-500 ease-in-out hover:text-violet-600 dark:hover:text-white"><Link href="">Courses</Link></li>
                            <li className="inline-block text-slate-500 dark:text-white/60 mx-0.5 ltr:rotate-0 rtl:rotate-180"><FiChevronRight className="align-middle"/></li>
                            <li className="inline-block text-violet-600 dark:text-white" aria-current="page">Youtube Listing Courses</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section className="relative py-12">
            <div className="container relative">
                <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-6">
                    <div className="lg:col-span-8 md:order-1 order-2">
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                            {youtubeList.map((item:YoutubeList,index:number)=>{
                                return(
                                    <div className="group bg-white dark:bg-slate-900 rounded-md shadow-md hover:shadow-lg shadow-slate-100 dark:shadow-slate-800 transition duration-500" key={index}>
                                        <div className="p-3 pb-0 relative">
                                            <iframe src={item.video} allow="autoplay; encrypted-media" className="w-full rounded-md h-44" title='video1' allowFullScreen></iframe>
                                            <div className="absolute start-6 top-6">
                                                <span className="bg-violet-600 text-white text-[12px] px-2.5 py-1 rounded-md h-4 mx-[2px]">{item.tag1}</span>
                                                <span className="bg-violet-600 text-white text-[12px] px-2.5 py-1 rounded-md h-4 mx-[2px]">{item.tag2}</span>
                                            </div>
                
                                            <div className="absolute -bottom-5 end-6">
                                                <span className="bg-violet-600 text-white size-10 flex items-center justify-center rounded-full shadow-md shadow-slate-100 dark:shadow-slate-800 font-semibold">${item.amount}</span>
                                            </div>
                                        </div>
                
                                        <div className="p-6">
                                            <div className="flex mb-3">
                                                <span className="text-slate-400 text-sm flex items-center"><FiBook className="text-slate-900 dark:text-white size-[14px] me-1"/>{item.lessons} Lessons</span>
                                                <span className="text-slate-400 text-sm flex items-center ms-3"><FiUsers className="text-slate-900 dark:text-white size-[14px] me-1"/>{item.students} Students</span>
                                            </div>
                
                                            <Link href="/course-detail" className="text-lg hover:text-violet-600 font-medium">{item.title}</Link>
                
                                            <p className="text-slate-400 mt-2">{item.desc}</p>
                
                                            <div className="flex justify-between mt-3">
                                                <span className="flex items-center"><Image src={item.user} width={32} height={32} className="size-8 rounded-full shadow shadow-slate-100 dark:shadow-slate-800 me-2" alt=""/> <Link href="" className="hover:text-violet-600 font-medium"> {item.name}</Link></span>
                                                <Link href="" className="h-8 px-3 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600/10 hover:bg-violet-600 text-violet-600 hover:text-white text-sm">Explore <i className="mdi mdi-arrow-right align-middle ms-1"></i></Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
        
                        <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
                            <div className="md:col-span-12 text-center">
                                <nav>
                                    <ul className="inline-flex items-center -space-x-px">
                                        <li>
                                            <Link href="#" className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-sm shadow-slate-100 dark:shadow-slate-800 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600">
                                                <i className="mdi mdi-chevron-left text-[20px]"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 hover:text-white bg-white dark:bg-slate-900 shadow-sm shadow-slate-100 dark:shadow-slate-800 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600">1</Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 hover:text-white bg-white dark:bg-slate-900 shadow-sm shadow-slate-100 dark:shadow-slate-800 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600">2</Link>
                                        </li>
                                        <li>
                                            <Link href="#" aria-current="page" className="z-10 size-8 inline-flex justify-center items-center mx-1 rounded-full text-white bg-violet-600 shadow-sm shadow-slate-100 dark:shadow-slate-800">3</Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 hover:text-white bg-white dark:bg-slate-900 shadow-sm shadow-slate-100 dark:shadow-slate-800 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600">4</Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="size-8 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-sm shadow-slate-100 dark:shadow-slate-800 hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600">
                                                <i className="mdi mdi-chevron-right text-[20px]"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 md:order-2 order-1">
                        <CoursesSidebar/>
                    </div>
                </div>
            </div>

            <div className="container relative md:mt-24 mt-16">
                <Newsletter/>
            </div>
        </section>

        <Footer/>
        <ScrollToTop/>
        <Switcher/>
    </>
  )
}
