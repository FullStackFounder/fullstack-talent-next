import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

import BackToHome from '../components/back-to-home'
import Switcher from '../components/switcher'

export default function Page() {
  return (
    <>
        <section className="md:h-screen py-36 flex items-center relative bg-no-repeat bg-center bg-cover" style={{backgroundImage:`url('/images/bg/2.jpg')`}}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-2" id="particles-snow"></div>
            <div className="container relative z-3">
                <div className="flex">
                    <div className="max-w-[400px] w-full p-6 bg-white dark:bg-slate-900 shadow-md shadow-slate-100 dark:shadow-slate-800 rounded-md">
                        <Link href="/"><Image src='/images/logo-icon-64.png' width={64} height={64} alt=""/></Link>
                        <h5 className="my-6 text-xl font-semibold">Reset Your Password</h5>
                        <div className="grid grid-cols-1">
                            <p className="text-slate-400 mb-6">Please enter your email address. You will receive a link to create a new password via email.</p>
                            <form className="text-start">
                                <div className="grid grid-cols-1">
                                    <div className="mb-4">
                                        <label className="font-medium" htmlFor="LoginEmail">Email Address:</label>
                                        <input id="LoginEmail" type="email" className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 dark:focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-10 mt-3" placeholder="name@example.com"/>
                                    </div>

                                    <div className="mb-4">
                                        <Link href="" className="h-10 px-5 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600 text-white w-full">Send</Link>
                                    </div>

                                    <div className="text-center">
                                        <span className="text-slate-400 me-2">Remember your password ? </span><Link href="/login" className="text-black dark:text-white font-bold">Sign in</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <BackToHome/>
        <Switcher/>
    </>
  )
}
