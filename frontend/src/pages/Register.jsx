import { useState, useEffect, useRef } from 'react';
import '../index.css';
import { Link, useNavigate } from 'react-router-dom'
import { instance } from '../api/axios.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%?]).{8,24}/;

export default function Register() {
    const [eyeOpen, isEyeOpen] = useState(false);

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
      userRef.current.focus();
    }, []);

    useEffect(() => {
      const result = EMAIL_REGEX.test(email);
      console.log(result);
      console.log(email);
      setValidEmail(result);

      if(email === "") {
        document.getElementById("email-icon").classList.remove("hidden");
      } else {
        document.getElementById("email-icon").classList.add("hidden");
      }
    }, [email])

    useEffect(() => {
      const result = USER_REGEX.test(user);
      console.log(result);
      console.log(user);
      setValidName(result);

      if(user === "") {
        document.getElementById("user-icon").classList.remove("hidden");
      } else {
        document.getElementById("user-icon").classList.add("hidden");
      }
    }, [user]);

    useEffect(() => {
      const result = PWD_REGEX.test(pwd);
      console.log(result);
      console.log(pwd);
      setValidPwd(result);
      const match = pwd === matchPwd;
      setValidMatch(match);

      if(pwd === "") {
        document.getElementById("pwd-icon").classList.remove("hidden");
      } else {
        document.getElementById("pwd-icon").classList.add("hidden");
      }

      if(matchPwd === "") {
        document.getElementById("match-icon").classList.remove("hidden");
      } else {
        document.getElementById("match-icon").classList.add("hidden");
      }
    }, [pwd, matchPwd]);

    useEffect(() => {
      setErrMsg('');
    }, [user, pwd, matchPwd]);


    const checkEmail = async function (email) {
      try {
        const e = await instance.get(`/users/find?email=${email}`);
        setValidEmail(false);
        return true;
      } catch {
        return false;
      }
    }
    const checkUsername = async function (user) {
      try {
        const u = await instance.get(`/users/find?username=${user}`);
        setValidName(false);
        return true;
      } catch {
        return false;
      }
    }

    const handleSubmit = async (e) => {
      // const navigate = useNavigate(); // ik this isn't great for SEO, but neither is any of the clientside routing on my site... maybe i'll use react-helmet at some point
      e.preventDefault();
      const v0 = EMAIL_REGEX.test(email);
      const v1 = USER_REGEX.test(user);
      const v2 = PWD_REGEX.test(pwd);

      if(!v0 || !v1 || !v2) {
        setErrMsg("Invalid Entry");
        return;
      }

      const emailExists = await checkEmail(email);
      const usernameExists = await checkUsername(user);

      if(emailExists && !usernameExists) {
        setErrMsg("An account with that email already exists!");
        return;
      } else if(usernameExists && !emailExists) {
        setErrMsg("An account with that username already exists!");
        return;
      } else if(emailExists && usernameExists) {
        setErrMsg("An account with that email and username already exists!");
        return;
      }

      console.log(`${email}\n${user}\n${pwd}\n`);
      setSuccess(true);
      //navigate("/succcess");
    }

    return(
        <>
          <div className="flex flex-col items-center mx-5">
            <div role="tablist" className="tabs tabs-lifted px-10" id="tab-list">
              <Link to="../log-in" role="tab" className={`tab text-xl font-bold h-[3rem] bg-base-300`}>Log in</Link>
              <a role="tab" className={`tab text-xl font-bold h-[3rem] tab-active text-primary`}>Create account</a>
            </div>
            <div className="card h-auto bg-base-100 border-1 border-primary/5 border-t-0 rounded-box flex-grow w-full lg:w-[40%] md:w-[50%] p-5 justify-center items-center text-center shadow-lg">
              <div className={`w-full items-center justify-center `}>
                <div ref={errRef} role="alert" className={`alert alert-error mb-2 ${errMsg ? "" : "offscreen"}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span aria-live="assertive">Error: {errMsg}</span>
                </div>
                <form className="flex flex-col w-full items-left justify-center" onSubmit={handleSubmit}>
                  <label tabIndex={0} className="input input-bordered w-full flex items-center gap-2 shadow-inner bg-base-200 focus-within:bg-base-100" htmlFor="create-account-email">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70"
                      id="email-icon">
                      <path
                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                      <path
                        d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <span className={validEmail ? "" : "hidden"}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0 stroke-green-600"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className={validEmail || !email ? "hidden" : ""}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0 stroke-red-600"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </span>
                    

                    {/* EMAIL */}
                    <input 
                      type="email"
                      id="create-account-email"
                      ref={userRef}
                      autoComplete="off"
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={validEmail ? "false" : "true"}
                      aria-describedby="emailnote"
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      className="grow"
                      placeholder="Email" 
                      required
                    />

                  </label>
                  <div role="alert" className={`flex w-full items-left text-left alert transition-all ease-in-out duration-150 ${emailFocus && email && !validEmail ? "mt-2" : "h-0 p-0 border-0 mt-0 overflow-hidden"}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-primary h-6 w-6 shrink-0">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span id="emailnote">
                      Must be a valid email.<br />
                      (example@website.com)
                    </span>
                  </div>

                  <label className="input input-bordered w-full flex items-center gap-2 mt-2 shadow-inner bg-base-200 focus-within:bg-base-100" htmlFor="create-account-username">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70"
                      id="user-icon">
                      <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <span className={validName ? "" : "hidden"}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0 stroke-green-600"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className={validName || !user ? "hidden" : ""}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0 stroke-red-600"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </span>

                    {/* USERNAME */}
                    <input 
                      type="username"
                      id="create-account-username"
                      autoComplete="off"
                      onChange={(e) => setUser(e.target.value)}
                      aria-invalid={validName ? "false" : "true"}
                      aria-describedby="uidnote"
                      onFocus={() => setUserFocus(true)}
                      onBlur={() => setUserFocus(false)}
                      className="grow"
                      placeholder="Username" 
                      required
                    />
                  </label>
                  <div role="alert" className={`flex w-full items-left text-left alert transition-all ease-in-out duration-150 ${userFocus && user && !validName ? "mt-2" : "h-0 p-0 border-0 mt-0 overflow-hidden"}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-primary h-6 w-6 shrink-0">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span id="uidnote">
                      4 to 24 characters.<br />
                      Must begin with a letter.<br />
                      Letters, numbers, underscores, hyphens allowed.
                    </span>
                  </div>
                  

                  <label className="input input-bordered w-full flex items-center gap-2 mt-2 shadow-inner bg-base-200 focus-within:bg-base-100" htmlFor="create-account-password">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70"
                      id="pwd-icon">
                      <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd" />
                    </svg>
                    <span className={validPwd ? "" : "hidden"}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0 stroke-green-600"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className={validPwd || !pwd ? "hidden" : ""}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0 stroke-red-600"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </span>

                    {/* PASSWORD */}
                    <input 
                      type={eyeOpen ? 'text' : 'password'} 
                      autoComplete="off"
                      id="create-account-password"
                      required
                      aria-invalid={validPwd ? "false" : "true"}
                      aria-describedby="pwdnote"
                      onFocus={() => setPwdFocus(true)}
                      onBlur={() => setPwdFocus(false)}
                      onChange={(e) => setPwd(e.target.value)}
                      className="grow" 
                      placeholder="Password" 
                      
                    />
                    
                    <span className="label-text-alt text-red-500 hidden">*Required</span>

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
                  <div role="alert" className={`flex w-full items-left text-left alert transition-all ease-in-out duration-150 ${pwdFocus && !validPwd ? "mt-2" : "h-0 p-0 border-0 mt-0 overflow-hidden"}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-primary h-6 w-6 shrink-0">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span id="pwdnote">
                      8 to 24 characters.<br />
                      Must include uppercase and lowercase letters, a number, and a special character.<br />
                      Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="question mark">?</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </span>
                  </div>
                  <label className="input input-bordered w-full flex items-center gap-2 mt-2 shadow-inner bg-base-200 focus-within:bg-base-100" htmlFor="create-account-confirm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70"
                      id="match-icon">
                      <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd" />
                    </svg>
                    <span className={validMatch && matchPwd ? "" : "hidden"}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0 stroke-green-600"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className={validMatch || !matchPwd ? "hidden" : ""}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0 stroke-red-600"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </span>

                    {/* CONFIRM PASSWORD */}
                    <input 
                      type={eyeOpen ? 'text' : 'password'}
                      id="create-account-confirm"
                      autoComplete="off"
                      onChange={(e) => setMatchPwd(e.target.value)}
                      required
                      aria-invalid={validMatch ? "false" : "true"}
                      aria-describedby="confirmnote"
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                      className="grow" 
                      placeholder="Confirm password" 
                      
                    />
                  </label>
                  <div role="alert" className={`flex w-full items-left text-left alert transition-all ease-in-out duration-150 ${matchFocus && !validMatch ? "mt-2" : "h-0 p-0 border-0 mt-0 overflow-hidden"}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-primary h-6 w-6 shrink-0">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span id="confirmnote">
                      Must match the first password input field
                    </span>
                  </div>

                  

                  {/* REMEMBER ME & SUBMIT BUTTON */}
                  <div className="flex flex-col w-full mt-2 items-center justify-center">
                    <label className="label cursor-pointer gap-2">
                      <input type="checkbox" className="checkbox checkbox-primary" />
                      <span className="label-text">Remember me</span>
                    </label>
                    <input 
                      type="submit"
                      disabled={!validEmail || !validName || !validPwd || !validMatch ? true : false}
                      className="flex btn btn-primary w-[15rem] h-[4rem] text-center justify-center hover:shadow-xl font-bold text-2xl mt-5"
                      value="Create account"
                    />
                  </div>
                  

                </form>
              </div>
            </div>
          </div>

        </>
    )
}