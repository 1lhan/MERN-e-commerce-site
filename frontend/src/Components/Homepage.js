import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"

export default function Homepage() {

    const [products, setProducts] = useState({})
    const { url } = useSelector(state => state.auth)

    useEffect(() => {
        fetch(url + 'products-for-homepage')
            .then(res => res.json())
            .then(data => setProducts({ mostSoldProducts: data.mostSoldProducts, mostNewProducts: data.mostNewProducts }))
            .then()
            .catch(err => console.log(err))
    }, [url])

    const slideHandle = (e, n) => {
        let element = e.target.parentNode.parentNode.parentNode.children[1].children[0]
        let slideNumber = element.className.split(' ')[1].split('-')[1]

        if (n === 'right') {
            if (Number(slideNumber) === 4) {
                return element.className = (element.className.split(' ')[0] + (' slide-0'))
            }
            else if (slideNumber !== 0) {
                return element.className = (element.className.split(' ')[0] + (' slide-' + (Number(slideNumber) + 1)))
            }
        }
        if (n === 'left') {
            if (Number(slideNumber) === 0) {
                return element.className = (element.className.split(' ')[0] + (' slide-4'))
            }
            else if (slideNumber !== 1) {
                return element.className = (element.className.split(' ')[0] + (' slide-' + (Number(slideNumber) - 1)))
            }
        }
    }

    return (
        <div className="home-page">
            <div className="sections">
                <div className="section-top-div">
                    <h2>Most New Products</h2>
                    <div className="section-top-div-buttons">
                        <i onClick={(e) => slideHandle(e, 'left')} className="fa-solid fa-chevron-left" />
                        <i onClick={(e) => slideHandle(e, 'right')} className="fa-solid fa-chevron-right" />
                    </div>
                </div>
                <div className="products">
                    <div className="products-div-flex-box slide-0">
                        {products.mostNewProducts && products.mostNewProducts.map((p, i) =>
                            <div key={i} className="product-div">
                                <div className="product-div-flexbox">
                                    <div className="img"></div>
                                    <div className="product-bottom-div">
                                        <NavLink
                                            className='product-title'
                                            to={'/product/' + p._id}>{p.title}
                                        </NavLink>
                                        <p className='product-price'>{Number(p.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="sections">
                <div className="section-top-div">
                    <h2>Most Sold Products</h2>
                    <div className="section-top-div-buttons">
                        <i onClick={(e) => slideHandle(e, 'left')} className="fa-solid fa-chevron-left" />
                        <i onClick={(e) => slideHandle(e, 'right')} className="fa-solid fa-chevron-right" />
                    </div>
                </div>
                <div className="products">
                    <div className="products-div-flex-box slide-0">
                        {products.mostSoldProducts && products.mostSoldProducts.map((p, i) =>
                            <div key={i} className="product-div">
                                <div className="product-div-flexbox">
                                    <div className="img"></div>
                                    <div className="product-bottom-div">
                                        <NavLink
                                            className='product-title'
                                            to={'/product/' + p._id}>{p.title}
                                        </NavLink>
                                        <p className='product-price'>{Number(p.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}