import React from 'react';
import Logo from '../assets/Logo.svg?react'
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#202225] flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white rounded-2xl shadow-lg overflow-hidden w-full max-w-md md:max-w-lg min-w-[320px]">
        <div className="flex items-center justify-center bg-gray-900 p-6">
          
          <Logo className="size-16 md:size-20 lg:size-24 shrink-0" />    

          <h1 className="ml-3 text-4xl font-semibold">ArchyMart</h1>
        </div>
        <div className="p-8 ">
          <p className="text-gray-300 mb-4">
            Archymart uses <span className="font-medium">RPI</span> RCS Authentication via Cisco Duo.
          </p>
          <p className="text-gray-400 mb-6">
            Contact <a href="mailto:jiangh8@rpi.edu" className="text-blue-400 hover:underline">jiangh8@cs.rpi.edu</a> if you have any techincal problems or questions.
          </p>
          <p className="text-gray-400 mb-6">
            For any Inventory or Product specific questions contact <a href="mailto:jiangh8@rpi.edu" className="text-blue-400 hover:underline">bergmw@rpi.edu</a>
          </p>
          <div className='gap-y-5 flex-col flex'>
            <Link
              to="/login/staff"

              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            >
              Log in for Staff
            </Link>
            <Link
              to="/login/student"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            >
              Log in for Architecture Students
            </Link>
          </div>
        </div>
        <div className="bg-gray-900 text-gray-500 text-center py-3 text-sm">
          © 2025 Archymart | An RCOS project
        </div>
      </div>
    </div>
  );
}
