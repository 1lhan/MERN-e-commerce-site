import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function Cart() {

    const navigate = useNavigate()
    const { isLoggedin, url, userId } = useSelector(state => state.auth)
    const [cart, SetCart] = useState([])
    const [controller, SetController] = useState(0)
    const [cartTotalPrice, SetCartTotalPrice] = useState(0)

    const getCart = () => {
        fetch(url + 'get-cart/' + userId)
            .then(res => res.json())
            .then(cart => {
                SetCart(cart)
                return cart
            })
            .then(cart => {
                let cartTotalPrice = 0;
                for (let i in cart) {
                    cartTotalPrice += Number(cart[i].productId.price) * Number(cart[i].quantity)
                }
                SetCartTotalPrice(Number(cartTotalPrice))
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (isLoggedin) {
            fetch(url + 'get-cart/' + userId)
                .then(res => res.json())
                .then(cart => {
                    SetCart(cart)
                    return cart
                })
                .then(cart => {
                    let cartTotalPrice = 0;
                    for (let i in cart) {
                        cartTotalPrice += Number(cart[i].productId.price) * Number(cart[i].quantity)
                    }
                    SetCartTotalPrice(Number(cartTotalPrice))
                })
                .catch(err => console.log(err))
        }
    }, [url, userId, isLoggedin, controller])

    const cartQuantityHandle = (quantity, productId, action) => {
        if (Number(quantity) === 1 && action === 'dicrease') {
            fetch(url + 'delete-product-from-cart', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, productId })
            })
                .then(SetController(controller + 1))
                .then(getCart())
                .catch(err => console.log(err))
        }
        else {
            fetch(url + 'cart-quantity', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, productId, quantityAction: action })
            })
                .then(SetController(controller + 1))
                .then(getCart())
                .catch(err => console.log(err))
        }
    }

    const confirmCartBtnHandle = () => {
        if (cart.length === 0) { }
        else {
            navigate('/payment')
        }
    }

    return (
        <div className="cart-page">
            <div className="cart-page-first-div">
                {cart && cart.map((product, index) =>
                    <div key={index} className="cart-product">
                        <div className="img" />
                        <div className="cart-product-informations">
                            <h4 className="cart-product-title">{product.productId.title}</h4>
                            <p className="cart-product-price">
                                {product.productId.price.toFixed(2) + ' x ' + product.quantity +
                                    ' = ' + Number(product.productId.price * product.quantity).toFixed(2)}
                            </p>
                        </div>
                        <div className="cart-product-buttons">
                            <button onClick={() => cartQuantityHandle(product.quantity, product.productId._id, 'increase')} className="product-quantity-increase-btn">+</button>
                            <input value={product.quantity} type='number' disabled />
                            <button onClick={() => cartQuantityHandle(product.quantity, product.productId._id, 'dicrease')} className="product-quantity-dicrease-btn">-</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="cart-page-second-div">
                <p className="cart-total-price">
                    <span>Cart Total Price : {cartTotalPrice.toFixed(2)}</span>
                </p>
                <button disabled={cart.length === 0 ? true : false} onClick={() => confirmCartBtnHandle()} className="confirm-cart-btn">Confirm Cart</button>
            </div>
        </div>
    )
}