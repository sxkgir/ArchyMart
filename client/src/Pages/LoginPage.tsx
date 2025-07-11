import React from 'react';
import Logo from '../assets/Logo.svg?react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#202225] flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden max-w-31/100   w-full">
        <div className="flex items-center justify-center bg-gray-900 p-6">
          
          <Logo className="w-30 h-30" />    

          <h1 className="ml-3 text-4xl font-semibold">ArchyMart</h1>
        </div>
        <div className="p-8 ">
          <p className="text-gray-300 mb-4">
            Archymart uses <span className="font-medium">RPI</span> RCS Authentication via Cisco Duo.
          </p>
          <p className="text-gray-400 mb-6">
            Contact <a href="mailto:jiangh8@rpi.edu" className="text-blue-400 hover:underline">jiangh8@cs.rpi.edu</a> if you have problems or questions.
          </p>
          <button
            onClick={() => {
              // handle redirect to Duo login
              window.location.href = '/auth/duo';
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login with your RCS ID via Duo
          </button>
        </div>
        <div className="bg-gray-900 text-gray-500 text-center py-3 text-sm">
          © 2025 Archymart | An RCOS project
        </div>
      </div>
    </div>
  );
}
