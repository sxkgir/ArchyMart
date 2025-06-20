
import { Link } from "react-router-dom";
import { LeftSideBar } from "../Components/Sidebar";
export function HomePage() {
    return(
    <>
        <div>
            <div className="lg:max-w-[270px] md:max-w-[200px] sm:max-w-[150px]">
                <LeftSideBar />
            </div>
            <div>

            </div>
        </div>
    </>
    )
}
