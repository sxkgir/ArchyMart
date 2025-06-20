
import CartIcon from '../assets/Cart.svg?react'
import Box from '../assets/Box.svg?react'
import Profile from '../assets/Profile.svg?react'
import Bar from '../assets/Bar.svg?react'
import Chat from '../assets/Chat.svg?react'
import Logo from '../assets/Logo.svg?react'
export function LeftSideBar(){
    return(
        <>
        <div className="h-screen">
            <div className="flex p-[10px] items-center gap-[10px] font-extrabold text-[max(2vw,3px)] justify-center">
                <Logo className="w-15 h-15" />    
                ArchyMart  
            </div>
            <div className="flex flex-col h-[100%] bg-[#242730] pt-6 md:pt-4 lg:pt-5 text-[#5e6268] pl-[5%]">
                <div className='flex gap-[6%] py-[10%] items-center '>
                    <CartIcon className="w-7 h-7"/>
                    Order
                </div>
                <div className='flex gap-[5%] py-[10%] items-center'>
                    <Box className="w-7.5 h-7.5 fill-[#5e6268]"/>
                    Your Orders
                </div>
                <div className='flex gap-[5%] py-[10%] items-center'>
                    <Profile className="w-7 h-7"/>
                    My Profile
                </div>
                <div className='flex gap-[5%] py-[10%] pl-[1%]'>
                    <Bar className="w-7 h-7"/>
                    Polls
                </div>
                <div className='flex gap-[5%] py-[10%] pl-[1%]'>
                    <Chat className="w-7 h-7 fill-[#5e6268]"/>

                    Contact
                </div>
            </div>

        </div>
        </>
    )
}