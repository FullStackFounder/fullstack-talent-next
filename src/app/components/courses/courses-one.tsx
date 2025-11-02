import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { FiBook, FiUsers } from 'react-icons/fi'

export default function CoursesOne({item}:any) {
  return (
    <>
        <div className="group bg-white dark:bg-slate-900 rounded-md shadow-md hover:shadow-lg shadow-slate-100 dark:shadow-slate-800 transition duration-500">
            <div className="p-3 pb-0 relative">
                <div className="relative overflow-hidden rounded-md">
                    <Image src={item.image} width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="group-hover:scale-105 duration-500" alt=""/>
                </div>
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

                <Link href={`/course-detail/${item.id}`} className="text-lg hover:text-violet-600 font-medium">{item.title}</Link>

                <p className="text-slate-400 mt-2">{item.desc}</p>

                <div className="flex justify-between mt-3">
                    <span className="flex items-center"><Image src={item.user} width={32} height={32} className="size-8 rounded-full shadow shadow-slate-100 dark:shadow-slate-800 me-2" alt=""/> <Link href="" className="hover:text-violet-600 font-medium"> {item.name}</Link></span>
                    <Link href="#" className="h-8 px-3 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600/10 hover:bg-violet-600 text-violet-600 hover:text-white text-sm">Explore <i className="mdi mdi-arrow-right align-middle ms-1"></i></Link>
                </div>
            </div>
        </div>
    </>
  )
}
