import {useSelector} from 'react-redux'
import {TextInput, Button, Alert, Modal} from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import 'react-circular-progressbar/dist/styles.css';
import {updateStart, updateSuccess,updateFailure, deleteUserStart, deleteUserSuccess,deleteUserFailure, signoutSuccess} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'

export default function DashProfile() {
    const {currentUser, error} = useSelector(state=>state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] =useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [imageFileuploading, setImageFileUploading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({})
    const filePickerRef = useRef()
    const dispatch = useDispatch()

    const handleImageChange = (e) => {
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
        // console.log('uploading image...')
        // service firebase.storage {
        //   match /b/{bucket}/o {
        //     match /{allPaths=**} {
        //       allow read;
        //       allow write: if
        //       request.resource.size < 2 * 1024 * 1024 &&
        //       request.resource.contentType.matches('image/.*')
        //     }
        //   }
        // }
        setImageFileUploading(true)
        setImageFileUploadError(null)
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
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    setImageFileUrl(downloadURL)
                    setFormData({...formData, profilePicture:downloadURL})
                    setImageFileUploading(false)
                })
            }
        )
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]:e.target.value})
    }

    const handleDeleteUser= async() => {
        setShowModal(false)
        try{
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method:'DELETE',
            })
            const data =  await res.json()
            if(!res.ok){
                dispatch(deleteUserFailure(data.message))
            }else{
                dispatch(deleteUserSuccess(data))
            }
        }catch(error){
            dispatch(deleteUserFailure(error.message))
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault() // prevent the default behaviour of resubmision which is refreshing the page
        if(Object.keys(formData).length === 0){
            setUpdateUserError('No changes made')
            return
        } /// this is checking if the form data has some values if its empty we want to prevent submision of the form
        if(imageFileuploading){
            setUpdateUserError('Please wait for image to upload');
        }
        try{
            dispatch(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            const data = await res.json()
            if(!res.ok){
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message)
            }else{
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User's profile updated successfully")
            }
        }catch (error){
            dispatch(updateFailure(error.message))
            setUpdateUserError(error.message)
        }
    }

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

    return (
        <div className='max-w-lg mx-auto w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>profile</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <input 
                    type='file' 
                    accept='image/*' 
                    onChange={handleImageChange} 
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
                onChange = {handleChange}
                />
                <TextInput 
                type='email' 
                id='email' 
                placeholder='email' 
                defaultValue={currentUser.email}
                onChange = {handleChange}
                />
                <TextInput 
                type='password' 
                id='password' 
                placeholder='password' 
                onChange = {handleChange}
                />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>update</Button>
            </form>
            <div className='text-red-500 flex justify-between mt-5 '>
                <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete Account</span>
                <span className='cursor-pointer' onClick={handleSignout}>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            )}
            {error && (
                <Alert color='failure' className='mt-5'>
                    {error}
                </Alert>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header/>
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className= "h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account</h3>
                        <div className='flex justify-center gap-4'>
                            <Button color="failure" onClick={handleDeleteUser}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
