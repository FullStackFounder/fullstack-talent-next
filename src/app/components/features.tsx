import React from 'react'
import Link from 'next/link';

import { featureData } from '../data'
import { IconType } from 'react-icons';

interface FeatureData{
    icon: IconType;
    title: string;
    desc: string;
}

export default function Features() {
  return (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
            {featureData.map((item:FeatureData,index:number)=>{
                let Icon = item.icon
                return(
                    <div className="p-6 shadow-lg shadow-slate-100 dark:shadow-slate-800 transition duration-500 rounded-2xl" key={index}>
                        <div className="size-16 bg-violet-600/5 text-violet-600 rounded-2xl flex align-middle justify-center items-center shadow-sm">
                            <Icon className="text-3xl"></Icon>
                        </div>

                        <div className="content mt-6">
                            <Link href="#" className="text-lg hover:text-violet-600 dark:text-white dark:hover:text-violet-600 transition-all duration-500 ease-in-out font-semibold">{item.title}</Link>
                            <p className="text-slate-400 mt-3">{item.desc}</p>
                            
                            <div className="mt-3">
                                <Link href="#" className="hover:text-violet-600 dark:hover:text-violet-600 after:bg-violet-600 dark:text-white transition duration-500">Read More <i className="mdi mdi-arrow-right"></i></Link>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
  )
}
