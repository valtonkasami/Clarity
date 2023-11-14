'use client'
import Image from 'next/image';
import { RootState } from '@/redux/store'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from 'react-redux'
import Post from '@/components/Login/post';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons' 
import { setPosts } from '@/redux/features/jwtSlice';

const User = () => {
    const router = useRouter();
    const id = useSelector((state: RootState) => state.userSlice.id)
    const jwtToken = useSelector((state: RootState) => state.jwtSlice.tokena)
    const userId = useSelector((state: RootState) => state.jwtSlice.user)
    const [picturePath, setPicturePath] = useState<File | null>(null)
    const [picturePath2, setPicturePath2] = useState<File | null>(null)
    const [showError, setShowError] = useState(false)
    const [ title, setTitle ] = useState('')
    const dispatch = useDispatch()

    interface User {
        id: string
        picturePath: string
        username: string
        followers: string
        following: string
      }

      const handlePost = async (e: any) => {
        e.preventDefault()
    
          const formData = new FormData();
        formData.append('userId', userId.id);
        formData.append('description', title)
        if (picturePath) {
          formData.append('picture', picturePath);
        }
      
          
          const url = 'https://clarity-backend.vercel.app/posts/create'
          const url2 = `https://clarity-backend.vercel.app/posts/${id}/posts`;

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
            fetchPosts(url2, jwtToken)
          } catch (error) {
            console.error('Error:', error);
          }} else {
            setShowError(true)
          }
        };

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


      const [posts2, setPosts2] = useState([])
      const [user, setUser] = useState<User | null>(null)
      const client = useSelector((state: RootState) => state.jwtSlice.user)
      const [edit, setEdit] = useState(false)

      const showFollow = () => {
        if (user?.id === client.id) {
            return false
        } else {
            return true
        }
      }

      const showEdit = () => {
        if (user?.id === client.id) {
            return true
        } else {
            return false
        }
      }

      const afterFollow = () => {
        if (user?.followers.includes(userId.id)) {
          return false; 
        } else {
          return true; 
        }
      }


      const redirect = () => {
        if (jwtToken === '') {
            return true
        } else {return false}
      }
    
    useEffect(() => {
        if (redirect()) {
            router.push("/")
        } else {
            const url = `https://clarity-backend.vercel.app/users/${id}`;
            const url2 = `https://clarity-backend.vercel.app/posts/${id}/posts`;
            fetchUser(url, jwtToken)
            fetchPosts(url2, jwtToken)
        }
      }, []);

    const fetchUser = async (url: any, jwt: any) => {
        try {
          
          const userResponse = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwt}`,
            },
          });
    
          if (!userResponse.ok) {
            throw new Error('Posts request failed');
          } 
    
          const userData = await userResponse.json();
          
          setUser(userData)
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const handleFollow = async () => {
        const url = `https://clarity-backend.vercel.app/users/${id}/${userId.id}`;
        try {
          
            const followResponse = await fetch(url, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${jwtToken}`,
              },
            });
      
            if (!followResponse.ok) {
              throw new Error('Posts request failed');
            } 
      
            const followData = await followResponse.json();
            
            setUser(followData)
            
          } catch (error) {
            console.error('Error:', error);
          }
      }
      

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
          
          setPosts2(postsData)
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const save = () => {
        if (picturePath) {
          return 'submit'
        } else {
          return 'button'
        }
      }

      const color = () => {
        if (picturePath) {
          return 'bg-red-600 hover:bg-red-700'
        } else {
          return 'bg-[#666666] cursor-not-allowed'
        }
      }

      const handleSubmit = async (e: any) => {
        e.preventDefault()
        const formData = new FormData();
    formData.append('id', userId.id);

    if (picturePath) {
      formData.append('picture', picturePath);
    }
  
      
      const url = 'https://clarity-backend.vercel.app/users/create'
      
      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: formData
      };


      try {
        const response = await fetch(url, requestOptions);
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const responseData = await response.json();
        
        location.reload()
        
      } catch (error) {
        console.error('Error:', error);
      } 
    };

    
const [imageLoaded, setImageLoaded] = useState(false);

const handleImageLoad = () => {
  setImageLoaded(true);
};


  return (
    <div className=''>
        
        {user && <div className='flex xs:pr-14 mb-5  justify-center items-center xs:space-x-10 max-xs:space-x-5'>
            <div className='h-[200px] w-[200px] max-xs:h-[130px] max-xs:w-[130px] flex items-center justify-center border-[4px] border-[#444444] hover:border-red-600 overflow-hidden rounded-full'>
                { user?.picturePath && imageLoaded && <img alt='img' className=' h-full w-full object-cover' onLoad={handleImageLoad} src={user?.picturePath}/>}
                { !user?.picturePath && imageLoaded && <img alt='img' className=' h-full w-full object-cover' onLoad={handleImageLoad} src='cat.jpg'/>}
            </div>

            <div>
                <h1 className='text-white text-3xl max-xs:text-2xl font-bold mb-2 xm:mb-6'>{user?.username}</h1>
                <div className='flex space-x-5 mb-2 xs:mb-6'>
                <h2 className='text-[silver]  font-[600] '>{user?.followers.length} followers</h2>
                <h2 className='text-[silver]  font-[600] '>{user?.following.length} following</h2>
                </div>

                {showFollow() && <div>
                    <button onClick={handleFollow} className='text-white bg-[#222222] border-2 border-[#444444] hover:border-red-600 font-[600] px-3 py-1 rounded-full'>
                       {afterFollow() && `Follow`} {!afterFollow() && `Unfollow`}
                    </button>
                </div>}

                {showEdit() && <div className=''>
                  <button onClick={() => {setEdit(true); setPicturePath(null)}} className='text-white bg-[#222222] border-2 border-[#444444] hover:border-red-600 font-[600] px-3 py-1 rounded-full'>
                    Edit profile
                  </button>
                  </div>}

                  {edit && <form onSubmit={handleSubmit} className='flex-col fixed z-20 max-sm:w-[90vw] px-5 flex items-center py-5 w-[400px] bg-[#111111] rounded-[20px] border-2 border-red-600 nc'>
                  
                  <div className='w-full'>
            <h1 className='text-white ml-1 font-bold mb-1'>Change Profile Picture<span className='text-red-500 font-[] ml-[1px]'>*</span></h1>
            <div {...getRootProps()} className={`bg-black overflow-hidden py-3 flex items-center px-3 rounded-[10px] border-2 border-[#444444] cursor-pointer hover:border-red-600 dropzone}`}>
                <input className='' {...getInputProps()} />
                {picturePath ? (
                <p className='text-white ebreak'>{picturePath.name}</p>
                ) : (
                <p className='text-[silver]'>Add Picture Here</p>
                )}
            </div>
            </div>
                  
                  <button type={save()} className={`mt-3 px-5 py-1 ${color()} rounded-full text-white text-2xl font-[600]`}>
                    Save
                  </button>

                  </form>}

                  {edit && <div onClick={() => {setEdit(false); setPicturePath(null)}} className='opacity fixed h-[100vh] w-[100vw] bg-[black] top-0 left-0 z-10'></div>}
            </div>
        </div>}
        {user && <hr className='w-full border-[#666666]'/>}
        
        {user && showEdit() && <div className='flex justify-center mt-[20px] w-full'>

<div className='max-sm:w-full max-sm:px-3'>
  <form onSubmit={handlePost} className='max-sm:w-full w-[400px] border-2 border-[#444444] hover:border-red-600 space-y-3 bg-[#222222] py-3 px-3 rounded-[30px]'>
  { showError && <div className='flex justify-center'>
  <div className='bg-red-600 flex items-center space-x-2 rounded-full w-fit pl-3 pr-1 py-1'><h1 className='text-white font-medium'>10-100 characters</h1><button onClick={() => setShowError(!showError)} type="button" className='bg-[black] w-7 h-7 rounded-full flex items-center justify-center text-white hover:text-red-600'><FontAwesomeIcon className='' icon={faX}/></button></div>
  </div>}
<input value={title} onChange={(e) => setTitle(e.target.value) } className='input py-3 w-full bg-black text-white rounded-full px-5' type='text' placeholder='Write Something...'/>
<div className=''>
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

</div>}

        { !posts2.length && showEdit() && <div className='flex items-center justify-center' style={{height: 'calc(100vh - 569px)'}}><h1 className='text-[#777777] font-bold text-3xl'>No Posts Yet.</h1></div>}
        { !posts2.length && showFollow() && <div className='flex items-center justify-center' style={{height: 'calc(100vh - 360px)'}}><h1 className='text-[#777777] font-bold text-3xl'>No Posts Yet.</h1></div>}

      { posts2 && <div>

        <div className='flex flex-col items-center space-y-5 my-5'>

        {posts2.map((e: any, i: any) => (
            <Post key={i} data={e}/>
          ))}

        </div>

      </div> }
                
    </div>
  )
}

export default User
