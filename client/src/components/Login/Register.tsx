'use client'
import React, {useState, useCallback} from 'react'
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons/faX';

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')    
    const [picturePath, setPicturePath] = useState<File | null>(null)
    const [registerTruth, setRegisterTruth] = useState(false)

    const handleInputChange = (e: any) => {
      const value = e.target.value;
      setUsername(value.startsWith('@') ? value : `@${value}` );
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


  // fetch
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
    
  if (picturePath) {
    formData.append('picture', picturePath);
    formData.append('picturePath', picturePath.name);
  }

    
    const url = 'https://clarity-backend.vercel.app/auth/register'
    
    const requestOptions = {
      method: 'POST',
      body: formData
    };

    try {
      setRegisterTruth(false)
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      window.location.href = `/`;
    } catch (error) {
      setRegisterTruth(true)
      console.error('Error:', error);
    }
  };

  return (
    <div className='w-full'>
        <div className='flex flex-col items-start justify-left w-full h-full'>
        <h1 className='text-white text-3xl font-bold'>Register</h1>
        <p className=' mt-2 text-white font-medium text-[silver]'>Clarity is a Social Media Designed for Productivity!</p>
        </div>
        {registerTruth && <div className='mt-3 bg-red-600 w-fit pl-3 pr-1 py-1 rounded-full font-[600] flex items-center space-x-2'><p className='text-white text-[16px]'>Username is already taken</p><button onClick={() => setRegisterTruth(!registerTruth)} type='button' className='w-7 h-7 bg-black text-white hover:text-red-500 flex justify-center items-center rounded-full'><FontAwesomeIcon className='' icon={faX}/></button></div>}
        <form onSubmit={handleSubmit} className='w-full mt-5 flex flex-col space-y-5'>
        

            

            <div>
            <h1 className='text-white ml-1 font-bold '>Profile Picture<span className='text-red-500 font-[] ml-[1px]'>*</span></h1>
            <div {...getRootProps()} className={`bg-black h-10 flex items-center pl-2 rounded-[10px] border-2 border-[#444444] cursor-pointer hover:border-red-600 dropzone}`}>
                <input className='' {...getInputProps()} />
                {picturePath ? (
                <p className='text-white'>{picturePath.name}</p>
                ) : (
                <p className='text-[silver]'>Add Picture Here</p>
                )}
            </div>
            </div>

            <div>
            <h1 className='text-white ml-1 font-bold '>Username<span className='text-red-500 font-[] ml-[1px]'>*</span></h1>
            <input onChange={handleInputChange} value={username} required placeholder='@clarity' className=' h-10 text-white bg-[black] w-full pl-2 border-2 rounded-[10px] border-[#444444] hover:border-red-600 focus:border-red-600 focuss' type='text' pattern="^@.{1,}$"/>
            </div>

            <div className='pb-2'>
            <h1 className='text-white ml-1 font-bold '>Password<span className='text-red-500 font-[] ml-[1px]'>*</span></h1>
            <input minLength={6} onChange={(e: any) => setPassword(e.target.value)} value={password} required placeholder='PASSWORD' className='h-10 text-white bg-[black] w-full pl-2 border-2 rounded-[10px] border-[#444444] hover:border-red-600 focus:border-red-600 focuss' type='password'/>
            </div>

            <button className='hover:bg-red-700 bg-red-600 text-white font-bold rounded-[10px] h-10 w-full'>
                REGISTER
            </button>
        </form>
    </div>
  )
}

export default Register