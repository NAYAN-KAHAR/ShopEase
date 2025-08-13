'use client';
import Link from "next/link";
import { useEffect, useState, useContext, use } from "react";
import { IoMenuSharp, IoCloseSharp } from "react-icons/io5";
import { FaUserCheck } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { MdProductionQuantityLimits } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiSignOut } from "react-icons/pi";
import axios from "axios";

import { isLoggedIn } from "../app/ContextApi/form";
import { useRouter } from 'next/navigation';
import Card from "./card";


const Navbar = () => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasUser, setHasUser] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState(null);
    const [ref,setRef] = useState(false);


    const formContext = useContext(isLoggedIn);
     // Check if the user is logged in (also handle state update on login/signup)
    useEffect(() => {
        const updateUserStatus = () => {
            const hasUserName = localStorage.getItem('userName');
            const isRole = localStorage.getItem('userRole');
            const isEmail = localStorage.getItem('userEmail');
            if (hasUserName && isRole && isEmail) {
                setRole(isRole);
                setEmail(isEmail);
                setHasUser(true);
            } else {
                setHasUser(false);
            }
        };
        // Initial check on component mount
        updateUserStatus();
        // Listen for changes in `localStorage`
        window.addEventListener('storage', updateUserStatus);
        // Cleanup the event listener
        return () => {
            window.removeEventListener('storage', updateUserStatus);
        };
    }, []);


    const ShowForm = () => {
        // if (!formContext) return console.warn("Form context not found");
        if(hasUser){
            setShowUserMenu(!showUserMenu);
            return;
        };
        formContext.setIsLogin(!formContext.isLogin);
  
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 639);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMenuToggle = () => {
        setIsMenuOpen(prev => !prev);
    };

const handleSignOut = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setShowUserMenu(!showUserMenu);
    setHasUser(false);
    router.push('/');
};

useEffect(() => {
    setRef(!ref);
},[hasUser]);

const handleRoute = (category) => {
    router.push(`/?category=${category}`);
}

    return (
        <>
        <div className="w-full bg-white  shadow-sm z-50">
            <div className="py-3 px-3 flex justify-between items-center">
                <Link href={'/'}><h1 className="text-xl font-extrabold cursor-pointer">SHOP.CO</h1></Link>

                {isMobile ? (
                    <div onClick={handleMenuToggle} className="cursor-pointer">
                        {isMenuOpen ? <IoCloseSharp size={30} /> : <IoMenuSharp size={30} />}
                    </div>
                ) : (
                    <>
                     <div className="flex items-center">
                        <ul className="flex gap-6 font-bold items-center">
                           <Link href={'/Shop'}> 
                           <li className="cursor-pointer">AllProducts</li>
                           </Link>
                            <li className="cursor-pointer" onClick={() => handleRoute('Electronics')}>Electronics</li>
                             <li className="cursor-pointer" onClick={() => handleRoute('Watches')}>Watches</li>
                              <li className="cursor-pointer" onClick={() => handleRoute('Jewelry')}>Jewelry</li>
                           
                        </ul>
                     </div>

                     <div className="relative">
              <div className="font-bold cursor-pointer" onClick={ShowForm}>
               {hasUser ? <FaUserCheck size={30}/> : 'Account'}
          </div>

  {showUserMenu && (
    <div className="absolute top-10 right-0 bg-white shadow-lg p-2 rounded w-48 z-50">
      <ul className="flex flex-col gap-3 font-semibold">
        {email && 
        <li className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer border-b border-gray-200 flex items-center gap-2">
           <FaUserCheck size={20}/>
           <span>{email}</span>
        </li> }

        {role === 'admin' && <Link href={'/SellerDB'}>
        <li className="flex items-center gap-2 text-sm hover:bg-gray-100 p-2 rounded cursor-pointer border-b border-gray-200">
          <LuLayoutDashboard size={15}/><span>DashBoard </span></li>
        </Link>}

       <Link href="/myCard">
  <li className="text-sm flex items-center gap-2 p-2 rounded border-b border-gray-200 cursor-pointer hover:bg-gray-100">
      <MdProductionQuantityLimits size={20} className="ml-1" /> <span>My Card</span>
  </li>
</Link>

              <Link href={'/myOrder'}>
             <li className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="M160-160v-516L82-846l72-34 94 202h464l94-202 72 34-78 170v516H160Zm240-280h160q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520H400q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440ZM240-240h480v-358H240v358Zm0 0v-358 358Z"/></svg> <span>My Order</span>
              </li>
            </Link>

        <li className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer border-b border-gray-200" onClick={handleSignOut}> ↩️  Sign out</li>
      </ul>
    </div>
  )}
</div>
                    </>
                )}
            </div>
                  
            {/* Mobile menu dropdown */}
            {isMobile && isMenuOpen && (
  <div className="relative"> {/* container must be relative for absolute positioning */}
  <div className="absolute top-full left-0 w-full px-6 pb-4 flex flex-col items-center justify-center bg-white z-50 shadow-md">
    <ul className="flex flex-col gap-4 font-semibold items-center">
     <Link href={'/Shop'}><li className="cursor-pointer text-center">Shop</li></Link>
                             <li className="cursor-pointer">Electronics</li>
                             <li className="cursor-pointer">Watches</li>
                              <li className="cursor-pointer">Jewelry</li>



      {/* Account Icon with Dropdown */}
      <li className="relative cursor-pointer text-center">
        <div onClick={ShowForm} className="flex justify-center">
          {hasUser ? <FaUserCheck size={25} /> : 'Account'}
        </div>

        {showUserMenu && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white shadow-lg p-4 rounded w-48 z-50">
            <ul className="flex items-center flex-col gap-3 font-semibold">
                 {email && 
        <li className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer border-b border-gray-200 flex items-center gap-2">
           <FaUserCheck size={20}/>
           <span>{email}</span>
        </li> }


        {role === 'admin' && <Link href={'/SellerDB'}>
        <li className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer border-b border-gray-200">🛒 DashBoard</li>
        </Link>}

          <Link href={'/myCard'}><li className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer flex items-center gap-2 ">
           <MdProductionQuantityLimits size={18} className="ml-1" /> <span>My Card</span></li></Link>

            <Link href={'/myOrder'}>
             <li className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="M160-160v-516L82-846l72-34 94 202h464l94-202 72 34-78 170v516H160Zm240-280h160q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520H400q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440ZM240-240h480v-358H240v358Zm0 0v-358 358Z"/></svg> <span>My Order</span>
              </li>
            </Link>
              <li className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer"> ↩️ Sign out</li>
            </ul>
          </div>
        )}
      </li>
    </ul>
  </div>
  </div>
)}

        </div>

         
</>
    );
};

export default Navbar;
