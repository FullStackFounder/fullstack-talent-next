'use client'
import React from 'react'
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import '../../../node_modules/swiper/swiper-bundle.css'

export default function HeroSlider() {
  return (
    <section className="swiper mySwiper swiper-slider-hero relative block h-screen" id="home">
            <Swiper className="swiper-wrapper" modules={[Autoplay]} autoplay={true} speed={3000}>
                <SwiperSlide className="swiper-slide flex items-center overflow-hidden">
                    <div className="slide-inner absolute start-0 top-0 w-full h-full slide-bg-image flex items-center bg-center;" style={{backgroundImage:`url('/images/bg/2.jpg')`}}>
                        <div className="absolute inset-0 bg-black/70"></div>
                        <div className="container relative md:mt-16">
                            <div className="grid grid-cols-1">
                                <div className="text-center">
                                    <h1 className="font-bold text-white lg:leading-normal leading-normal text-4xl lg:text-5xl mb-5">Unlock Your Potential <br/> with Online Learning</h1>
                                    <p className="text-white/70 text-lg max-w-xl mx-auto">Launch your campaign and benefit from our expertise on designing and managing conversion centered Tailwind CSS v3.x html page.</p>
                                    
                                    <div className="mt-6">
                                        <Link href="" className="h-12 px-6 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600 text-white">Contact Us <i className="mdi mdi-arrow-right align-middle ms-1"></i></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide> 

                <SwiperSlide className="swiper-slide flex items-center overflow-hidden">
                    <div className="slide-inner absolute start-0 top-0 w-full h-full slide-bg-image flex items-center bg-center;" style={{backgroundImage:`url('/images/bg/3.jpg')`}}>
                        <div className="absolute inset-0 bg-black/70"></div>
                        <div className="container relative md:mt-16">
                            <div className="grid grid-cols-1">
                                <div className="text-center">
                                    <h1 className="font-bold text-white lg:leading-normal leading-normal text-4xl lg:text-5xl mb-5">Find the Perfect Course <br/> for Your Carrier Goals</h1>
                                    <p className="text-white/70 text-lg max-w-xl mx-auto">Launch your campaign and benefit from our expertise on designing and managing conversion centered Tailwind CSS v3.x html page.</p>
                                    
                                    <div className="mt-6">
                                        <Link href="" className="h-12 px-6 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600 text-white">Get Started <i className="mdi mdi-arrow-right align-middle ms-1"></i></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide> 

                <SwiperSlide className="swiper-slide flex items-center overflow-hidden">
                    <div className="slide-inner absolute start-0 top-0 w-full h-full slide-bg-image flex items-center bg-center;" style={{backgroundImage:`url('/images/bg/4.jpg')`}}>
                        <div className="absolute inset-0 bg-black/70"></div>
                        <div className="container relative md:mt-16">
                            <div className="grid grid-cols-1">
                                <div className="text-center">
                                    <h1 className="font-bold text-white lg:leading-normal leading-normal text-4xl lg:text-5xl mb-5">Welcome to Your Online <br/> Learning Journey</h1>
                                    <p className="text-white/70 text-lg max-w-xl mx-auto">Launch your campaign and benefit from our expertise on designing and managing conversion centered Tailwind CSS v3.x html page.</p>
                                    
                                    <div className="mt-6">
                                        <Link href="" className="h-12 px-6 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600 text-white">Get Started <i className="mdi mdi-arrow-right align-middle ms-1"></i></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide> 
            </Swiper>     
        </section>
  )
}
