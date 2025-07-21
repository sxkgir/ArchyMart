
import { Link } from "react-router-dom";
import { LeftSideBar } from "../Components/Sidebar";
import { OrderContent } from "../Components/Order";
export function HomePage() {

    return(
    <>
        <div className="flex">
            <div className="lg:max-w-[270px] md:max-w-[200px] sm:max-w-[150px]">
                <LeftSideBar />
            </div>
            <div className="flex flex-col w-[100%] h-screen">
                <div className="flex items-center h-[80px] bg-[#f4f4f461] w-[100%] pl-[2.5%] text-[#484848c3] text-[20px] font-bold">
                    Order
                </div>
                <div className="bg-[#efefef] h-[calc(100%-(80px))] p-[3%]">
                    <div className="">
                        <OrderContent/>
                    </div>

                    
                </div>

            </div>
        </div>
    </>
    )
}
