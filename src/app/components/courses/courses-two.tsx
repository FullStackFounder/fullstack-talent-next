import React from 'react'
import { FiBook, FiUsers } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

export default function CoursesTwo({item}:{item:any}) {
  return (
        <div className="group bg-white dark:bg-slate-900 rounded-md shadow-md hover:shadow-lg shadow-slate-100 dark:shadow-slate-800 transition duration-500 w-full mx-auto">
            <div className="md:flex">
                <div className="p-3 md:pe-0 md:pb-3 pb-0 relative md:shrink-0">
                    <Image src={item.image} width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="rounded-md size-full object-cover md:w-48" alt=""/>
                    <div className="absolute start-6 top-6">
                        <span className="bg-violet-600 text-white text-[12px] px-2.5 py-1 rounded-md h-4 mx-[2px]">{item.tag1}</span>
                        <span className="bg-violet-600 text-white text-[12px] px-2.5 py-1 rounded-md h-4 mx-[2px]">{item.tag2}</span>
                    </div>

                    <div className="absolute md:bottom-5 -bottom-5 md:-end-5 end-6">
                        <span className="bg-violet-600 text-white size-10 flex items-center justify-center rounded-full shadow-md shadow-slate-100 dark:shadow-slate-800 font-semibold">${item.amount}</span>
                    </div>
                </div>

                <div className="p-6 w-full">
                    <div className="flex mb-3">
                        <span className="text-slate-400 text-sm flex items-center"><FiBook className="text-slate-900 dark:text-white size-[14px] me-1"/>{item.lessons} Lessons</span>
                        <span className="text-slate-400 text-sm flex items-center ms-3"><FiUsers className="text-slate-900 dark:text-white size-[14px] me-1"/>{item.students} Students</span>
                    </div>

                    <Link href={`/course-detail-two/${item.id}`} className="text-lg hover:text-violet-600 font-medium">{item.title}</Link>

                    <p className="text-slate-400 mt-2">The phrasal sequence of the is now so many campaign</p>

                    <div className="flex justify-between md:mt-12 mt-3">
                        <span className="flex items-center"><Image src={item.user} width={32} height={32} className="size-8 rounded-full shadow shadow-slate-100 dark:shadow-slate-800 me-2" alt=""/> <Link href="" className="hover:text-violet-600 font-medium"> {item.name}</Link></span>
                        <Link href="" className="h-8 px-3 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600/10 hover:bg-violet-600 text-violet-600 hover:text-white text-sm">Explore <i className="mdi mdi-arrow-right align-middle ms-1"></i></Link>
                    </div>
                </div>
            </div>
        </div>
  )
}
