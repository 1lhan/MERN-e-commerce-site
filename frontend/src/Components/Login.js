import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"
import { login } from "../Slices/AuthSlice"

export default function Login() {

    const [email, SetEmail] = useState('')
    const [password, SetPassword] = useState('')
    const [loginFormErrMsg, SetLoginFormErrMsg] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { url } = useSelector(state => state.auth)

    const loginHandle = (e) => {
        e.preventDefault()

        fetch(url + 'login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'Email not exist') {
                    SetLoginFormErrMsg(data.msg)
                }
                else if (data.msg === 'Email or password wrong') {
                    SetLoginFormErrMsg(data.msg)
                }
                else {
                    dispatch(login(data.user))
                    SetLoginFormErrMsg()
                    navigate('/')
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="login-page">
            <form onSubmit={loginHandle} className="form">
                <h2>Login</h2>
                <label>
                    <input onChange={(e) => SetEmail(e.target.value)} type='email'></input>
                    <span className={email.length > 0 ? 'active' : ''}>Email</span>
                </label>
                <label>
                    <input onChange={(e) => SetPassword(e.target.value)} type='password'></input>
                    <span className={password.length > 0 ? 'active' : ''}>Password</span>
                </label>
                {loginFormErrMsg && loginFormErrMsg}
                <button type="submit">Login</button>
            </form>
            <NavLink className='to-register-page' to='/register'>Create account</NavLink>
        </div>
    )
}