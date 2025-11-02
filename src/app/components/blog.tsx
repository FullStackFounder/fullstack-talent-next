import React from 'react'
import Link from 'next/link';

import { blogData } from '../data'

import { FiCalendar, FiClock } from 'react-icons/fi'
import Image from 'next/image';

interface BlogData{
    id: number;
    image: string;
    tag: string;
    date: string;
    title: string;
}

export default function Blog() {
  return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6">  
            {blogData.slice(0,3).map((item:BlogData,index:number)=>{
                return(
                    <div className="group relative h-fit overflow-hidden bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700 transition-all duration-500" key={index}>
                        <div className="relative overflow-hidden">
                            <Image src={item.image} width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="" alt=""/>
                            <div className="absolute start-6 bottom-6">
                                <span className="bg-violet-600 text-white text-[12px] px-2.5 py-1 rounded-md h-4">{item.tag}</span>
                            </div>
                        </div>

                        <div className="relative p-6">
                            <div className="">
                                <div className="flex justify-between mb-4">
                                    <span className="text-slate-400 text-sm flex items-center"><FiCalendar className="size-4 me-1"/> {item.date}</span>
                                    <span className="text-slate-400 text-sm flex items-center"><FiClock className="size-4 me-1"/> 5 Min</span>
                                </div>

                                <Link href={`/blog-detail/${item.id}`} className="text-lg hover:text-violet-600 font-medium">{item.title}</Link>
                                
                                <div className="mt-3">
                                    <Link href={`/blog-detail/${item.id}`} className="btn btn-link hover:text-violet-600 after:bg-violet-600 duration-500 ease-in-out">Read More <i className="mdi mdi-arrow-right"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}                  
        </div>
  )
}
