'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setLogout } from '@/redux/features/jwtSlice'
import { RootState } from '@/redux/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSearch, faHome } from '@fortawesome/free-solid-svg-icons'
import { setId } from '@/redux/features/userSlice'

const Navbar = () => {
  interface UserData {
    picturePath: string;
    username: string;
    id: string
    
  }
 

  const [hide, setHide] = useState('hidden')
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [response, setResponse] = useState<UserData[]>([])
  const [responseBool, setResponseBool] = useState(false)
  const jwtToken = useSelector((state: RootState) => state.jwtSlice.tokena)
  const user = useSelector((state: RootState) => state.jwtSlice.user)

  const openSearch = () => {
    if (!open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
  };

  const closeSearch = () => {
    document.body.style.overflow = 'auto';
  };

  const line = (index: any) => {
    if (index === response.length -1) {
      return 
    } else return 'border-b-2'
  }

  const height = (array: any) => {
    if (array.length > 4) {
      return 'h-[389px]'
    } else return
  }

  const jwtBoolean = () => {
    if (jwtToken === '') {
      return true
    } else {
      return false
    } 
}

const jwtBoolean2 = () => {
  if (jwtToken === '') {
    return false
  } else {
    return true
  } 
}

const handleClick = () => {
  if (hide === 'hidden') {
    setHide('')
  } else {setHide('hidden')}
}

useEffect(() => {
  if (jwtToken) {
    fetchInput()
  }
}, [search])

const fetchInput = async () => {
  try {
    const url = `https://clarity-backend.vercel.app/users/${search}/search`;
    const usersResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!usersResponse.ok) {
      throw new Error('Posts request failed');
    } 

    const userData = await usersResponse.json();
    setResponse(userData)
    setResponseBool(true)
    if (userData.length === 0) {
      setResponseBool(false)
    }
    
  } catch (error) {
    
    setResponseBool(false)
    setResponse([])
  }
}

  return (
    <div className='w-full'>
      <div className='fixed top-0 w-full'>
       {jwtBoolean() && <div className='bg-[#111111] flex items-center justify-center border-b-2 border-[#444444] hover:border-red-600 h-[75px] w-full'>
            <div>
                <a href='/'><h1 className='text-white text-4xl font-bold bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full border- border-'>Clarity</h1></a>
            </div>
        
        </div>}

        {jwtBoolean2() && <div className='bg-[#111111] px-5 flex items-center justify-between border-b-2 border-[#444444] hover:border-red-600 h-[75px] w-full'>
            <div>
                <a href='/'><h1 className='text-white text-4xl font-bold bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full border- border-'>Clarity</h1></a>
            </div>

            <input onChange={(e) => setSearch(e.target.value)} value={search} type='text' className='max-sm:hidden absolute left-[200px] rounded-full bg-black border-2 border-[#555555] hover:border-red-600 focus:border-red-600 h-8 w-[250px] pl-3 text-white' placeholder='Search Someone...'/>
            
            {responseBool && <a href='/user'><div className=' max-sm:hidden absolute top-[75px] left-[145px] w-[355px] overflow-hidden border-x-2 border-b-2 border-[#555555]  rounded-b-[20px] bg-[#111111]'><div className={` ${height(response)} overflow-auto drop-shadow-[0_20px_20px_rgba(0,0,0,1)] text-white px-3 w-[350px]  border-red-600  rounded-b-[20px]`}>
              {response.map((e, i) => (
                <div key={i} onClick={() => { dispatch(setId({ id: e.id })) }} className={`flex hover:text-red-500 items-center ${line(i)} border-[#666666] pb-5 pt-5`}>
                  <div className='h-14 mr-3 w-14 border-[3px] border-[#444444] hover:border-red-600 rounded-full flex items-center justify-center overflow-hidden'>
                { e.picturePath && <img alt='img' className='h-full w-full object-cover' src={e.picturePath} />}
                { !e.picturePath && <img alt='img' className='h-full w-full object-cover' src='cat.jpg'/>}
                </div>
                <p className='font-bold'>{e.username}</p>
                </div>
              ))}
            </div></div></a>}
            <div className='space-x-2'>
            <button onClick={() => {openSearch(); setOpen(!open)}} className='sm:hidden bg-[#555555] hover:bg-red-600 h-10 w-10 rounded-full'> <FontAwesomeIcon className='text-2xl text-white' icon={faSearch}/> </button>
            <a href='/'><button className='bg-[#555555] hover:bg-red-600 h-10 w-10 rounded-full'> <FontAwesomeIcon className='text-2xl text-white' icon={faHome}/> </button></a>
            <button onClick={() => {handleClick(); setOpen(false); closeSearch()}} className='bg-[#555555] hover:bg-red-600 h-10 w-10 rounded-full'> <FontAwesomeIcon className='text-2xl text-white' icon={faUser}/> </button>
            </div>
        
        </div>}
        {jwtBoolean2() && <div onClick={() => setHide('hidden')} className={`${hide} h-full z-[20] top-0 left-0 w-full fixed`}></div>}
        {jwtBoolean2() && <div className={`${hide} absolute z-[30] right-5 mt-5`}>
          <div className='bg-[#222222] text-[silver] font-bold items-center justify-center space-y-[14px] flex flex-col border-4  rounded-[20px] h-[120px] border-red-600 w-[120px]'>
            <a href='/user'><div onClick={() => {dispatch(setId({id: user.id}))}} className='cursor-pointer hover:bg-red-600 hover:text-white w-[70px] rounded-full h-6 flex justify-center items-center bg-[#555555]'><button>Profile</button></div></a>
            <hr className='border-2 w-full border-[#444444]'/>
            <a href='/'><div onClick={() => {dispatch(setLogout()); handleClick()}} className='cursor-pointer hover:bg-red-600 hover:text-white w-[80px] rounded-full h-6 flex justify-center items-center bg-[#555555]'><button>Log Out</button></div></a>
          </div>

          </div>}    
          </div>

          {user && open && <div className='flex sm:hidden z-30 justify-center mt-[75px] fixed w-full top-0 left-0 z-40'>
           <input onChange={(e) => setSearch(e.target.value)} value={search} type='text' className='sm:hidden px-3 bg-[#111111] border-b-2 border-[#444444] hover:border-red-600 focus:border-red-600 h-10 w-full pl-3 text-white' placeholder='Search Someone...'/>
                
           {<div className='sm:hidden h-fit absolute top-10 left-0 w-full overflow-hidden border-x-2 border-b-2 border-[#555555] rounded-b-[20px] bg-[#111111]' style={{height: 'calc(100vh - 115px)'}}><div className={`h-[83vh] overflow-auto drop-shadow-[0_20px_20px_rgba(0,0,0,1)] text-white px-3 w-full  border-red-600  rounded-b-[20px]`} style={{height: 'calc(100vh - 115px)'}}>
              {response.map((e, i) => (
                <a key={i} href='/user'>
                <div key={i} onClick={() => { dispatch(setId({ id: e.id })) }} className={`flex hover:text-red-500 items-center ${line(i)} border-[#666666] pb-5 pt-5`}>
                  <div className='h-14 mr-3 w-14 border-[3px] border-[#444444] hover:border-red-600 rounded-full flex items-center justify-center overflow-hidden'>
                { e.picturePath && <img alt='img' className='h-full w-full object-cover' src={e.picturePath} />}
                { !e.picturePath && <img alt='img' className='h-full w-full object-cover' src='cat.jpg'/>}
                </div>
                <p className='font-bold'>{e.username}</p>
                </div>
                </a>
              ))}
            </div></div>}
          </div>}
         
    </div>
  )
}

export default Navbar