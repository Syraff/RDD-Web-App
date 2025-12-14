import { LazyLoadImage } from "react-lazy-load-image-component";
import LongLogo from "@/assets/long_logo.png";
import LoginForm from "@/components/forms/auth/LoginForm";

export default function Login() {
  return (
    <>
      <div className="grid grid-cols-6 bg-[#1a1a1a] text-[#fff] items-center h-screen">
        <div className="col-span-2 px-14">
          <div className="flex flex-col space-y-2 text-left mb-10">
            <div className="mb-16">
              <LazyLoadImage src={LongLogo} className="w-[90%]" />
              <p className="font-light mt-5">Road Damage Detector</p>
            </div>
            <h1 className="text-2xl font-medium">Login</h1>
            <p className="text-sm font-extralight">
              Silakan login terlebih dahulu untuk masuk aplikasi.
            </p>
          </div>
          <LoginForm />
        </div>
        <div className="col-span-4 w-full h-full p-10 pl-0 relative">
          <LazyLoadImage
            src="https://images.unsplash.com/photo-1518623001395-125242310d0c?q=80&w=2849&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="object-cover w-full h-full rounded-3xl grayscale"
          />
          {/* <LazyLoadImage
            src={Logo}
            className="absolute top-10 right-10 w-[150px] bg-[#112026] p-3 pb-5 rounded-bl-4xl"
          />
          <div className="ll-in size-[30px] absolute top-10 right-[190px] bg-[#112026]"></div>
          <div className="ll-in size-[30px] absolute top-[154px] right-10 bg-[#112026]"></div> */}
        </div>
      </div>
    </>
  );
}
