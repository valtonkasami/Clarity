'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { Register } from '..'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setLoginRedux, setLogout, setPosts } from '@/redux/features/jwtSlice'
import { useDropzone } from 'react-dropzone';
import Post from './post'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons' 
const Login = () => {
    const dispatch = useDispatch()
    const jwtToken = useSelector((state: RootState) => state.jwtSlice.tokena)
    const user = useSelector((state: RootState) => state.jwtSlice.user)
    const posts = useSelector((state: RootState) => state.jwtSlice.posts)
    const [login, setLogin] = useState(true)
    const [register, setRegister] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showError, setShowError] = useState(false)
    const [ title, setTitle ] = useState('')
    const [picturePath, setPicturePath] = useState<File | null>(null)
    const [loginTruth, setLoginTruth] = useState(false)

    const handleInputChange = (e: any) => {
      const value = e.target.value;
      setUsername(value.startsWith('@') ? value : `@${value}` );
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const data = {
          username,
          password,
        };
    
        
        const url = 'http://localhost:3000/auth/login'
        
        
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };
        
        
        try {
          setLoginTruth(false)
          const response = await fetch(url, requestOptions);
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const responseData = await response.json();

          dispatch(setLoginRedux({ user: responseData.user, token: responseData.token }));


    

        // posts
        const id = responseData.user.id
        const url2 = `http://localhost:3000/posts/${id}`;
        const jwt = responseData.token
        await fetchPosts(url2, jwt);

        } catch (error) {
          setLoginTruth(true)
          console.error('Error:', error);
        }
      };

      useEffect(() => {
        const fetchData = async () => {
          if (jwtToken) {
            const url2 = `http://localhost:3000/posts/${user.id}`;
            await fetchPosts(url2, jwtToken);
          }
        }
      
        fetchData();
      }, []);

      const fetchPosts = async (url2: any, jwt: any) => {
        try {
          
          const postsResponse = await fetch(url2, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwt}`,
            },
          });
    
          if (!postsResponse.ok) {
            throw new Error('Posts request failed');
          } 
    
          const postsData = await postsResponse.json();
          

          dispatch(setPosts({feedPosts: postsData}))
        } catch (error) {
          console.error('Error:', error);
        }
      };

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

    const postsBoolean = () => {
      if (posts && posts.length === 0) {
        return true
      } else {
        return false
      } 
  }

  const postsBoolean2 = () => {
    if (posts && posts.length === 0) {
      return false
    } else {
      return true
    } 
}

  // handle image uploads
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const isImageFile = acceptedFiles.some((file) =>
      file.type.startsWith('image/')
    );

    if (isImageFile) {
      setPicturePath(acceptedFiles[0]);
    } else {
      alert('Please select a JPEG or PNG file.');
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept:{
        'image/png': ['.png'],
        'image/jpg': ['.jpg'],
        'image/jpeg': ['.jpeg'],
        },
  });


  // post fetch

  const handlePost = async (e: any) => {
    e.preventDefault()

      const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('description', title)
    if (picturePath) {
      formData.append('picture', picturePath);
      formData.append('picturePath', picturePath.name);
    }
  
      
      const url = 'http://localhost:3000/posts/create'
      
      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: formData
      };

      if (title.length > 10 && title.length < 100) {
      try {
        setShowError(false)
        const response = await fetch(url, requestOptions);
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const responseData = await response.json();

        dispatch(setPosts({feedPosts: responseData}))
        setTitle('')
        setPicturePath(null)
      } catch (error) {
        console.error('Error:', error);
      }} else {
        setShowError(true)
      }
    };
    
  return (
    <div className='w-full'>
    { jwtBoolean2() && <div className='w-full'>

      <div className='flex justify-center mt-[20px] w-full'>

        <div className='max-sm:w-full max-sm:px-3'>
          <form onSubmit={handlePost} className='max-sm:w-full w-[400px] border-2 border-[#444444] hover:border-red-600 space-y-3 bg-[#222222] py-3 px-3 rounded-[30px]'>
          { showError && <div className='flex justify-center'>
          <div className='bg-red-600 flex items-center space-x-2 rounded-full w-fit pl-3 pr-1 py-1'><h1 className='text-white font-medium'>10-100 characters</h1><button onClick={() => setShowError(!showError)} type="button" className='bg-[black] w-7 h-7 rounded-full flex items-center justify-center text-white hover:text-red-600'><FontAwesomeIcon className='' icon={faX}/></button></div>
          </div>}
    <input value={title} onChange={(e) => setTitle(e.target.value) } className='py-3 w-full bg-black text-white rounded-full px-5' type='text' placeholder='Write Something...'/>
    <div>
            <div {...getRootProps()} className={`bg-black py-3 flex items-center pl-2 rounded-full pl-5 hover:border-2 border-red-600 cursor-pointer hover:border-red-600 dropzone}`}>
                <input className='' {...getInputProps()} />
                {picturePath ? (
                <p className='text-white pbreak'>{picturePath.name}</p>
                ) : (
                <p className='text-[silver]'>Add Picture Here</p>
                )}
            </div>
            </div>

            <button className='text-2xl flex justify-center w-full bg-red-600 rounded-full py-[7px] hover:bg-red-700 items-center font-bold text-[white]'>Post</button>
          
          </form>
        
        </div>
      
      </div>

      { postsBoolean() && <div className='flex items-center justify-center' style={{height: 'calc(100vh - 345px)'}}><h1 className='text-[#777777] font-bold text-3xl'>No Posts Yet.</h1></div>}

      { postsBoolean2() && <div className='w-full'>

        <div className='w-full flex flex-col items-center space-y-5 my-5'>

        {posts.map((e: any, i: any) => (
            <Post className='w-full' key={i} data={e}/>
          ))}

        </div>

      </div> }

    </div>}



    {jwtBoolean() && <div className='flex justify-center items-center w-full' style={{ height: 'calc(100vh - 115px)' }}>
        <div className='bg-[#111111] px-10 pb-10 pt-8 flex-col  max-md:mx-[50px] max-sm:mx-3  rounded-[20px] items-center flex justify-center border-2 border-[#444444] hover:border-red-600 max-md:w-full w-[500px]'>
        {register && <Register />}
        { login && <div className='flex flex-col items-start justify-left w-full h-full'>
        <h1 className='text-white text-3xl font-bold'>Log in</h1>
        <p className=' mt-2 text-white font-medium text-[silver]'>Clarity is a Social Media Designed for Productivity!</p>
        </div>}
        { login && <form onSubmit={handleSubmit} className='w-full space-y-3 mt-5'>
            {loginTruth && <div className='bg-red-600 w-fit pl-3 pr-1 py-1 rounded-full font-[600] flex items-center space-x-2'><p className='text-white text-[16px]'>Invalid username or password</p><button onClick={() => setLoginTruth(!loginTruth)} type='button' className='w-7 h-7 bg-black text-white hover:text-red-500 flex justify-center items-center rounded-full'><FontAwesomeIcon className='' icon={faX}/></button></div>}
            <div>
            <h1 className='text-white ml-1 font-bold '>Username<span className='text-red-500 font-[] ml-[1px]'>*</span></h1>
            <input onChange={(e: any) => handleInputChange(e)} value={username} required placeholder='@clarity' className=' h-10 text-white bg-[black] w-full pl-2 border-2 rounded-[10px] border-[#444444] hover:border-red-600 focus:border-red-600 focuss' type='text' pattern="^@.{1,}$"/>
            </div>
            
            <div className='pb-2'>
            <h1 className='text-white ml-1 font-bold '>Password<span className='text-red-500 font-[] ml-[1px]'>*</span></h1>
            <input onChange={(e: any) => setPassword(e.target.value)} value={password} required placeholder='PASSWORD' className='h-10 text-white bg-[black] w-full pl-2 border-2 rounded-[10px] border-[#444444] hover:border-red-600 focus:border-red-600 focuss' type='password' minLength={6}/>
            </div>

            <button className='hover:bg-red-700 bg-red-600 text-white font-bold rounded-[10px] h-10 w-full'>
                LOGIN
            </button>
        </form> }
        {login && <div className='flex w-full justify-left'>
        <p className='text-red-500 font-medium mt-5 ml-1 flex items-center'>No Account? <button onClick={() => {setLogin(false); setRegister(true)}} className='bg-red-600 text-white rounded-full px-2 py-[1px] ml-2 hover:bg-red-700 font-bold'>Register</button></p>
        </div> }
        {register && <div className='flex w-full justify-left'>
        <p className='text-red-500 font-medium mt-5 ml-1 flex items-center'>Already Registered? <button onClick={() => {setLogin(true); setRegister(false)}} className='bg-red-600 text-white rounded-full px-2 py-[1px] ml-2 hover:bg-red-700 font-bold'>LOGIN</button></p>
        </div> }
        </div> 
    </div>}
    </div>
  )
}

export default Login