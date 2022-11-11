import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function Register() {

    const [name, SetName] = useState('')
    const [lastname, SetLastname] = useState('')
    const [email, SetEmail] = useState('')
    const [password, SetPassword] = useState('')
    const [passwordAgain, SetPasswordAgain] = useState('')
    const [registerFormErrMsg, SetRegisterFormErrMsg] = useState('')
    const [registerFormErrName, SetRegisterFormErrName] = useState('')

    const { url } = useSelector(state => state.auth)
    const navigate = useNavigate()

    const reset = () => {
        SetName(''); SetLastname(''); SetEmail(''); SetPassword('');
        SetPasswordAgain(''); SetRegisterFormErrMsg(''); SetRegisterFormErrName('');
    }

    const register = (e) => {
        e.preventDefault()

        if (!name.length > 0) {
            SetRegisterFormErrMsg('Name can not be empty')
            SetRegisterFormErrName('name')
        }
        else if (!lastname.length > 0) {
            SetRegisterFormErrMsg('Lastname can not be empty')
            SetRegisterFormErrName('lastname')
        }
        else if (!email.includes('@') && !email.includes('.com')) {
            SetRegisterFormErrMsg('Please enter valid email')
            SetRegisterFormErrName('email')
        }
        else if (password !== passwordAgain) {
            SetRegisterFormErrMsg('Passwords should be same')
            SetRegisterFormErrName('password')
        }
        else if (password.length < 6) {
            SetRegisterFormErrMsg('Pasword length must be more than 6')
            SetRegisterFormErrName('password')
        }
        else {
            fetch(url + 'register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, lastname, email, password })
            })
                .then(res => res.json())
                .then(data => {
                    if (data === 'Email has already been using') {
                        SetRegisterFormErrMsg('Email has already been using')
                        SetRegisterFormErrName('email')
                    }
                    else {
                        e.target.reset()
                        reset()
                        navigate('/login')
                        console.log('register successful')
                    }
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <div className="register-page">
            <form onSubmit={register} className="form">
                <h2>Register</h2>
                <div className="form-row">
                    <label>
                        <input style={{ border: registerFormErrName === 'name' ? '1px solid red' : '' }} onChange={(e) => SetName(e.target.value)} type='text'></input>
                        <span className={name.length > 0 ? 'active' : ''}>Name</span>
                    </label>
                    <label>
                        <input style={{ border: registerFormErrName === 'lastname' ? '1px solid red' : '' }} onChange={(e) => SetLastname(e.target.value)} type='text'></input>
                        <span className={lastname.length > 0 ? 'active' : ''}>Lastname</span>
                    </label>
                </div>
                <label>
                    <input style={{ border: registerFormErrName === 'email' ? '1px solid red' : '' }} onChange={(e) => SetEmail(e.target.value)} type='email'></input>
                    <span className={email.length > 0 ? 'active' : ''}>Email</span>
                </label>
                <label>
                    <input style={{ border: registerFormErrName === 'password' ? '1px solid red' : '' }} onChange={(e) => SetPassword(e.target.value)} type='password'></input>
                    <span className={password.length > 0 ? 'active' : ''}>Password</span>
                </label>
                <label>
                    <input style={{ border: registerFormErrName === 'password' ? '1px solid red' : '' }} onChange={(e) => SetPasswordAgain(e.target.value)} type='password'></input>
                    <span className={passwordAgain.length > 0 ? 'active' : ''}>Password</span>
                </label>
                {registerFormErrMsg && registerFormErrMsg}
                <button type="submit">Register</button>
            </form>
        </div>
    )
}