'use client'
import React,{useState, useEffect} from 'react'

import BackToHome from '../components/back-to-home';
import Switcher from '../components/switcher';
import Image from 'next/image';

export default function Maintenance() {
    let [minutes, setMinutes] = useState(0);
    let [remainingSeconds, setRemainingSeconds] = useState(0);

    useEffect(() => {
        let intervalId = setInterval(() => {
            calculateTimeRemaining()
        }, 1000);
        var seconds = 3599;
        function calculateTimeRemaining() {
            const minutes = Math.round((seconds - 30) / 60);
            const remainingSeconds = seconds % 60;
            setMinutes(minutes);
            setRemainingSeconds(remainingSeconds);
            if (seconds === 0) {
                clearInterval(intervalId);
            } else {
                seconds = seconds - 1;
            }
        }
        return () => {
            clearInterval(intervalId);
        };
    }, []);

  return (
    <>
       <section className="md:h-screen py-36 flex items-center relative bg-no-repeat bg-center bg-cover" style={{backgroundImage:`url('/images/bg/2.jpg')`}}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-2" id="particles-snow"></div>
            <div className="container relative z-3 text-center">
                <div className="grid grid-cols-1">
                    <Image src='/images/logo-icon-64.png' width={64} height={64} className="mx-auto" alt=""/>
                    <h1 className="text-white mb-6 mt-8 md:text-5xl text-3xl font-bold">We Are Back Soon...</h1>
                    <p className="text-white/70 text-lg max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
                </div>

                <div className="grid grid-cols-1 mt-10">
                    <div className="text-center">
                        <span id="maintenance" className="timer text-white text-[56px] tracking-[1px]">{minutes}:{remainingSeconds}</span>
                        <span className="block text-base font-semibold uppercase text-white">Minutes</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 mt-6">
                    <div className="text-center">
                        <form className="relative mx-auto max-w-xl">
                            <input type="email" id="subemail" name="name" className="pt-4 pe-40 pb-4 ps-6 w-full h-[50px] outline-none text-black dark:text-white rounded-full bg-white/70 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800" placeholder="Enter your email id.."/>
                            <button type="submit" className="h-12 px-6 tracking-wide items-center justify-center font-medium bg-violet-600 text-white rounded-full absolute top-[1px] end-[1px]">Subcribe Now</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>  
        <BackToHome/>
        <Switcher/>
    </>
  )
}
