import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'

export default function AdminProducts() {

    const navigate = useNavigate()
    let [searchParams, SetSearchParams] = useSearchParams()

    const { url } = useSelector(state => state.auth)
    const [products, SetProducts] = useState([])
    const [pageLength, SetPageLength] = useState([])
    const [pageNumber, SetPageNumber] = useState(1)

    const getAdminProducts = () => {
        fetch(url + 'admin-products' + window.location.search)
            .then(res => res.json())
            .then(data => {
                let pageNumbers = []
                SetProducts(data.products)
                for (let i = 1; i < (data.pageLength + 1); i++) {
                    pageNumbers.push(i)
                }
                pageNumbers = [...new Set(pageNumbers)]
                SetPageLength(pageNumbers)
            })
    }

    useEffect(() => {
        fetch(url + 'admin-products' + window.location.search)
            .then(res => res.json())
            .then(data => {
                let pageNumbers = []
                SetProducts(data.products)
                for (let i = 1; i < (data.pageLength + 1); i++) {
                    pageNumbers.push(i)
                }
                pageNumbers = [...new Set(pageNumbers)]
                SetPageLength(pageNumbers)
            })
    }, [url])

    const deleteProduct = (productId) => {
        fetch(url + 'delete-product', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        })
            .then(navigate('/admin/products?action=delete'))
            .catch(err => console.log(err))
    }

    const selectPageHandle = (p) => {
        if (Number(p) === 1) {
            if (searchParams.has('page')) {
                searchParams.delete('page')
                SetSearchParams(searchParams)
                getAdminProducts()
                SetPageNumber(p)
            }
        }
        else {
            SetSearchParams({ page: p })
            getAdminProducts()
            SetPageNumber(p)
        }
    }

    return (
        <div className='admin-products-page'>
            <table>
                <thead>
                    <tr>
                        <td>Title</td>
                        <td>Price</td>
                        <td>Tags</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {products && products.map((product, index) =>
                        <tr key={index}>
                            <td>{product.title}</td>
                            <td>{product.price}</td>
                            <td>{product.tags.map((tag, index2) =>
                                <span key={index2}>{tag + ' '}</span>
                            )}</td>
                            <td>
                                <NavLink className='product-update-btn' to={'/admin/product/' + product._id}>Update</NavLink>
                                <button onClick={() => deleteProduct(product._id)} className='product-delete-btn'>Delete</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className='page-numbers-div'>
                {pageLength && pageLength.map((p, i) =>
                    <button style={{ background: pageNumber === p ? '#fbbf24' : '' }} onClick={() => selectPageHandle(p)} key={i}>{p}</button>
                )}
            </div>
        </div>
    )
}