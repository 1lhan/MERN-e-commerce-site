import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"

export default function PaymentPage() {

    const navigate = useNavigate()
    const { url, userId } = useSelector(state => state.auth)
    const [addresses, SetAddresses] = useState([])
    const [num0, SetNum0] = useState('')
    const [num1, SetNum1] = useState('')
    const [num2, SetNum2] = useState('')
    const [num3, SetNum3] = useState('')
    const [exp0, SetExp0] = useState('')
    const [exp1, SetExp1] = useState('')
    const [cvv, SetCvv] = useState('')
    const [name, SetName] = useState('')
    const [address, SetAddress] = useState({})
    const [cartTotalPrice, SetCartTotalPrice] = useState(0)
    const [installmentNumber, SetInstallmentNumber] = useState(1)
    const [paymentPageErr, SetPaymentPageErr] = useState('')
    const [cart, SetCart] = useState([])

    useEffect(() => {
        fetch(url + 'get-addresses/' + userId)
            .then(res => res.json())
            .then(data => SetAddresses(data))
            .then(
                fetch(url + 'get-cart/' + userId)
                    .then(res => res.json())
                    .then(cart => {
                        SetCart(cart)
                        let cartTotalPrice = 0;
                        for (let i in cart) {
                            cartTotalPrice += Number(cart[i].productId.price) * Number(cart[i].quantity)
                        }
                        SetCartTotalPrice(Number(cartTotalPrice))
                    })
                    .catch(err => console.log(err))
            )
            .catch(err => console.log(err))
    }, [url, userId])

    const cartNumberInputHandle = (e, index) => {
        if (e.target.value.length === e.target.maxLength) {
            if (index === e.target.maxLength - 1) { }
            else {
                document.querySelector('.num' + (index + 1)).focus()
            }
        }
        else if (e.target.value.length === 0) {
            if (index === 0) { }
            else {
                document.querySelector('.num' + (index - 1)).focus()
            }
        }
    }

    const cartExpirationDateInputHandle = (e, index) => {
        if (e.target.value.length === e.target.maxLength) {
            if (index === e.target.maxLength - 1) { }
            else {
                document.querySelector('.exp' + (index + 1)).focus()
            }
        }
        else if (e.target.value.length === 0) {
            if (index === 0) { }
            else {
                document.querySelector('.exp' + (index - 1)).focus()
            }
        }
    }

    const completeShopping = () => {
        let cartNumber = num0 + num1 + num2 + num3
        let cartExpDate = exp0 + '/' + exp1
        let cartCvv = cvv
        let cartName = name

        if (address.address === undefined) {
            SetPaymentPageErr('address')
        }
        else if (cartNumber.length !== 16) {
            SetPaymentPageErr('cartNumber')
        }
        else if ((exp0 + exp1).length !== 4) {
            SetPaymentPageErr('expiration')
        }
        else if (cartCvv.length !== 3) {
            SetPaymentPageErr('cvv')
        }
        else if (name.length < 1) {
            SetPaymentPageErr('name')
        }
        else {
            SetPaymentPageErr('')
            fetch(url + 'add-order/' + userId, {
                method: 'POST',
                headers: {
                    'Accept': 'text/plain, application/json, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cartNumber, cartExpDate, cartCvv, cartName, address: address.address, addressTitle: address.addressTitle, cartTotalPrice, installmentNumber, cart })
            })
                .then(navigate('/my-account/my-orders'))
                .catch(err => console.log(err))
        }
    }

    return (
        <div className="payment-page">
            <NavLink className='back-to-cart-btn' to='/cart'><i className="fa-solid fa-angle-left" />Back to cart</NavLink>

            <div className='address-informations'>
                <h2 className={paymentPageErr === 'address' ? 'err-border' : ''}>Address Informations</h2>
                {addresses && addresses.map((address, index) =>
                    <div className={paymentPageErr === 'address' ? 'err-border address' : 'address'} key={index}>
                        <label htmlFor={'address' + index}>
                            <input onClick={() => SetAddress(address)} id={'address' + index} name="address" type='radio' />
                            <h4 className="address-title">{address.addressTitle}</h4>
                            <p className="address-content">{address.address}</p>
                        </label>
                    </div>
                )}
            </div>

            <div className="payment-informations">
                <h2>Payment Informations</h2>
                <div className="cart-informations">
                    <div className='cart-number'>
                        <h4>Cart Number</h4>
                        <input
                            className={paymentPageErr === 'cartNumber' ? 'err-border num0' : 'num0'}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
                                cartNumberInputHandle(e, 0)
                                SetNum0(e.target.value)
                            }} name='num0' type='text' maxLength='4' required />
                        <input
                            className={paymentPageErr === 'cartNumber' ? 'err-border num1' : 'num1'}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
                                cartNumberInputHandle(e, 1)
                                SetNum1(e.target.value)
                            }} name='num1' type='text' maxLength='4' required />
                        <input
                            className={paymentPageErr === 'cartNumber' ? 'err-border num2' : 'num2'}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
                                cartNumberInputHandle(e, 2)
                                SetNum2(e.target.value)
                            }} name='num2' type='text' maxLength='4' required />
                        <input
                            className={paymentPageErr === 'cartNumber' ? 'err-border num3' : 'num3'}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
                                cartNumberInputHandle(e, 3)
                                SetNum3(e.target.value)
                            }} name='num3' type='text' maxLength='4' required />
                    </div>
                    <div className='other-cart-informations' >
                        <div className="cart-expiration-date">
                            <h4>Expiration date</h4>
                            <div className="cart-expiration-date-inputs">
                                <input
                                    className={paymentPageErr === 'expiration' ? 'err-border exp0' : 'exp0'}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
                                        cartExpirationDateInputHandle(e, 0)
                                        SetExp0(e.target.value)
                                    }} name='exp0' type='text' maxLength='2' required />
                                <input
                                    className={paymentPageErr === 'expiration' ? 'err-border exp1' : 'exp1'}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
                                        cartExpirationDateInputHandle(e, 1)
                                        SetExp1(e.target.value)
                                    }} name='exp1' type='text' maxLength='2' required />
                            </div>
                        </div>
                        <div className='cart-cvv' >
                            <h4>CVV</h4>
                            <div className="cart-cvv-inputs">
                                <input
                                    className={paymentPageErr === 'cvv' ? 'err-border cvv' : 'cvv'}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
                                        SetCvv(e.target.value)
                                    }} name='cvv' type='text' maxLength='3' required />
                            </div>
                        </div>
                    </div>
                    <div className="cart-name-div">
                        <h4>Name</h4>
                        <input className={paymentPageErr === 'name' ? 'err-border' : ''} onInput={(e) => SetName(e.target.value)} type='text' name="cart-name"></input>
                    </div>
                </div>
                <div className="payment-installment">
                    <h2>Installment</h2>
                    <ul className="installment-list">
                        <li>
                            <p className="first-p-tags">Installment Number</p>
                            <p className="first-p-tags">Price per month</p>
                        </li>
                        <li>
                            <label htmlFor="installment1">
                                <input onClick={() => SetInstallmentNumber(1)} id="installment1" name="installment" type='radio' defaultChecked={installmentNumber === 1 ? true : false} />
                                <p>1</p>
                                <p>{cartTotalPrice}</p>
                            </label>
                        </li>
                        <li>
                            <label htmlFor="installment2">
                                <input onClick={() => SetInstallmentNumber(2)} id="installment2" name="installment" type='radio' />
                                <p>2</p>
                                <p>{(cartTotalPrice / 2).toFixed(2)}</p>
                            </label>
                        </li>
                        <li>
                            <label htmlFor="installment3">
                                <input onClick={() => SetInstallmentNumber(3)} id="installment3" name="installment" type='radio' />
                                <p>3</p>
                                <p>{(cartTotalPrice / 3).toFixed(2)}</p>
                            </label>
                        </li>
                        <li>
                            <label htmlFor="installment4">
                                <input onClick={() => SetInstallmentNumber(4)} id="installment4" name="installment" type='radio' />
                                <p>4</p>
                                <p>{(cartTotalPrice / 4).toFixed(2)}</p>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>

            <button className="complete-shopping-btn" onClick={() => completeShopping()}>Complete Shopping</button>
        </div>
    )
}