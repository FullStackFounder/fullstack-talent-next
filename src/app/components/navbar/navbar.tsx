'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

import BuyBtn from './buy-btn';
import Image from 'next/image';

export default function Navbar({navlight,tagline}:{navlight:any, tagline:any}) {
    let [toggle, setToggle] = useState<Boolean | undefined>(false)
    let [manu, setManu] = useState<any>(false);
    let [subManu, setSubManu] = useState<any>();
    let[scroll,setScroll] = useState<boolean>(false)

    const pathname = usePathname()

    const toggleMenu = () =>{
        setToggle(!toggle)
    }

    useEffect(()=>{
        setManu(pathname)
        window.scrollTo(0,0)

        const handlerScroll=()=>{
            if(window.scrollY > 50){
                setScroll(true)
            }else{setScroll(false)}
        }
        window.addEventListener('scroll',handlerScroll)

        return () => {
            window.removeEventListener('scroll',handlerScroll)
          };
    },[])

  return (
    <>
        <nav id="topnav" className={`defaultscroll is-sticky ${scroll ? 'nav-sticky' : ''} ${tagline ? 'tagline-height' : ''}`}>
            <div className="container relative">
                {!navlight && 
                    <Link className="logo" href="/">
                        <Image src='/images/logo-dark.png' width={137} height={28} className="inline-block dark:hidden" alt=""/>
                        <Image src='/images/logo-light.png' width={137} height={28} className="hidden dark:inline-block" alt=""/>
                    </Link>
                }
                {navlight && 
                    <Link className="logo" href="/">
                        <span className="inline-block dark:hidden">
                            <Image src='/images/logo-dark.png' width={137} height={28} className="l-dark" alt=""/>
                            <Image src='/images/logo-light.png' width={137} height={28} className="l-light" alt=""/>
                        </span>
                        <Image src='/images/logo-light.png' width={137} height={28} className="hidden dark:inline-block" alt=""/>
                    </Link>
                }

                <div className="menu-extras">
                    <div className="menu-item">
                        <Link href='' className={`navbar-toggle ${toggle ? 'open' : ''}`} id="isToggle" onClick={toggleMenu}>
                            <div className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </Link>
                    </div>
                </div>

                <BuyBtn navlight={navlight}/>

                <div id="navigation" className={`${toggle ? 'block' : 'none'}`}>
                    <ul className={`navigation-menu justify-start ${navlight ? 'nav-light' : ''}`}>
                        <li className={`has-submenu parent-parent-menu-item ${['/','/index-two','/index-three','/index-four','/index-five'].includes(manu) ? 'active' : ''}`}>
                            <Link href="#" onClick={()=>setSubManu(subManu === '/index-item' ? '' : '/index-item')}>Home</Link><span className="menu-arrow"></span>

                            <ul className={`submenu megamenu ${['/index-item'].includes(subManu) ? 'open' : ''}`}>
                                <li>
                                    <ul>
                                        <li className={manu === '/' ? 'active' : ''}>
                                            <Link href="/" className="sub-menu-item">
                                                <div className="lg:text-center">
                                                    <span className="none lg:block"><Image src='/images/demos/1.png' width={0} height={0} sizes='100vw' style={{width:"100%", height:'auto'}} className="img-fluid rounded shadow-md" alt=""/></span>
                                                    <span className="lg:mt-2 block">Hero One</span>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                <li>
                                    <ul>
                                        <li className={manu === '/index-two' ? 'active' : ''}>
                                            <Link href="/index-two" className="sub-menu-item">
                                                <div className="lg:text-center">
                                                    <span className="none lg:block"><Image src='/images/demos/2.png' width={0} height={0} sizes='100vw' style={{width:"100%", height:'auto'}} className="img-fluid rounded shadow-md" alt=""/></span>
                                                    <span className="lg:mt-2 block">Hero Two</span>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                <li>
                                    <ul>
                                        <li className={manu === '/index-three' ? 'active' : ''}>
                                            <Link href="/index-three" className="sub-menu-item">
                                                <div className="lg:text-center">
                                                    <span className="none lg:block"><Image src='/images/demos/3.png' width={0} height={0} sizes='100vw' style={{width:"100%", height:'auto'}} className="img-fluid rounded shadow-md" alt=""/></span>
                                                    <span className="lg:mt-2 block">Hero Three</span>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                
                                <li>
                                    <ul>
                                        <li className={manu === '/index-four' ? 'active' : ''}>
                                            <Link href="/index-four" className="sub-menu-item">
                                                <div className="lg:text-center">
                                                    <span className="none lg:block"><Image src='/images/demos/4.png' width={0} height={0} sizes='100vw' style={{width:"100%", height:'auto'}} className="img-fluid rounded shadow-md" alt=""/></span>
                                                    <span className="lg:mt-2 block">Hero Four</span>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                
                                <li>
                                    <ul>
                                        <li className={manu === '/index-five' ? 'active' : ''}>
                                            <Link href="/index-five" className="sub-menu-item">
                                                <div className="lg:text-center">
                                                    <span className="none lg:block"><Image src='/images/demos/5.png' width={0} height={0} sizes='100vw' style={{width:"100%", height:'auto'}} className="img-fluid rounded shadow-md" alt=""/></span>
                                                    <span className="lg:mt-2 block">Hero Five</span>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                        <li className={`has-submenu parent-parent-menu-item ${['/grid','/grid-sidebar','/list','/list-sidebar','/youtube-listing','/video-listing','/course-detail','/course-detail-two'].includes(manu)? 'active' :''}`}>
                            <Link href="#" onClick={()=>setSubManu(subManu === '/cours-item' ? '' : '/cours-item')}>Courses</Link><span className="menu-arrow"></span>
                            <ul className={`submenu ${['/cours-item','/grid-item','/list-item','/video-item','/courses-item'].includes(subManu) ? 'open' : ''}`}>
                                <li className={`has-submenu parent-menu-item ${['/grid','/grid-sidebar'].includes(manu) ? 'active' : ''}`}><Link href="#" onClick={()=>setSubManu(subManu === '/grid-item' ? '' : '/grid-item')}> Grid Courses </Link><span className="submenu-arrow"></span>
                                    <ul className={`submenu ${['/grid-item'].includes(subManu) ? 'open' : ''}`}>
                                        <li className={manu === '/grid' ? 'active' : ''}><Link href="/grid" className="sub-menu-item">Grid Listing</Link></li>
                                        <li className={manu === '/grid-sidebar' ? 'active' : ''}><Link href="/grid-sidebar" className="sub-menu-item">Grid Sidebar </Link></li>
                                    </ul> 
                                </li>
                                <li className={`has-submenu parent-menu-item ${['/list','/list-sidebar'].includes(manu) ? 'active' :''}`}><Link href="#" onClick={()=>setSubManu(subManu === '/list-item' ? '' : '/list-item')}> List Courses </Link><span className="submenu-arrow"></span>
                                    <ul className={`submenu ${['/list-item'].includes(subManu) ? 'open' : ''}`}>
                                        <li className={manu === '/list' ? 'active' : ''}><Link href="/list" className="sub-menu-item">List Listing</Link></li>
                                        <li className={manu === '/list-sidebar' ? 'active' : ''}><Link href="/list-sidebar" className="sub-menu-item">List Sidebar </Link></li>
                                    </ul>  
                                </li>
                                <li className={`has-submenu parent-menu-item ${['/youtube-listing','/video-listing'].includes(manu) ? 'active' :''}`}><Link href="#" onClick={()=>setSubManu(subManu === '/video-item' ? '' : '/video-item')}> Video Courses </Link><span className="submenu-arrow"></span>
                                    <ul className={`submenu ${['/video-item'].includes(subManu) ? 'open' : ''}`}>
                                        <li className={manu === '/youtube-listing' ? 'active' : ''}><Link href="/youtube-listing" className="sub-menu-item">Youtube Listing</Link></li>
                                        <li className={manu === '/video-listing' ? 'active' : ''}><Link href="/video-listing" className="sub-menu-item">Video Listing</Link></li>
                                    </ul>  
                                </li>
                                <li className={`has-submenu parent-menu-item ${['/course-detail','/course-detail-two'].includes(manu) ? 'active' :''}`}><Link href="#" onClick={()=>setSubManu(subManu === '/courses-item' ? '' : '/courses-item')}> Courses Detail</Link><span className="submenu-arrow"></span>
                                    <ul className={`submenu ${['/courses-item'].includes(subManu) ? 'open' : ''}`}>
                                        <li className={manu === '/course-detail' ? 'active' : ''}><Link href="/course-detail" className="sub-menu-item">Courses Detail</Link></li>
                                        <li className={manu === '/course-detail-two' ? 'active' : ''}><Link href="/course-detail-two" className="sub-menu-item">Courses Detail Two</Link></li>
                                    </ul>  
                                </li>
                            </ul>
                        </li>

                        <li className={manu === '/aboutus' ? 'active' : ''}><Link href="/aboutus" className="sub-menu-item">About Us</Link></li>

                        <li className={`has-submenu parent-parent-menu-item ${['/features','/pricing','/instructors','/faqs','/blogs','/blog-sidebar','/blog-detail'].includes(manu) ? 'active' : ''}`}>
                            <Link href="#" onClick={()=>setSubManu(subManu === '/page-item' ? '' : '/page-item')}>Pages</Link><span className="menu-arrow"></span>
                            <ul className={`submenu ${['/page-item','/auth-item','/blog-item','/special-item'].includes(subManu) ? 'open' : ''}`}>
                                <li className={manu === '/features' ? 'active' : ''}><Link href="/features" className="sub-menu-item">Features</Link></li>
                                <li className={manu === '/pricing' ? 'active' : ''}><Link href="/pricing" className="sub-menu-item">Pricing</Link></li>
                                <li className={manu === '/instructors' ? 'active' : ''}><Link href="/instructors" className="sub-menu-item">Instructors</Link></li>
                                <li className={manu === '/faqs' ? 'active' : ''}><Link href="/faqs" className="sub-menu-item">Faqs</Link></li>
                                <li className="has-submenu parent-menu-item"><Link href="#" onClick={()=>setSubManu(subManu === '/auth-item' ? '' : '/auth-item')}> Auth Pages </Link><span className="submenu-arrow"></span>
                                    <ul className={`submenu ${['/auth-item'].includes(subManu) ? 'open' : ''}`}>
                                        <li><Link href="/login" className="sub-menu-item">Login</Link></li>
                                        <li><Link href="/signup" className="sub-menu-item">Signup</Link></li>
                                        <li><Link href="/forgot-password" className="sub-menu-item">Reset Password</Link></li>
                                    </ul>  
                                </li>
                                <li className={`has-submenu parent-menu-item ${['/blogs','/blog-sidebar','/blog-detail'].includes(manu) ? 'active' : ''}`}><Link href="#" onClick={()=>setSubManu(subManu === '/blog-item' ? '' : '/blog-item')}> Blog </Link><span className="submenu-arrow"></span>
                                    <ul className={`submenu ${['/blog-item'].includes(subManu) ? 'open' : ''}`}>
                                        <li className={manu === '/blogs' ? 'active' : ''}><Link href="/blogs" className="sub-menu-item"> Blogs</Link></li>
                                        <li className={manu === '/blog-sidebar' ? 'active' : ''}><Link href="/blog-sidebar" className="sub-menu-item"> Blog Sidebar</Link></li>
                                        <li className={manu === '/blog-detail' ? 'active' : ''}><Link href="/blog-detail" className="sub-menu-item"> Blog Detail</Link></li>
                                    </ul> 
                                </li>
                                <li className="has-submenu parent-menu-item"><Link href="#" onClick={()=>setSubManu(subManu === '/special-item' ? '' : '/special-item')}> Special </Link><span className="submenu-arrow"></span>
                                    <ul className={`submenu ${['/special-item'].includes(subManu) ? 'open' : ''}`}>
                                        <li><Link href="/comingsoon" className="sub-menu-item">Comingsoon</Link></li>
                                        <li><Link href="/maintenance" className="sub-menu-item">Maintenance</Link></li>
                                        <li><Link href="/404" className="sub-menu-item">404! Error</Link></li>
                                    </ul>  
                                </li>
                            </ul>
                        </li>
                
                        <li className={manu === '/contactus' ? 'active' : ''}><Link href="/contactus" className="sub-menu-item">Contact Us</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
       
    </>
  )
}
