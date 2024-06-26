import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { Sidebar } from "flowbite-react";
import {HiUser, HiArrowSmRight} from 'react-icons/hi'
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from 'react-redux'

export default function DashSidebar() {
    const location = useLocation()
    const [tab,setTab] =  useState('')
    const  dispatch = useDispatch()
    const handleSignout = async () => {
        try{
            const res = await fetch('/api/user/signout', {
                method:'POST',
            });
            const data = await res.json()
            if(!res.ok){
                console.log(data.message)
            }else{
                dispatch(signoutSuccess())
            }
        }catch(error){
            console.log(error.message)
        }
    }
  
    useEffect(()=> {
      const urlParams = new URLSearchParams(location.search)
      const tabFromUrl = urlParams.get('tab')
      if(tabFromUrl){
        setTab(tabFromUrl)
      }
    }, [location.search])
    return (
        <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link  to='/dashboard?tab=profile'>
                        <Sidebar.Item active={tab==='profile'} icon={HiUser} label={'User'} labelColor='dark' as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item  icon={HiArrowSmRight}className='cursor-pointer' onClick={handleSignout}>
                        Sign out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}
