import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
    const [eyeOpen, isEyeOpen] = useState(false);

    const onFormSubmit = () => {
        // update this function later
      }

    return(
        <>
            <div className="flex flex-col items-center mx-5">
                <div role="tablist" className="tabs tabs-lifted px-10" id="tab-list">
                    <a role="tab" className={`tab text-xl font-bold h-[3rem] tab-active text-primary`}>Log in</a>
                    <Link to="../create-account" role="tab" className={`tab text-xl font-bold h-[3rem] bg-base-300`}>Create account</Link>
                </div>
                <div className="card h-auto bg-base-100 border-1 border-primary/5 border-t-0 rounded-box flex-grow w-full lg:w-[40%] md:w-[50%] p-5 justify-center items-center text-center shadow-lg">
                    <div className={`w-full items-center justify-center `}>
                        <form className="flex flex-col w-full items-center justify-center">
                            <label className="input input-bordered w-full flex items-center gap-2 mb-2 shadow-inner bg-base-200 focus-within:bg-base-100" htmlFor="username">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>

                                    {/* USERNAME */}
                                <input 
                                    type="text"
                                    className="grow" 
                                    placeholder="Username"
                                />

                            </label>
                            <label className="input input-bordered w-full flex items-center gap-2 mb-2 shadow-inner bg-base-200 focus-within:bg-base-100" htmlFor="password">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    fillRule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clipRule="evenodd" />
                                </svg>

                                    {/* PASSWORD */}
                                <input 
                                type={eyeOpen ? 'text' : 'password'} 
                                className="grow" 
                                placeholder="Password" 
                                minLength={7} 
                                maxLength={30}
                                />
                                    
                                <label className="swap opacity-70">
                                {/* this hidden checkbox controls the state */}
                                    <input
                                        type="checkbox"
                                        className=""
                                        value={false}
                                        checked={eyeOpen}
                                        onChange={() => isEyeOpen(!eyeOpen)}
                                    />

                                    {/* open eye */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        
                                        viewBox="0 0 512 512"
                                        fill="currentColor"
                                        className="swap-on w-6 h-6"
                                        version="1.1">
                                    <path
                                        fillRule="evenodd"
                                        d="m494.8,241.4l-50.6-49.4c-50.1-48.9-116.9-75.8-188.2-75.8s-138.1,26.9-188.2,75.8l-50.6,49.4c-11.3,12.3-4.3,25.4 0,29.2l50.6,49.4c50.1,48.9 116.9,75.8 188.2,75.8s138.1-26.9 188.2-75.8l50.6-49.4c4-3.8 11.7-16.4 0-29.2zm-238.8,84.4c-38.5,0-69.8-31.3-69.8-69.8 0-38.5 31.3-69.8 69.8-69.8 38.5,0 69.8,31.3 69.8,69.8 0,38.5-31.3,69.8-69.8,69.8zm-195.3-69.8l35.7-34.8c27-26.4 59.8-45.2 95.7-55.4-28.2,20.1-46.6,53-46.6,90.1 0,37.1 18.4,70.1 46.6,90.1-35.9-10.2-68.7-29-95.7-55.3l-35.7-34.7zm355,34.8c-27,26.3-59.8,45.1-95.7,55.3 28.2-20.1 46.6-53 46.6-90.1 0-37.2-18.4-70.1-46.6-90.1 35.9,10.2 68.7,29 95.7,55.4l35.6,34.8-35.6,34.7z"
                                        clipRule="evenodd" />
                                    </svg>

                                    {/* closed eye */}
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24" fill="none" 
                                        className="swap-off w-6 h-6">
                                        <path d="M2 10C2 10 5.5 14 12 14C18.5 14 22 10 22 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M4 11.6445L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M22 14L20.0039 11.6484" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M8.91406 13.6797L8 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M15.0625 13.6875L16 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </label>
                            </label>
                            <label className="label cursor-pointer gap-2">
                                <input type="checkbox" className="checkbox checkbox-primary" />
                                <span className="label-text">Remember me</span>
                            </label>

                                {/* SUBMIT BUTTON */}
                            <input 
                                type="button" 
                                className="flex btn btn-primary w-[10rem] h-[4rem] text-center justify-center hover:shadow-xl font-bold text-2xl mt-5"
                                onClick={onFormSubmit}
                                value="Submit"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}