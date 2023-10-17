"use client";
import Image from 'next/image';
import React from 'react'

import Logo from "@/assets/logo/logo_light.svg"
import { signIn } from 'next-auth/react';

type Props = {}

export default function Login({ }: Props) {
    return (
        <div className={`w-full h-full
            bg-gradient-to-br from-emerald-100 to-emerald-800
            flex flex-col sm:flex-row-reverse
        `}>

            <div className='background flex-grow'></div>

            <div className={`content min-h-[70%] p-8 bg-white rounded-t-[2.5rem]
                flex flex-col w-full sm:max-w-[500px] sm:rounded-tl-none sm:rounded-r-[2.5rem]
                shadow-2xl
            `}>

                <div className='w-full grid place-items-center'>
                    <Image
                        src={Logo}
                        alt='Logo'
                        height={25 * 1.25}
                        width={170 * 1.25}
                    />
                </div>

                <div className='w-full mt-8 text-center'>
                    <h1 className='text-xl sm:text-2xl font-semibold text-muted-foreground my-2 mb-6'>
                        Welcome to GrowItRapid Admin Dashboard
                    </h1>

                    <p className='font-medium text-muted-foreground'>
                        It seems like you&apos;re not signed in on growitrapid.com.
                        Please sign in to continue if you are a GrowItRapid employee.
                    </p>

                    <p className='mt-1 font-medium text-muted-foreground'>
                        Once you&apos;re signed in there, you&apos;ll be able to sign in here.
                    </p>

                    <div className='mt-8'>
                        <a
                            href='https://www.growitrapid.com/auth/signin'
                            target='_blank'
                            rel='noreferrer'
                            className='block w-full px-4 py-4 font-medium text-white rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-lg sm:text-base'
                        >
                            Sign In on growitrapid.com
                        </a>
                    </div>

                    <p className='mt-8 font-medium text-xs text-muted-foreground'>
                        For Development Purposes Only
                    </p>

                    <button
                        className='block w-full px-4 py-4 font-medium text-white rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-lg sm:text-base'
                        onClick={e => {
                            signIn('google', { redirect: false })
                        }}
                    >
                        Sign In with Google
                    </button>
                </div>

            </div>

        </div>
    )
}