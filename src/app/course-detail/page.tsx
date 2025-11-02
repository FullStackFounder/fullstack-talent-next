import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import Navbar from '../components/navbar/navbar'
import VideoModal from '../components/video-modal'
import CoursesOne from '../components/courses/courses-one'
import Footer from '../components/footer'
import ScrollToTop from '../components/scroll-to-top'
import Switcher from '../components/switcher'

import { FiBook, FiBookOpen, FiBox, FiClock, FiShoppingCart, FiWifi } from 'react-icons/fi'

import { coursesData } from '../data'

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
        <Navbar navlight={false} tagline={false}/>

        <section className="relative pt-32 md:pb-24 pb-16">
            <div className="container">
                <div className="md:flex justify-center">
                    <div className="lg:w-3/5">
                        <h3 className="text-3xl leading-normal font-medium">Become a Professional Graphic Designer</h3>
                        <div className="flex items-center mx-auto mt-3">
                            <Image src='/images/team/2.jpg' width={32} height={32} className="size-8 rounded-full shadow-md dark:shadow-gray-800" alt=""/>
                            <Link href="" className="font-semibold block ms-3">Calvin Carlo</Link>
                        </div>
                    </div>
                </div>

                <div className="md:flex justify-center text-center">
                    <div className="lg:w-4/5">
                        <ul className="tracking-[0.5px] mb-0 inline-block mt-4">
                            <li className="inline-flex items-center mt-2 me-5">
                                <FiClock className="text-lg"/>
                                <span className="text-slate-400 ms-2">10 Weeks</span>
                            </li>
        
                            <li className="inline-flex items-center mt-2 me-5">
                                <FiWifi className="text-lg"/>
                                <span className="text-slate-400 ms-2">All Levels</span>
                            </li>
                            
                            <li className="inline-flex items-center mt-2 me-5">
                                <FiBook className="text-lg"/>
                                <span className="text-slate-400 ms-2">16 Lessons</span>
                            </li>
                            
                            <li className="inline-flex items-center mt-2 me-5">
                                <FiBox className="text-lg"/>
                                <span className="text-slate-400 ms-2">0 Quiz</span>
                            </li>
                            
                            <li className="inline-flex items-center mt-2 me-5">
                                <FiBookOpen className="text-lg"/>
                                <span className="text-slate-400 ms-2">5 Students</span>
                            </li>
                            
                            <li className="inline-flex items-center mt-2">
                                <FiShoppingCart className="text-lg"/>
                                <Link href="" target="_blank" className="text-violet-600 ms-2">Enroll Now</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="md:flex justify-center mt-6">
                    <div className="lg:w-full">
                        <div className="relative">
                            <Image src='/images/course/1.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="rounded-lg shadow-md dark:shadow-gray-800" alt=""/>
                            <VideoModal/>
                        </div>
                    </div>
                </div>

                <div className="md:flex justify-center mt-10">
                    <div className="lg:w-3/5">
                        <h5 className="text-2xl font-semibold mb-4">Overview</h5>

                        <p className="text-slate-400 mb-3">Ooh, name it after me! Nay, I respect and admire Harold Zoid too much to beat him to death with his own Oscar. Why would I want to know that? What's with you kids? Every other day it's food, food, food. Alright, I'll get you some stupid food.</p>
                        <p className="text-slate-400 mb-3">It's a T. It goes “tuh”. You seem malnourished. Are you suffering from intestinal parasites? I suppose I could part with 'one' and still be feared… And I'd do it again! And perhaps a third time! But that would be it.</p>
                        <p className="text-slate-400 mb-3">I'm just glad my fat, ugly mama isn't alive to see this day. I can explain. It's very valuable. I barely knew Philip, but as a clergyman I have no problem telling his most intimate friends all about him.</p>
                        <p className="text-slate-400 mb-3">Bender, we're trying our best. Kif might! You can crush me but you can't crush my spirit! Kif, I have mated with a woman. Inform the men. I'm Santa Claus!</p>
                        <p className="text-slate-400">What are you hacking off? Is it my torso?! 'It is!' My precious torso! You, a bobsleder!? That I'd like to see! And I'd do it again! And perhaps a third time! But that would be it. My fellow Earthicans, as I have explained in my book 'Earth in the Balance”, and the much more popular ”Harry Potter and the Balance of Earth', we need to defend our planet against pollution. Also dark wizards.</p>

                        <Image src='/images/course/2.jpg' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="rounded-md shadow mt-4" alt=""/>

                        <div className="mt-6">
                            <h5 className="text-2xl font-semibold">Curriculum</h5>
                        </div>
        
                        <div className="mt-6">
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
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 1</Link></td>
                                            <td className="p-4 text-end"><span className="bg-violet-600/10 text-violet-600 text-[12px] px-2.5 py-1 rounded-md h-4">Watch Free</span></td>
                                        </tr>

                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 2</Link></td>
                                            <td className="p-4 text-end"><i className="iconoir-lock text-lg"></i></td>
                                        </tr>

                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 3</Link></td>
                                            <td className="p-4 text-end"><i className="iconoir-lock text-lg"></i></td>
                                        </tr>

                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 4</Link></td>
                                            <td className="p-4 text-end"><i className="iconoir-lock text-lg"></i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-6">
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
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 5</Link></td>
                                            <td className="p-4 text-end"><span className="bg-violet-600/10 text-violet-600 text-[12px] px-2.5 py-1 rounded-md h-4">Watch Free</span></td>
                                        </tr>

                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 6</Link></td>
                                            <td className="p-4 text-end"><i className="iconoir-lock text-lg"></i></td>
                                        </tr>

                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 7</Link></td>
                                            <td className="p-4 text-end"><i className="iconoir-lock text-lg"></i></td>
                                        </tr>

                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 8</Link></td>
                                            <td className="p-4 text-end"><i className="iconoir-lock text-lg"></i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-6">
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
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 9</Link></td>
                                            <td className="p-4 text-end"><span className="bg-violet-600/10 text-violet-600 text-[12px] px-2.5 py-1 rounded-md h-4">Watch Free</span></td>
                                        </tr>

                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 10</Link></td>
                                            <td className="p-4 text-end"><i className="iconoir-lock text-lg"></i></td>
                                        </tr>

                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 11</Link></td>
                                            <td className="p-4 text-end"><i className="iconoir-lock text-lg"></i></td>
                                        </tr>

                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 12</Link></td>
                                            <td className="p-4 text-end"><i className="iconoir-lock text-lg"></i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-6">
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
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 13</Link></td>
                                            <td className="p-4 text-end"><span className="bg-violet-600/10 text-violet-600 text-[12px] px-2.5 py-1 rounded-md h-4">Watch Free</span></td>
                                        </tr>

                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 14</Link></td>
                                            <td className="p-4 text-end"><i className="iconoir-lock text-lg"></i></td>
                                        </tr>

                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 15</Link></td>
                                            <td className="p-4 text-end"><i className="iconoir-lock text-lg"></i></td>
                                        </tr>

                                        <tr className="border-t border-slate-100 dark:border-slate-800">
                                            <td className="p-4"><Link href="" className=""><i className="iconoir-clipboard-check text-lg align-middle me-1"></i> Lesson 16</Link></td>
                                            <td className="p-4 text-end"><i className="iconoir-lock text-lg"></i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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
