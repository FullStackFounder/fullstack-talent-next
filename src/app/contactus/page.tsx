'use client'
import React, { useState } from "react";
import Image from 'next/image'
import { Link } from 'react-scroll'

import Navbar from '../components/navbar/navbar'
import Footer from "../components/footer";
import ScrollToTop from "../components/scroll-to-top";
import Switcher from "../components/switcher";

import { FiMail, FiMapPin, FiPhone, FiX } from 'react-icons/fi'

export default function Page() {
    let [modal, setModal] = useState(false)
  return (
    <>
        <Navbar navlight={false} tagline={false}/>

        <div className="container-fluid relative mt-20">
            <div className="grid grid-cols-1">
                <div className="w-full leading-[0] border-0">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39206.002432144705!2d-95.4973981212445!3d29.709510002925988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c16de81f3ca5%3A0xf43e0b60ae539ac9!2sGerald+D.+Hines+Waterwall+Park!5e0!3m2!1sen!2sin!4v1566305861440!5m2!1sen!2sin" style={{border:'0'}} title='map' className="w-full h-[500px]" allowFullScreen></iframe>
                </div>
            </div>
        </div>

        <section className="relative lg:py-24 py-16">
            <div className="container relative">
                <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-6">
                    <div className="lg:col-span-7 md:col-span-6">
                        <Image src='/images/contact.svg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} alt=""/>
                    </div>

                    <div className="lg:col-span-5 md:col-span-6">
                        <div className="lg:me-5">
                            <div className="bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700 p-6">
                                <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Get in touch !</h3>

                                <form>
                                    <div className="grid lg:grid-cols-12 lg:gap-6">
                                        <div className="lg:col-span-6 mb-5">
                                            <label htmlFor="name" className="font-medium">Your Name:</label>
                                            <input name="name" id="name" type="text" className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 dark:focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-10 mt-2" placeholder="Name :"/>
                                        </div>
        
                                        <div className="lg:col-span-6 mb-5">
                                            <label htmlFor="email" className="font-medium">Your Email:</label>
                                            <input name="email" id="email" type="email" className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 dark:focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-10 mt-2" placeholder="Email :"/>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1">
                                        <div className="mb-5">
                                            <label htmlFor="subject" className="font-medium">Your Question:</label>
                                            <input name="subject" id="subject" className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 dark:focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-10 mt-2" placeholder="Subject :"/>
                                        </div>

                                        <div className="mb-5">
                                            <label htmlFor="comments" className="font-medium">Your Comment:</label>
                                            <textarea name="comments" id="comments" className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 dark:focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-28 mt-2 textarea" placeholder="Message :"></textarea>
                                        </div>
                                    </div>
                                    <button type="submit" id="submit" name="send" className="h-10 px-5 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600 text-white">Send Message</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container relative lg:mt-24 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
                    <div className="text-center px-6">
                        <div className="size-16 bg-violet-600/5 text-violet-600 rounded-2xl flex align-middle justify-center items-center shadow-sm mx-auto">
                            <FiPhone className="text-3xl"/>
                        </div>

                        <div className="content mt-4">
                            <h5 className="text-lg font-semibold">Phone</h5>
                            <p className="text-slate-400 mt-3">The phrasal sequence of the is now so that many campaign and benefit</p>
                            
                            <div className="mt-4">
                                <Link to="tel:+152534-468-854" className="btn btn-link text-violet-600 hover:text-violet-600 after:bg-violet-600 transition duration-500">+152 534-468-854</Link>
                            </div>
                        </div>
                    </div>

                    <div className="text-center px-6">
                        <div className="size-16 bg-violet-600/5 text-violet-600 rounded-2xl flex align-middle justify-center items-center shadow-sm mx-auto">
                            <FiMail className="text-3xl"/>
                        </div>

                        <div className="content mt-4">
                            <h5 className="text-lg font-semibold">Email</h5>
                            <p className="text-slate-400 mt-3">The phrasal sequence of the is now so that many campaign and benefit</p>
                            
                            <div className="mt-4">
                                <Link to="mailto:contact@example.com" className="btn btn-link text-violet-600 hover:text-violet-600 after:bg-violet-600 transition duration-500">contact@example.com</Link>
                            </div>
                        </div>
                    </div>

                    <div className="text-center px-6">
                        <div className="size-16 bg-violet-600/5 text-violet-600 rounded-2xl flex align-middle justify-center items-center shadow-sm mx-auto">
                            <FiMapPin className="iconoir-map-pin text-3xl"/>
                        </div>

                        <div className="content mt-4">
                            <h5 className="text-lg font-semibold">Location</h5>
                            <p className="text-slate-400 mt-3">C/54 Northwest Freeway, Suite 558, <br/> Houston, USA 485</p>
                            
                            <div className="mt-4">
                                <Link to='' onClick={()=>setModal(!modal)}
                                data-type="iframe" className="video-play-icon read-more lightbox btn btn-link text-violet-600 hover:text-violet-600 after:bg-violet-600 transition duration-500">View on Google map</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {modal && (
            <div className="w-full h-screen bg-slate-900/80 fixed top-0 left-0 bottom-0 right-0 z-999 flex items-center justify-center">
                <div className="w-full h-full px-5 md:px-40 md-py-20 py-5">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d55431.05581015953!2d-95.461302!3d29.735948000000004!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c36647a52ab1%3A0x70a301678672cb!2sBriargrove%20Park%2C%20Houston%2C%20TX%2C%20USA!5e0!3m2!1sen!2sin!4v1710322657489!5m2!1sen!2sin" width="100%" height="100%" title="myfram" loading="lazy"></iframe>
                </div>
                <button className="text-slate-400 absolute top-[20px] right-[20px]" onClick={()=>setModal(!modal)}>
                    <FiX className="size-5"/>
                </button>
            </div>
        )}

        <Footer/>

        <ScrollToTop/>
        <Switcher/>
    </>
  )
}
