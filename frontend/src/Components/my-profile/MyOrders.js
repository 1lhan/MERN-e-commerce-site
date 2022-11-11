import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MyProfileLinks from "./MyProfileLinks";

export default function MyOrders() {

    const { userId, url } = useSelector(state => state.auth);
    const [orders, SetOrders] = useState([])

    useEffect(() => {
        fetch(url + 'get-orders/' + userId)
            .then(res => res.json())
            .then(data => {
                SetOrders(data)
            })
            .catch(err => console.log(err))
    }, [userId, url])

    return (
        <div className="my-orders-page">
            <MyProfileLinks />
            <div className="my-orders-page-second-div">
                <h2 className="page-title">My Orders</h2>
                <div className="orders">
                    {orders && orders.map((order, index) =>
                        <div key={index} className="order">
                            <div className="order-top-div">
                                <div className="order-top-div-first">
                                    <p className="order-id order-p-element"><span>Order Id :</span>{order.orderId._id}</p>
                                    <p className="order-status order-p-element"><span style={{ color: '#10b981' }}>Status :</span>{order.orderId.status}</p>
                                    <p className="price order-p-element"><span>Order Price :</span>{order.orderId.cartTotalPrice}</p>
                                    <p className="order-date order-p-element"><span>Date :</span>{order.orderId.date}</p>
                                </div>
                                <div className="order-top-div-second">
                                    <label htmlFor={'order' + index}>
                                        <i className="fa-solid fa-plus details-btn" />
                                    </label>
                                </div>
                            </div>
                            <div className="order-bottom-div">
                                {order.orderId.cart && order.orderId.cart.map((product, index) =>
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
                                <p className="order-p-element"><span>Address Title :</span>{order.orderId.addressInformations.addressTitle}</p>
                                <p className="order-p-element"><span>Address :</span>{order.orderId.addressInformations.address}</p>
                                <p className="order-p-element"><span>Cart Name :</span>{order.orderId.cartInformations.cartName}</p>
                                <p className="order-p-element"><span>Cart Number :</span>{order.orderId.cartInformations.cartNumber.substring(0, 4) + ' **** **** ' + order.orderId.cartInformations.cartNumber.substring(12, 16)}</p>
                                <p className="order-p-element"><span>Installment Number :</span>{order.orderId.installmentNumber}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}