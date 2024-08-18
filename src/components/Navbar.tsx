import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import Link from 'next/link'
import { buttonVariants } from './ui/button';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className='sticky z-[100] h-14 inseet-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold" >
            Aniket&apos;s<span className='text-red-600'>ChatBot</span>
          </Link>
          <div className='h-full flex items-center space-x-4'>
            {user ?
              <Link
                href="/api/auth/logout"
                className={buttonVariants({ size: "sm", variant: "ghost" })}>
                Sign Out
              </Link> :
              <>
                <Link
                  href="/api/auth/register"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}>
                  Sign Up
                </Link>
                <div className='h-8 w-px bg-zinc-200 hidden sm:block' />
                <Link
                  href="/api/auth/login"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}>
                  Login
                </Link>
              </>
            }
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar 
