import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, sessionLogin } from "../Slices/AuthSlice";

const HeaderFirstBtn = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoggedin, user, url } = useSelector(state => state.auth)

    useEffect(() => {
        let lsid = localStorage.getItem('lsUserId')
        if (lsid === null) { }
        else {
            if (lsid.length !== 0) {
                fetch(url + 'sessionLogin/' + JSON.parse(lsid))
                    .then(res => res.json())
                    .then(user => {
                        dispatch(sessionLogin(user))
                    })
                    .catch(err => console.log(err))
            }
        }
    }, [dispatch, url])

    const logOutHandle = () => {
        dispatch(logout())
        navigate('/')
        window.location.reload()
    }

    if (user.accType === 'admin') {
        return (
            <div className="header-buttons">
                <div className="header-first-btn">
                    <NavLink className='header-btn-icon' to='admin/products'>
                        <i className="fa-solid fa-user" />
                    </NavLink>
                    <NavLink className='header-btn-content' to='admin/products'>
                        <span>{isLoggedin ? user.name : ''}</span>
                    </NavLink>
                    <div style={{ display: isLoggedin ? '' : 'none' }} className="header-dropdown">
                        <NavLink to='admin/products'>
                            <i className="fa-brands fa-product-hunt" />Products
                        </NavLink>
                        <NavLink to='admin/add-product'>
                            <i className="fa-solid fa-plus" />Add Product
                        </NavLink>
                        <NavLink to='admin/orders'>
                            <i className="fa-solid fa-box" />Orders
                        </NavLink>
                        <button onClick={logOutHandle}><i className="fa-solid fa-right-from-bracket" />Logout</button>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="header-buttons">
            <div className="header-first-btn">
                <NavLink className='header-btn-icon' to={isLoggedin ? 'my-account/user-informations' : 'login'}>
                    <i className="fa-solid fa-user" />
                </NavLink>
                <NavLink className='header-btn-content' to={isLoggedin ? 'my-account/user-informations' : 'login'}>
                    <span>{isLoggedin ? 'My profile' : 'Login'}</span>
                    <span>{isLoggedin ? user.name : ''}</span>
                </NavLink>
                <div style={{ display: isLoggedin ? '' : 'none' }} className="header-dropdown">
                    <NavLink to='my-account/user-informations'>
                        <i className="fa-solid fa-circle-info" />User Informations
                    </NavLink>
                    <NavLink to='my-account/my-orders'>
                        <i className="fa-solid fa-box" />
                        My Orders</NavLink>
                    <NavLink to='my-account/favorites'>
                        <i className="fa-regular fa-bookmark" />
                        Favorites</NavLink>
                    <NavLink to='my-account/addresses'>
                        <i className="fa-solid fa-location-dot" />
                        Addresses</NavLink>
                    <button onClick={logOutHandle}><i className="fa-solid fa-right-from-bracket"></i>Logout</button>
                </div>
            </div>
            <div className="header-second-btn">
                <NavLink className='header-btn-icon' to='/cart'>
                    <i className="fa-solid fa-cart-shopping"></i>
                </NavLink>
                <NavLink className='header-btn-content' to='/cart'>Cart</NavLink>
            </div>
        </div>
    )
}

export default function Header() {

    const { categories } = useSelector(state => state.product)

    return (
        <div className='header-div'>
            <div className="header-top-div">
                <NavLink className='logo' to='/'>XYZ</NavLink>
                <HeaderFirstBtn />
            </div>
            <div className="header-bottom-div">
                <button className='products-btn' to='/products'><i className="fa-solid fa-bars" />Products</button>
                <div className="products-menu-dropdown">
                    {categories && categories.map((category, index) =>
                        <ul key={index}>
                            <h4>{category.name}</h4>
                            {category.arr && category.arr.map((c, i) =>
                                <li key={i}>
                                    <NavLink to={'/category/' + c}>{c}</NavLink>
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}