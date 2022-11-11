import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../Slices/AuthSlice";

export default function MyProfileLinks() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logOutHandle = () => {
        dispatch(logout())
        navigate('/')
        window.location.reload()
    }

    return (
        <div className="my-account-links-page">
            <h2>My Profile</h2>
            <NavLink className='my-account-links' to='/my-account/user-informations'>
                <i className="fa-solid fa-circle-info" />User Informations
            </NavLink>
            <NavLink className='my-account-links' to='/my-account/my-orders'>
                <i className="fa-solid fa-box" />My Orders
            </NavLink>
            <NavLink className='my-account-links' to='/my-account/favorites'>
                <i className="fa-regular fa-bookmark" />Favorites
            </NavLink>
            <NavLink className='my-account-links' to='/my-account/addresses'>
                <i className="fa-solid fa-location-dot" />Addresses
            </NavLink>
            <button className="logout-btn" onClick={logOutHandle}><i className="fa-solid fa-right-from-bracket" />Logout</button>
        </div >
    )
}