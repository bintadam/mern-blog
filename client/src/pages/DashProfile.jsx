import {useSelector} from 'react-redux'
import {TextInput, Button, Alert} from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function DashProfile() {
    const {currentUser} = useSelector(state=>state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] =useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)

    const filePickerRef = useRef()
    const handleChange = (e) => {
        const file = e.target.files[0]
        if(file){
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    useEffect(() => {
        if(imageFile){
            uploadImage()
        }
    }, [imageFile])

    const uploadImage = async () => {
        console.log('uploading image...')
        const storage = getStorage(app);  //this app is imported from FirebaseError.js based on this app the firebase when we request uploading the image they are going to understand a correct person is requesting  
        const fileName = new Date().getTime() + imageFile.name //this is for when a person upload an image which has the same name as another not to raise an error 
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile) // uploadtask is a method for uploading image while uploading get information e.g the amount of bytes that is being uploaded etc
        uploadTask.on(
            'state_changed', // tracking changes when uploading
            (snapshot) => { // snapshot is the kind of piece of information you get when you're uploading Byte by byte based on the snapshot we can record progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 ;/// this is how many percentage we have uploaded
                setImageFileUploadProgress(progress.toFixed(0)) // this is for the decimal
            },
            (error) =>{
                setImageFileUploadError('Could not upload image (file must be less than 2MB')
                setImageFileUploadProgress(null);
                setImageFile(null)
                setImageFileUrl(null)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    setImageFileUrl(downloadURL)
                })
            }
        )
    }

    return (
        <div className='max-w-lg mx-auto w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>profile</h1>
            <form className='flex flex-col gap-4'>
                <input 
                    type='file' 
                    accept='image/*' 
                    onChange={handleChange} 
                    ref={filePickerRef}
                    hidden
                />
                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>filePickerRef.current.click()}>
                    {imageFileUploadProgress && (
                        <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} strokeWidth={5} styles={{ 
                            root:{
                            width:'100%',
                            height:'100%',
                            position:'absolute',
                            top:0,
                            left:0,
            
                            },
                            path:{
                                stroke:`rgba(62,152,199, ${
                                    imageFileUploadProgress/100
                                })`
                            }
                        }}
                    />
                    )}
                    <img 
                        src={imageFileUrl || currentUser.profilePicture} 
                        alt="user" 
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
                        ${imageFileUploadProgress &&  imageFileUploadProgress < 100 && 'opacity-60'}
                        `}
                    />
                </div>
                {imageFileUploadError && (
                    <Alert color='failure'>
                        {imageFileUploadError}
                    </Alert>
                )}
                <TextInput 
                type='text' 
                id='username' 
                placeholder='username' 
                defaultValue={currentUser.username}
                />
                <TextInput 
                type='email' 
                id='email' 
                placeholder='email' 
                defaultValue={currentUser.email}
                />
                <TextInput 
                type='password' 
                id='password' 
                placeholder='password' 
                />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>update</Button>
            </form>
            <div className='text-red-500 flex justify-between mt-5 '>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    )
}
