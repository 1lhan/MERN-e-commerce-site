import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import MyProfileLinks from "./MyProfileLinks"
import { getUser } from '../../Slices/AuthSlice'

export default function MyProfile() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, userId, url } = useSelector(state => state.auth)

    const [displayController, SetDisplayController] = useState(false)
    const [name, SetName] = useState('')
    const [lastname, SetLastname] = useState('')
    const [email, SetEmail] = useState('')
    const [updateProfileErrMsg, SetUpdateProfileErrMsg] = useState('')

    const [oldPassword, SetOldPassword] = useState('')
    const [password, SetPassword] = useState('')
    const [passwordAgain, SetPasswordAgain] = useState('')
    const [updatePwErrMsg, SetUpdatePwErrMsg] = useState('')

    useEffect(() => {
        dispatch(getUser(userId))
    }, [dispatch, userId])

    const updateProfile = (e) => {
        e.preventDefault()

        if (email.length > 0) {
            if (!email.includes('@')) {
                SetUpdateProfileErrMsg('Please enter valid email')
            }
            else if (!email.includes('.com')) {
                SetUpdateProfileErrMsg('Please enter valid email')
            }
            else {
                fetch(url + 'update-profile', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId,
                        name: name || user.name,
                        lastname: lastname || user.lastname,
                        email: email || user.email
                    })
                })
                    .then(SetDisplayController(!displayController))
                    .then(SetUpdatePwErrMsg(''))
                    .then(dispatch(getUser(userId)))
                    .then(navigate('/my-account/user-informations?action=update'))
                    .catch(err => console.log(err))
            }
        }
        else {
            fetch(url + 'update-profile', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    name: name || user.name,
                    lastname: lastname || user.lastname,
                    email: email || user.email
                })
            })
                .then(SetDisplayController(!displayController))
                .then(SetUpdatePwErrMsg(''))
                .then(dispatch(getUser(userId)))
                .then(navigate('/my-account/user-informations?action=update'))
                .catch(err => console.log(err))
        }
    }

    const updatePassword = (e) => {
        e.preventDefault()

        if (oldPassword.length < 6 || password.length < 6 || passwordAgain < 6) {
            SetUpdatePwErrMsg('Password length must be more than 6')
        }
        else if (password !== passwordAgain) {
            SetUpdatePwErrMsg('Passwords must be same')
        }
        else {
            fetch(url + 'update-password', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId, oldPassword, password
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data === 'Password wrong') {
                        SetUpdatePwErrMsg(data)
                    }
                    else if (data === true) {
                        SetUpdatePwErrMsg('')
                        e.target.reset()
                        navigate('/my-account/user-informations?action=update')
                    }
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <div className="user-informations-page">
            <MyProfileLinks />
            <div className="second-div">
                <div className="user-informations-div">
                    <div className="user-informations-title-div">
                        <h2>Membership Informations</h2>
                        <button className="edit-profile-btn" onClick={() => SetDisplayController(!displayController)}>
                            <i className="fa-regular fa-pen-to-square" />
                        </button>
                    </div>
                    <div className="user-informations">
                        <div className="user-informations-first-div">
                            <h2>User Informations</h2>
                            <label>
                                <span>Name</span>
                                <input defaultValue={user.name} type='text' disabled />
                            </label>
                            <label>
                                <span>Lastname</span>
                                <input defaultValue={user.lastname} type='text' disabled />
                            </label>
                            <label>
                                <span>Email</span>
                                <input defaultValue={user.email} type='text' disabled />
                            </label>
                        </div>
                        <form onSubmit={updatePassword} className="user-informations-second-div form">
                            <h2>Update Password Form</h2>
                            <label>
                                <span className='disable'>Password</span>
                                <input onChange={(e) => SetOldPassword(e.target.value)} type='password' />
                            </label>
                            <label>
                                <span className='disable'>New Password</span>
                                <input onChange={(e) => SetPassword(e.target.value)} type='password' />
                            </label>
                            <label>
                                <span className='disable'>New Password Again</span>
                                <input onChange={(e) => SetPasswordAgain(e.target.value)} type='password' />
                            </label>
                            {updatePwErrMsg && updatePwErrMsg}
                            <button type="submit">Update Password</button>
                        </form>
                    </div>
                </div>
            </div>
            <div style={{ display: displayController ? 'flex' : 'none' }} className="edit-profile-div blur">
                <form onSubmit={updateProfile} className="form">
                    <h2>Edit Profile Form
                        <i onClick={() => SetDisplayController(!displayController)} className="fa-solid fa-xmark close-btn"></i>
                    </h2>
                    <label>
                        <span className='disable'>Name</span>
                        <input onChange={(e) => SetName(e.target.value)} defaultValue={user.name} type='text' />
                    </label>
                    <label>
                        <span className='disable'>Lastname</span>
                        <input onChange={(e) => SetLastname(e.target.value)} defaultValue={user.lastname} type='text' />
                    </label>
                    <label>
                        <span className='disable'>Email</span>
                        <input onChange={(e) => SetEmail(e.target.value)} defaultValue={user.email} type='text' />
                    </label>
                    {updateProfileErrMsg && updateProfileErrMsg}
                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    )
}

//ß