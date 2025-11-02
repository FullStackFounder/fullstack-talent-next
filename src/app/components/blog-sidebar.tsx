import React from 'react'
import Link from 'next/link'

import { FiSearch } from 'react-icons/fi'

import { blogRecentPost, blogSocial } from '../data'
import Image from 'next/image';

interface BlogRecentPost{
    image: string;
    title: string;
    date: string;
}

export default function BlogsSidebar() {
  return (
        <div className="sticky top-20 p-6 bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700">
            <form>
                <div>
                    <label htmlFor="searchname" className="font-semibold">Search Blog</label>
                    <div className="relative mt-2">
                        <FiSearch className="absolute top-[10px] start-3 size-5"/>
                        <input name="search" id="searchname" type="text" className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 dark:focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-10 ps-10" placeholder="Search"/>
                    </div>
                </div>
            </form>

            <div className="mt-6">
                <h5 className="font-semibold">Recent Post</h5>
                {blogRecentPost.map((item:BlogRecentPost,index:number)=>{
                    return(
                        <div className="flex items-center mt-4" key={index}>
                            <Image src={item.image} width={113} height={64} className="h-16 rounded-md shadow dark:shadow-gray-800" alt=""/>

                            <div className="ms-3">
                                <Link href="" className="font-medium hover:text-violet-600">{item.title}</Link>
                                <p className="text-sm text-slate-400">{item.date}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-6">
                <h5 className="font-semibold">Social</h5>
                <ul className="list-none mt-4">
                    {blogSocial.map((item:any,index:number)=>{
                        let Icon = item
                        return(
                            <li className="inline mx-[2px]" key={index}><Link href="" className="size-7 inline-flex justify-center items-center text-slate-400 hover:text-white border border-slate-100 dark:border-slate-800 rounded-md hover:border-violet-600 dark:hover:border-violet-600 hover:bg-violet-600 dark:hover:bg-violet-600"><Icon className="size-4"/></Link></li>
                        )
                    })}
                </ul>
            </div>
        </div>
  )
}
