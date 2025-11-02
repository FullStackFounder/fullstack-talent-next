'use client'
import React, { useState } from 'react';
import Link from 'next/link';

import ModalVideo from 'react-modal-video';
import '../../../node_modules/react-modal-video/css/modal-video.css'
import Image from 'next/image';


export default function AboutOne({title}:{title:any}) {
    const [isOpen, setOpen] = useState<boolean>(false);
  return (
    <>
        <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-6">
            <div className="lg:col-span-6 md:col-span-7">
                <div className="relative">
                    <div className="relative md:shrink-0 lg:me-0 me-10">
                        <Image className="object-cover md:w-96 w-84 h-[500px] rounded-lg shadow-md dark:shadow-gyay-700" src='/images/course/1.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} alt=""/>
                    </div>

                    <div className="absolute bottom-10 lg:end-6 end-0">
                        <div className="relative z-1 top-10 xl:text-start lg:text-end text-end">
                            <Link href="#!" scroll={false}  onClick={() => setOpen(true)} className="lightbox size-20 rounded-full shadow-md dark:shadow-gyay-700 inline-flex items-center justify-center bg-violet-600 text-white">
                                <i className="mdi mdi-play inline-flex items-center justify-center text-2xl"></i>
                            </Link>
                        </div>

                        <div className="relative md:shrink-0">
                            <Image className="object-cover size-48 rounded-lg shadow-md dark:shadow-gyay-700" src='/images/course/4.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} alt=""/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-6 md:col-span-5">
                {title && 
                    <span className="text-violet-600 font-semibold mb-3 uppercase">Our Story</span>
                }
                <h4 className="mb-4 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Access to Learning <br/> Anytime & Anyware</h4>
                <p className="text-slate-400 max-w-xl mx-auto">Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>

                <div className="grid md:grid-cols-2 mt-4">
                    <ul className="list-none">
                        <li className="mt-2 text-[16px]"><i className="mdi mdi-circle-medium"></i> <span className="text-slate-400">Flexible Timing</span></li>
                        <li className="mt-2 text-[16px]"><i className="mdi mdi-circle-medium"></i> <span className="text-slate-400">Easy Learning</span></li>
                    </ul>

                    <ul className="list-none">
                        <li className="mt-2 text-[16px]"><i className="mdi mdi-circle-medium"></i> <span className="text-slate-400">Affordable</span></li>
                        <li className="mt-2 text-[16px]"><i className="mdi mdi-circle-medium"></i> <span className="text-slate-400">World Class</span></li>
                    </ul>
                </div>

                <div className="mt-6">
                    <Link href="" className="h-10 px-5 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600/10 hover:bg-violet-600 text-violet-600 hover:text-white">Learn More <i className="mdi mdi-arrow-right align-middle ms-1"></i></Link>
                </div>
            </div>
        </div>
        <ModalVideo
				channel="youtube"
				youtube={{ mute: 0, autoplay: 0 }}
				isOpen={isOpen}
				videoId="yba7hPeTSjk"
				onClose={() => setOpen(false)} 
			/>
    </>
  )
}
