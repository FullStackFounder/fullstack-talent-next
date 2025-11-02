import React from 'react'

import { counterData } from '../data'

import Counter from './counter'

interface CounterData{
    value: number;
    symbol: string;
    title: string;
}

export default function Cta() {
  return (
    <section className="relative py-24 bg-no-repeat bg-center bg-fixed bg-cover" style={{backgroundImage:`url('/images/bg/2.jpg')`}}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container relative">
            <div className="grid lg:grid-cols-12 grid-cols-1 md:text-start text-center justify-center">
                <div className="lg:col-start-2 lg:col-span-10">
                    <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-2 items-center gap-6">
                        {counterData.map((item:CounterData,index:number)=>{
                            return(
                                <div className="counter-box text-center" key={index}>
                                    <h1 className="text-white lg:text-5xl text-4xl font-semibold mb-2"><Counter className="counter-value" value={item.value}/>{item.symbol}</h1>
                                    <h5 className="counter-head text-white uppercase font-medium">{item.title}</h5>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}
