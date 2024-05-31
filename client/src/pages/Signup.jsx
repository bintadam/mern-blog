import { Button, Label, TextInput } from "flowbite-react";
import { Link} from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to='/' className="self-center whitespace-nowrap text-4xl font-bold">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Sahand's</span>
          Blog
          </Link>
          <p className="text-sm mt-5">This is a demo project. You can sign up with your email and password or with google</p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your username"/>
              <TextInput
              type="text"
              placeholder="Your username"
              id='username'
              className=""
              />
            </div>
            <div>
              <Label value="Your email"/>
              <TextInput
              type="text"
              placeholder="name@company.com"
              id='email'
              className=""
              />
            </div>
            <div>
              <Label value="Your password"/>
              <TextInput
              type="text"
              placeholder="Your password"
              id='password'
              className=""
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type="submit">
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 test-sm mt-5">
            <span>Have an account?</span>
            <Link to='/sign-in' className="text-blue-500">
            Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
