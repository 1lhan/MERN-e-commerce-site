import { Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Homepage from './Components/Homepage';
import Login from './Components/Login';
import Register from './Components/Register';
import UserInformations from './Components/my-profile/UserInformations';
import MyOrders from './Components/my-profile/MyOrders';
import Favorites from './Components/my-profile/Favorites';
import { useSelector } from 'react-redux';
import AdminProducts from './Components/admin/AdminProducts';
import AddProduct from './Components/admin/AddProduct';
import Product from './Components/Product';
import Cart from './Components/Cart';
import ProductsByType from './Components/ProductsByType';
import EditProduct from './Components/admin/EditProduct';
import Addresses from './Components/my-profile/Addresses';
import PaymentPage from './Components/PaymentPage';
import AdminOrders from './Components/admin/AdminOrders';

export default function RouteController() {

    const { isLoggedin, user } = useSelector(state => state.auth)

    return (
        <div className="route-div">
            <header>
                <Routes>
                    <Route path='/*' element={<Header />}></Route>
                </Routes>
            </header>
            <section className='container'>
                <Routes>
                    <Route path='/' element={<Homepage />}></Route>
                    <Route path='/product/:productId' element={<Product />} />
                    <Route path='/category/:categoryName' element={<ProductsByType />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/payment' element={<PaymentPage />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />

                    {isLoggedin ?
                        <Route path='/my-account'>
                            <Route path='user-informations' element={<UserInformations />} />
                            <Route path='my-orders' element={<MyOrders />} />
                            <Route path='addresses' element={<Addresses />} />
                            <Route path='favorites' element={<Favorites />} />
                        </Route>
                        :
                        <Route path='/my-account'>
                            <Route path='*' element={<Login />} />
                        </Route>
                    }

                    {user.accType === 'admin' ?
                        <Route path='/admin/'>
                            <Route path='orders' element={<AdminOrders />} />
                            <Route path='products' element={<AdminProducts />} />
                            <Route path='product/:productId' element={<EditProduct />} />
                            <Route path='add-product' element={<AddProduct />} />
                        </Route>
                        : ''}
                </Routes>
            </section>
        </div>
    )
}