import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function AdminOrders() {

    const navigate = useNavigate()
    const { url } = useSelector(state => state.auth)
    const [orders, SetOrders] = useState([])
    const [updateOrderDpController, SetUpdateOrderDpController] = useState(false)
    const [status, SetStatus] = useState('')
    const [orderId, SetOrderId] = useState('')

    useEffect(() => {
        fetch(url + 'admin-orders')
            .then(res => res.json())
            .then(orders => SetOrders(orders))
            .catch(err => console.log(err))
    }, [url])

    const updateOrder = (e) => {
        e.preventDefault()

        fetch(url + 'admin-update-order', {
            method: 'POST',
            headers: {
                'Accept': 'application/json,text/plain,*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderId, status })
        })
            .then(SetUpdateOrderDpController(false))
            .then(navigate('/admin/orders?action=update'))
            .then(fetch(url + 'admin-orders')
                .then(res => res.json())
                .then(orders => SetOrders(orders))
                .catch(err => console.log(err)))
            .catch(err => console.log(err))
    }

    return (
        <div className="admin-orders">
            <h2 className="page-title">Admin Orders</h2>
            <div className="orders">
                {orders && orders.map((order, index) =>
                    <div key={index} className="order">
                        <div className="order-top-div">
                            <div className="order-top-div-first">
                                <p className="order-id order-p-element"><span>Order Id :</span>{order._id}</p>
                                <p className="order-id order-p-element"><span>User Id :</span>{order.userId}</p>
                                <p className="order-status order-p-element"><span style={{ color: '#10b981' }}>Status :</span>{order.status}</p>
                                <p className="price order-p-element"><span>Order Price :</span>{order.cartTotalPrice}</p>
                                <p className="order-date order-p-element"><span>Date :</span>{order.date}</p>
                            </div>
                            <div className="order-top-div-second">
                                <button onClick={() => {
                                    SetUpdateOrderDpController(true)
                                    SetOrderId(order._id)
                                    SetStatus(order.status)
                                }} className="update-order-btn"><i className="fa-regular fa-pen-to-square" /></button>
                                <label htmlFor={'order' + index}>
                                    <i className="fa-solid fa-plus details-btn" />
                                </label>
                            </div>
                        </div>
                        <div className="order-bottom-div">
                            {order.cart && order.cart.map((product, index) =>
                                <div key={index} className="order-product">
                                    <div className="img" />
                                    <div className="order-product-second-div">
                                        <p className="title order-p-element"><span>title:</span>{product.productId.title}</p>
                                        <p className="price order-p-element"><span>price : </span>{product.productId.price}</p>
                                        <p className="piece order-p-element"><span>quantity : </span>{product.quantity}</p>
                                        <p className="total-price order-p-element"><span>total price : </span>{Number(product.productId.price) * Number(product.quantity)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input id={'order' + index} type='checkbox' />
                        <div className="order-dropdown">
                            <p className="order-p-element"><span>Address Title :</span>{order.addressInformations.addressTitle}</p>
                            <p className="order-p-element"><span>Address :</span>{order.addressInformations.address}</p>
                            <p className="order-p-element"><span>Cart Name :</span>{order.cartInformations.cartName}</p>
                            <p className="order-p-element"><span>Cart Number :</span>{order.cartInformations.cartNumber.substring(0, 4) + ' **** **** ' + order.cartInformations.cartNumber.substring(12, 16)}</p>
                            <p className="order-p-element"><span>Installment Number :</span>{order.installmentNumber}</p>
                        </div>
                    </div>
                )}
            </div>
            <div style={{ display: updateOrderDpController ? 'flex' : 'none' }} className="update-order-div blur">
                <form onSubmit={updateOrder} className="form">
                    <h2>Update Order Form<i onClick={() => SetUpdateOrderDpController(false)} className="fa-solid fa-xmark close-btn" /></h2>
                    <div className="form-row">
                        <h4>Status</h4>
                        <select value={status} onChange={(e) => SetStatus(e.target.value)}>
                            <option onSelect={(e) => SetStatus(e.target.value)}>waiting</option>
                            <option onSelect={(e) => SetStatus(e.target.value)}>preparing</option>
                            <option onSelect={(e) => SetStatus(e.target.value)}>shipped</option>
                            <option onSelect={(e) => SetStatus(e.target.value)}>delivered</option>
                        </select>
                    </div>
                    <button type="submit">Update Order</button>
                </form>
            </div>
        </div>
    )
}