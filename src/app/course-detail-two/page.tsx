import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import Navbar from '../components/navbar/navbar'
import VideoModal from '../components/video-modal'
import CoursesOne from '../components/courses/courses-one'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'

import { FiBook, FiBookOpen, FiBox, FiClock, FiLock, FiShoppingCart, FiWifi } from 'react-icons/fi'

import { LuClipboardCheck } from 'react-icons/lu'

import { coursesData } from '../data'
import Switcher from '../components/switcher'

interface CoursesData{
    id: number;
    image: string;
    tag1: string;
    tag2: string;
    amount: number;
    lessons: number;
    students: number;
    title: string;
    desc: string;
    user: string;
    name: string;
}

export default function Page() {
  return (
    <>
        <Navbar navlight={true} tagline={false}/>  

        <section className="relative table w-full py-32 lg:py-44 bg-no-repeat bg-center bg-cover" style={{backgroundImage:`url('/images/bg/3.jpg')`}}>
            <div className="absolute inset-0 bg-black opacity-80"></div>
            <div className="container relative">
                <div className="grid grid-cols-1 pb-8 text-center mt-10">
                    <span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-0.5 rounded w-fit mx-auto h-5">$11/Lesson</span>
                    <h3 className="mt-3 text-3xl leading-normal font-medium text-white">Become a Professional Graphic Designer</h3>
                    <div className="flex items-center mx-auto mt-3">
                        <Image src='/images/team/2.jpg' width={32} height={32} className="size-8 rounded-full shadow-md dark:shadow-gray-800" alt=""/>
                        <Link href="" className="font-semibold text-white block ms-3">Calvin Carlo</Link>
                    </div>
                </div>
            </div>
            
            <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                <ul className="tracking-[0.5px] mb-0 inline-block">
                    <li className="inline-flex items-center mt-2 mx-3">
                        <FiClock className="text-lg text-white"/>
                        <span className="text-white/60 ms-2">10 Weeks</span>
                    </li>

                    <li className="inline-flex items-center mt-2 mx-3">
                        <FiWifi className="text-lg text-white"/>
                        <span className="text-white/60 ms-2">All Levels</span>
                    </li>
                    
                    <li className="inline-flex items-center mt-2 mx-3">
                        <FiBook className="text-lg text-white"/>
                        <span className="text-white/60 ms-2">16 Lessons</span>
                    </li>
                    
                    <li className="inline-flex items-center mt-2 mx-3">
                        <FiBox className="text-lg text-white"/>
                        <span className="text-white/60 ms-2">0 Quiz</span>
                    </li>
                    
                    <li className="inline-flex items-center mt-2 mx-3">
                        <FiBookOpen className="text-lg text-white"/>
                        <span className="text-white/60 ms-2">5 Students</span>
                    </li>
                    
                    <li className="inline-flex items-center mt-2 mx-3">
                        <FiShoppingCart className="text-lg text-white"/>
                        <Link href="" target="_blank" className="text-white ms-2">Enroll Now</Link>
                    </li>
                </ul>
            </div>
        </section> 

        <div className="relative">
            <div className="shape overflow-hidden z-1 text-white dark:text-slate-900">
                <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                </svg>
            </div>
        </div>

        <section className="relative md:py-24 py-16 overflow-hidden">
        <div className="container relative">
            <div className="grid grid-cols-1">
                <h5 className="text-2xl font-semibold mb-4">Overview</h5>

                <p className="text-slate-400 mb-3">Ooh, name it after me! Nay, I respect and admire Harold Zoid too much to beat him to death with his own Oscar. Why would I want to know that? What's with you kids? Every other day it's food, food, food. Alright, I'll get you some stupid food.</p>
                <p className="text-slate-400 mb-3">It's a T. It goes “tuh”. You seem malnourished. Are you suffering from intestinal parasites? I suppose I could part with 'one' and still be feared… And I'd do it again! And perhaps a third time! But that would be it.</p>
                <p className="text-slate-400 mb-3">I'm just glad my fat, ugly mama isn't alive to see this day. I can explain. It's very valuable. I barely knew Philip, but as a clergyman I have no problem telling his most intimate friends all about him.</p>
                <p className="text-slate-400 mb-3">Bender, we're trying our best. Kif might! You can crush me but you can't crush my spirit! Kif, I have mated with a woman. Inform the men. I'm Santa Claus!</p>
                <p className="text-slate-400">What are you hacking off? Is it my torso?! 'It is!' My precious torso! You, a bobsleder!? That I'd like to see! And I'd do it again! And perhaps a third time! But that would be it. My fellow Earthicans, as I have explained in my book 'Earth in the Balance”, and the much more popular ”Harry Potter and the Balance of Earth', we need to defend our planet against pollution. Also dark wizards.</p>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 mt-6 gap-6">
                <Image src='/images/course/1.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="rounded-md shadow" alt=""/>

                <div className="relative">
                    <Image src='/images/course/2.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="rounded-md shadow" alt=""/>
                    <VideoModal/>
                </div>
            </div>

            <div className="grid grid-cols-1 mt-6">
                <h5 className="text-2xl font-semibold">Curriculum</h5>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 pt-6 gap-6">
                <div>
                    <h5 className="text-lg font-semibold mb-4">Introductions</h5>

                    <div className="relative overflow-x-auto block w-full bg-white dark:bg-slate-900 shadow shadow-slate-200 dark:shadow-slate-800 rounded-md">
                        <table className="w-full text-start">
                            <thead>
                                <tr>
                                    <th className="px-4 py-5 text-start">Lessons</th>
                                    <th className="px-4 py-5 text-end">Time</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 1</Link></td>
                                    <td className="p-4 text-end"><span className="bg-violet-600/10 text-violet-600 text-[12px] px-2.5 py-1 rounded-md h-4">Watch Free</span></td>
                                </tr>

                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 2</Link></td>
                                    <td className="p-4 text-end flex justify-end"><FiLock className="text-lg"/></td>
                                </tr>

                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 3</Link></td>
                                    <td className="p-4 text-end flex justify-end"><FiLock className="text-lg"/></td>
                                </tr>

                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 4</Link></td>
                                    <td className="p-4 text-end flex justify-end"><FiLock className="text-lg"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h5 className="text-lg font-semibold mb-4">Mastery</h5>
                    
                    <div className="relative overflow-x-auto block w-full bg-white dark:bg-slate-900 shadow shadow-slate-200 dark:shadow-slate-800 rounded-md">
                        <table className="w-full text-start">
                            <thead>
                                <tr>
                                    <th className="px-4 py-5 text-start">Lessons</th>
                                    <th className="px-4 py-5 text-end">Time</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 5</Link></td>
                                    <td className="p-4 text-end"><span className="bg-violet-600/10 text-violet-600 text-[12px] px-2.5 py-1 rounded-md h-4">Watch Free</span></td>
                                </tr>

                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 6</Link></td>
                                    <td className="p-4 text-end flex justify-end"><FiLock className="text-lg"/></td>
                                </tr>

                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 7</Link></td>
                                    <td className="p-4 text-end flex justify-end"><FiLock className="text-lg"/></td>
                                </tr>

                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 8</Link></td>
                                    <td className="p-4 text-end flex justify-end"><FiLock className="text-lg"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h5 className="text-lg font-semibold mb-4">Final Thoughts</h5>
                    
                    <div className="relative overflow-x-auto block w-full bg-white dark:bg-slate-900 shadow shadow-slate-200 dark:shadow-slate-800 rounded-md">
                        <table className="w-full text-start">
                            <thead>
                                <tr>
                                    <th className="px-4 py-5 text-start">Lessons</th>
                                    <th className="px-4 py-5 text-end">Time</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 9</Link></td>
                                    <td className="p-4 text-end"><span className="bg-violet-600/10 text-violet-600 text-[12px] px-2.5 py-1 rounded-md h-4">Watch Free</span></td>
                                </tr>

                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 10</Link></td>
                                    <td className="p-4 text-end flex justify-end"><FiLock className="text-lg"/></td>
                                </tr>

                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 11</Link></td>
                                    <td className="p-4 text-end flex justify-end"><FiLock className="text-lg"/></td>
                                </tr>

                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 12</Link></td>
                                    <td className="p-4 text-end flex justify-end"><FiLock className="text-lg"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h5 className="text-lg font-semibold mb-4">Bonus</h5>
                    
                    <div className="relative overflow-x-auto block w-full bg-white dark:bg-slate-900 shadow shadow-slate-200 dark:shadow-slate-800 rounded-md">
                        <table className="w-full text-start">
                            <thead>
                                <tr>
                                    <th className="px-4 py-5 text-start">Lessons</th>
                                    <th className="px-4 py-5 text-end">Time</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 13</Link></td>
                                    <td className="p-4 text-end"><span className="bg-violet-600/10 text-violet-600 text-[12px] px-2.5 py-1 rounded-md h-4">Watch Free</span></td>
                                </tr>

                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 14</Link></td>
                                    <td className="p-4 text-end flex justify-end"><FiLock className="text-lg"/></td>
                                </tr>

                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 15</Link></td>
                                    <td className="p-4 text-end flex justify-end"><FiLock className="text-lg"/></td>
                                </tr>

                                <tr className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="p-4"><Link href="" className=""><LuClipboardCheck className="text-lg align-middle me-1 inline-block"/> Lesson 16</Link></td>
                                    <td className="p-4 text-end flex justify-end"><FiLock className="text-lg"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div className="container relative md:mt-24 mt-16">
            <div className="grid grid-cols-1 pb-6 text-center">
                <h4 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">Recent Courses</h4>

                <p className="text-slate-400 max-w-xl mx-auto">Discover a world of knowledge and opportunities with our online education platform pursue a new career.</p>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
                {coursesData.slice(0,3).map((item:CoursesData,index:number)=>{
                    return(
                        <CoursesOne item={item} key={index}/>
                    )
                })}
            </div>
        </div>

        <div className="container relative md:mt-24 mt-16">
            <div className="md:flex justify-center">
                <div className="lg:w-2/3 text-center">
                    <h3 className="md:text-3xl text-2xl md:leading-normal leading-normal font-semibold mb-6">Subscribe our weekly subscription</h3>

                    <p className="text-slate-400 max-w-xl mx-auto">Add some text to explain benefits of subscripton on your services. We'll send you the best of our blog just once a weekly.</p>

                    <div className="mt-6">
                        <div className="text-center subcribe-form">
                            <form className="relative mx-auto max-w-xl">
                                <input type="email" id="subemail" name="name" className="pt-4 pe-40 pb-4 ps-6 w-full h-[50px] outline-none text-black dark:text-white rounded-full bg-white/70 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800" placeholder="Enter your email id.."/>
                                <button type="submit" className="h-12 px-6 tracking-wide items-center justify-center font-medium bg-violet-600 text-white rounded-full absolute top-[1px] end-[1px]">Subcribe Now</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <Footer/>

    <ScrollToTop/>
    <Switcher/>
    </>
  )
}
