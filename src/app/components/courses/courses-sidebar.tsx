'use client'
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function CoursesSidebar() {
    const [value1, setValue1] = useState(50);
    const [value2, setValue2] = useState(120);

    const handleChange1 = (event:any) => {
        setValue1(event.target.value);
      };
    
      const handleChange2 = (event:any) => {
        setValue2(event.target.value);
      };

  return (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-md shadow shadow-slate-100 dark:shadow-slate-800 sticky top-20">
            <form>
                <div>
                    <label htmlFor="searchname" className="font-semibold">Search Course</label>
                    <div className="relative mt-2">
                        <FiSearch className="absolute top-[10px] start-3 size-5"/>
                        <input name="search" id="searchname" type="text" className="w-full py-2 px-3 border border-slate-100 dark:border-slate-800 focus:border-violet-600/30 dark:focus:border-violet-600/30 bg-transparent focus:outline-none rounded-md h-10 ps-10" placeholder="Search"/>
                    </div>
                </div>
            </form>

            <div className="mt-6">
                <label className="font-semibold">Categories</label>
                <div className="block">
                    <div className="flex justify-between mt-2">
                        <div className="inline-flex items-center mb-0">
                            <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-300 focus:ring focus:ring-offset-0 focus:ring-violet-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="Designing"/>
                            <label className="form-checkbox-label text-slate-400" htmlFor="Designing">Web Designing</label>
                        </div>

                        <span className="bg-violet-600/10 text-violet-600 text-xs px-2.5 py-0.5 font-semibold rounded-full h-5">3</span>
                    </div>

                    <div className="flex justify-between mt-2">
                        <div className="inline-flex items-center mb-0">
                            <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-300 focus:ring focus:ring-offset-0 focus:ring-violet-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="Development"/>
                            <label className="form-checkbox-label text-slate-400" htmlFor="Development">Web Development</label>
                        </div>

                        <span className="bg-violet-600/10 text-violet-600 text-xs px-2.5 py-0.5 font-semibold rounded-full h-5">7</span>
                    </div>

                    <div className="flex justify-between mt-2">
                        <div className="inline-flex items-center mb-0">
                            <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-300 focus:ring focus:ring-offset-0 focus:ring-violet-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="Freelancing"/>
                            <label className="form-checkbox-label text-slate-400" htmlFor="Freelancing">Freelancing</label>
                        </div>

                        <span className="bg-violet-600/10 text-violet-600 text-xs px-2.5 py-0.5 font-semibold rounded-full h-5">4</span>
                    </div>

                    <div className="flex justify-between mt-2">
                        <div className="inline-flex items-center mb-0">
                            <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-300 focus:ring focus:ring-offset-0 focus:ring-violet-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="Marketing"/>
                            <label className="form-checkbox-label text-slate-400" htmlFor="Marketing">Marketing</label>
                        </div>

                        <span className="bg-violet-600/10 text-violet-600 text-xs px-2.5 py-0.5 font-semibold rounded-full h-5">6</span>
                    </div>

                    <div className="flex justify-between mt-2">
                        <div className="inline-flex items-center mb-0">
                            <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-300 focus:ring focus:ring-offset-0 focus:ring-violet-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="Meditation"/>
                            <label className="form-checkbox-label text-slate-400" htmlFor="Meditation">Meditation</label>
                        </div>

                        <span className="bg-violet-600/10 text-violet-600 text-xs px-2.5 py-0.5 font-semibold rounded-full h-5">7</span>
                    </div>

                    <div className="flex justify-between mt-2">
                        <div className="inline-flex items-center mb-0">
                            <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-300 focus:ring focus:ring-offset-0 focus:ring-violet-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="Music"/>
                            <label className="form-checkbox-label text-slate-400" htmlFor="Music">Music</label>
                        </div>

                        <span className="bg-violet-600/10 text-violet-600 text-xs px-2.5 py-0.5 font-semibold rounded-full h-5">44</span>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <label className="font-semibold">Pricing</label>

                <div className="range-slider mt-3">
                    <span className="flex justify-between pb-2">
                        <span>
                            <label htmlFor="" className="text-lg">$</label>
                            <input type="number" className="text-slate-400" defaultValue={value1} min="0" max="200"/>
                        </span>

                        <span>
                            <label htmlFor="" className="text-lg">$</label>
                            <input type="number" className="text-slate-400" defaultValue={value2} min="0" max="200"/>
                        </span>
                    </span>
                    <input type="range" value={value1} min={0} max={200} step={5} onChange={handleChange1}/>
                    <input type="range" value={value2} min={0} max={200} step={5} onChange={handleChange2}/>
                </div>
            </div>

            <div className="mt-6">
                <label className="font-semibold">Levels</label>
                <div className="block">
                    <div className="flex justify-between mt-2">
                        <div className="inline-flex items-center mb-0">
                            <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-300 focus:ring focus:ring-offset-0 focus:ring-violet-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="Begining"/>
                            <label className="form-checkbox-label text-slate-400" htmlFor="Begining">Begining</label>
                        </div>
                    </div>

                    <div className="flex justify-between mt-2">
                        <div className="inline-flex items-center mb-0">
                            <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-300 focus:ring focus:ring-offset-0 focus:ring-violet-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="Intermediate"/>
                            <label className="form-checkbox-label text-slate-400" htmlFor="Intermediate">Intermediate</label>
                        </div>
                    </div>

                    <div className="flex justify-between mt-2">
                        <div className="inline-flex items-center mb-0">
                            <input className="form-checkbox rounded border-gray-200 dark:border-gray-800 text-violet-600 focus:border-violet-300 focus:ring focus:ring-offset-0 focus:ring-violet-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="Expert"/>
                            <label className="form-checkbox-label text-slate-400" htmlFor="Expert">Expert</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
