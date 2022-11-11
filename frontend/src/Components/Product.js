import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useParams } from "react-router-dom"
import { getUser } from "../Slices/AuthSlice"
import Loading from "./Loading"

export default function Product() {

    const dispatch = useDispatch()
    const { url, userId, isLoggedin } = useSelector(state => state.auth)
    const { productId } = useParams()
    const [product, SetProduct] = useState({})
    const [favoritesController, SetFavoritesController] = useState(null)
    const [productIsExist, SetProductIsExist] = useState(null)
    const [cartController, SetCartController] = useState(null)

    useEffect(() => {
        fetch(url + 'product/' + productId)
            .then(res => res.json())
            .then(data => {
                SetProduct(data.product)
                return data
            })
            .then(data => {
                if (isLoggedin) {
                    fetch(url + 'get-favorites-and-cart/' + userId)
                        .then(res => res.json())
                        .then(user => {
                            for (let i in user.favorites) {
                                if (user.favorites[i].productId._id === data.product._id) {
                                    SetFavoritesController(true)
                                    break
                                }
                                else { SetFavoritesController(false) }
                            }
                            for (let i in user.cart) {
                                if (user.cart[i].productId === data.product._id) {
                                    SetCartController(true)
                                    break
                                }
                                else { SetCartController(false) }
                            }
                        })
                }
                SetProductIsExist(data.boolen)
            })
            .catch(err => console.log(err))
    }, [productId, url, userId, isLoggedin])

    const addToFavorites = (product) => {
        fetch(url + 'favorites', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, productId: product })
        })
            .then(res => res.json())
            .then(data => {
                if (data === true) {
                    SetFavoritesController(true)
                }
                else { SetFavoritesController(false) }
            })
            .then(dispatch(getUser(userId)))
            .catch(err => console.log(err))
    }

    const addToCart = () => {
        fetch(url + 'add-to-cart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, productId })
        })
            .then().catch(err => console.log(err))
    }

    if (productIsExist === null) {
        return (
            <Loading />
        )
    }
    else if (productIsExist === false) {
        return (
            <NavLink className='page-not-founded-btn' to='/'>Page not founded, back to main page</NavLink>
        )
    }
    return (
        <div className="product-page">
            <div className="product-page-first-div">
                {product &&
                    <div className="product">
                        <div className="img" />
                        <div className="product-second-div">
                            <h2 className="title">{product.title}</h2>
                            <p className="price">{Number(product.price).toFixed(2)}</p>
                            {isLoggedin === true ?
                                <div className="product-buttons">
                                    <button style={{ background: cartController ? '#22c55e' : '' }} onClick={() => {
                                        addToCart()
                                        SetCartController(true)
                                    }} className="add-to-cart-btn">Add to cart</button>
                                    <button
                                        onClick={() => addToFavorites(product._id)}
                                        style={{ background: favoritesController ? '#22c55e' : '' }}
                                        className="add-to-favorites-btn">
                                        <i className="fa-regular fa-bookmark" />
                                    </button>
                                </div>
                                : ''}
                        </div>
                    </div>
                }
                <div className="product-page-second-div">
                    <ul className="product-informations">
                        <h2>Product Informations</h2>
                        {product.informations && product.informations.map((information, index) =>
                            <li key={index}>
                                <span className="key">{Object.keys(information)[0]}</span>
                                <span className="value">{Object.values(information)[0]}</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div >
    )
}