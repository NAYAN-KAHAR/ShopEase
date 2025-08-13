
'use client';
import { useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { isLoggedIn } from "../ContextApi/form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from 'next/navigation';

const FormPage = () => {
    const router = useRouter(); 
    const [isSignUp, setisSignUp] = useState(false);
    
    const formContext = useContext(isLoggedIn);

    const[name, setName] = useState();
    const[email, setEmail] = useState();
    const[password, setPassword] = useState();
    const [role, setRole] = useState('user'); // default to user

    // console.log('isSignUp', isSignUp);


    const handleSumbit = async (e) => {
        e.preventDefault();
        console.log(name,email,password,role);
        if(!email  ||!role) return alert('fields are required');
        try{
            let res;
            if(isSignUp){
                  res = await axios.post(`/api/auth/signup`, {name,email,password,role });
            }else{
                 res = await axios.post(`/api/auth/login`, { email, role });
            }
            console.log(res.data.user);
            if(res.data.user){
                localStorage.setItem('userName', res.data.user?.name);
                localStorage.setItem('userEmail', res.data.user.email);
                localStorage.setItem('userRole', res.data.user.role);
                localStorage.setItem('userId', res.data.user._id);
                toast.success(res.data);
                router.push('/Shop')
            }

           setTimeout(() => {
             if(res.data.error) {
                toast.error(res.data.error);
                return;
             }
               toast.success(res.data);
               setisSignUp(!isSignUp);
               formContext.setIsLogin(!formContext.isLogin);
              
           },2000);
        }catch(err){
            console.log(err);
        }

    };

    /*
    const userRole = localStorage.getItem('userRole');
if (userRole === 'admin') {
  router.push('/admin/dashboard');
} else {
  router.push('/user/home');
}

    */

    return(
        <>
        <ToastContainer />
     {formContext.isLogin && (
          <div className="fixed inset-0 z-50 flex justify-center items-center form " >
         <div className="p-1 px-6 bg-white shadow rounded-lg w-[90%] max-w-md">
            <div className="text-2xl font-bold text-right">
                <a href="#" onClick={() => formContext.setIsLogin(!formContext.isLogin)}>X</a>
            </div>
            <h1 className="text-xl font-bold text-center">Sign in to Quick Card e-commerce</h1>
            <p className="text-sm p-1 mt-1 text-gray-600 text-center"> Welcome back! Please sign on to continue</p>

            <div className="flex gap-6 p-2 shadow-lg items-center justify-center mt-1 rounded-lg cursor-pointer">
                <FcGoogle size={30}/>
                <p className="text-semibold">Continue with Google</p>
            </div>

            <div className="flex justify-center items-center mt-2">
      <label className="mr-2 text-sm font-semibold">Login as:</label>
     <select value={role} onChange={(e) => setRole(e.target.value)} className="bg-gray-100 p-2 border rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
      </select>
    </div>


            <div className="flex w-[100%] gap-2 items-center mt-2">
                <div className="w-[48%] h-0.5 bg-gray-400"></div><p className="font-semibold">or</p>
                 <div className="w-[48%] h-0.5 bg-gray-400"></div>
            </div>

            <form onSubmit={handleSumbit}>
                 {isSignUp &&  <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="name" className="text-sm font-semibold">Full Name </label>
                <input type="text" id="name" onChange={(e) => setName(e.target.value)} placeholder="Enter Name " className=" p-2 outline-none border border-gray-300 rounded-lg"/>
            </div>
          }

            <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="email" className="text-sm font-semibold">Email Adress</label>
                <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email " className="p-2 outline-none border border-gray-300 rounded-lg"/>
            </div>

             {isSignUp &&  <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="pass" className="text-sm font-semibold">Password</label>
                <input type="password" id="pass" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" className=" p-2 outline-none border border-gray-300 rounded-lg"/>
            </div>
            }

           {isSignUp && (
  <div className="flex gap-2 mt-2">
    <label className="text-sm font-semibold">Select Role: </label>
    <div className="flex gap-4 items-center">
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="role" value="user"
          checked={role === 'user'}
          onChange={(e) => setRole(e.target.value)}
          className="accent-gray-700"
        />
        <span className="text-sm">User</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="radio" name="role" value="admin"
          checked={role === 'admin'}
          onChange={(e) => setRole(e.target.value)}
          className="accent-gray-700"
        />
        <span className="text-sm">Admin</span>
      </label>
    </div>
  </div>
)}
   <div className="mt-4">
                <button type="submit"  className="w-full py-2 bg-gray-800 text-white cursor-pointer hover:bg-gray-700 rounded">Continue ▶</button>
            </div>

            </form>
            <div className="p-3 shadow flex gap-3 items-center justify-center">
                <p>Don't have an account?  <span className="font-semibold cursor-pointer" 
                onClick={() => setisSignUp(!isSignUp)}>{isSignUp ? 'Login now':'Sign up'}</span></p>
            </div>
        </div>
    </div>
     )

     }

        </>
    )}

export default FormPage;