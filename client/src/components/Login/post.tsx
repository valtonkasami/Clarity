'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { setId } from '@/redux/features/userSlice'
import { useDispatch } from 'react-redux'
import { width } from '@fortawesome/free-solid-svg-icons/fa0'
const Post = (props: any) => {
    const dispatch = useDispatch()
    const {id, userId, username, description, picturePath, userPicturePath} = props.data
    const [ show, setShow ] = useState(false)
    const redirect = (e: any) => {
        e.stopPropagation();
        window.location.href = `/user`;
      };

  return (
    <div onClick={() => setShow(!show)} className='cursor-pointer max-sm:w-full max-sm:px-3'>
        <div className='bg-[#222222] py-2 px-2 max-sm:w-full w-[400px] border-2 border-[#444444] hover:border-red-600 rounded-[20px]'>

            <div className='flex justify-center flex-col'>

                <div className='flex'>
                <div className='h-14 w-14 border-[3px] border-[#444444] hover:border-red-600 rounded-full flex items-center justify-center overflow-hidden'>
                {userPicturePath && <img alt='img' onClick={(e) => {redirect(e); dispatch(setId({id: userId}))}} className='h-full w-full object-cover' src={`http://localhost:3000/assets/${userPicturePath}`} />}
                {!userPicturePath && <img alt='img' onClick={(e) => {redirect(e); dispatch(setId({id: userId}))}} className='h-full w-full object-cover' src={`cat.jpg`} />}
                </div>
                <div className=''>
                    <h1 onClick={redirect} className='text-[silver] hover:text-red-500 font-[600] ml-2 mt-1 w-fit'>{username}</h1>
                    <p className='text-white ml-3 breakw' style={{}}>{description}</p>
                </div>
                </div>

                {picturePath && show && <div onClick={() => setShow(!show)} className='border-4 border-[#555555] rounded-[20px] overflow-hidden mt-5'>
                <img alt='img' className='' src={`http://localhost:3000/assets/${picturePath}`} />
                </div>}
                
            </div>
        </div>
    </div>
  )
}

export default Post