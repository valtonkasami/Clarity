'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { setId } from '@/redux/features/userSlice'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

const Post = (props: any) => {
    const dispatch = useDispatch()
    const {id, userId, username, description, picturePath, userPicturePath} = props.data
    const [ show, setShow ] = useState(false)
    const redirect = (e: any) => {
        e.stopPropagation();
        window.location.href = `/user`;
      };

      const one = () => {
        if (picturePath) {
            return 'hover:border-red-600 cursor-pointer'
        } else return
      }

      const breakw = () => {
        if (picturePath) {
            return 'breakw'
        } else return 'breakt'
      }

      const revealPic = () => {
        if (picturePath) {
            return true
        } else return false
      }

  return (
    <div onClick={() => setShow(!show)} className='max-sm:w-full max-sm:px-3'>
        <div className={`bg-[#222222] py-2 px-2 max-sm:w-full w-[400px] border-2 border-[#444444] ${one()} rounded-[20px]`}>

            <div className='flex justify-center flex-col'>
                <div className='flex items-center'>

                <div className='flex'>
                <div className={`cursor-pointer h-14 w-14 border-[3px] border-[#444444] hover:border-red-600 rounded-full flex items-center justify-center overflow-hidden`}>
                {userPicturePath && <img alt='img' onClick={(e) => {redirect(e); dispatch(setId({id: userId}))}} className='h-full w-full object-cover' src={userPicturePath} />}
                {!userPicturePath && <img alt='img' onClick={(e) => {redirect(e); dispatch(setId({id: userId}))}} className='h-full w-full object-cover' src={`cat.jpg`} />}
                </div>
                <div className=''>
                    <h1 onClick={(e) => {redirect(e); dispatch(setId({id: userId}))}} className='cursor-pointer text-[silver] hover:text-red-500 font-[600] ml-2 mt-1 w-fit'>{username}</h1>
                    <p className={`text-white ml-3 ${breakw()} mr-5`}>{description}</p>
                </div>
                </div>
                {revealPic() && <FontAwesomeIcon className='text-[silver] text-2xl' icon={faImage} />}
                </div>

                {picturePath && show && <div onClick={() => setShow(!show)} className='border-4 border-[#555555] rounded-[20px] overflow-hidden mt-5 flex justify-center items-center'>
                <img alt='img' className='' src={picturePath} />
                </div>}
                
            </div>
        </div>
    </div>
  )
}

export default Post
