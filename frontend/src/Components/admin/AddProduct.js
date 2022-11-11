import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectTypesObj } from '../../Slices/ProductSlice'

export default function AddProduct() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [title, SetTitle] = useState('')
    const [price, SetPrice] = useState('')
    const [type, SetType] = useState('')
    const { typesArr, selectedTypesObj } = useSelector(state => state.product)
    const { url } = useSelector(state => state.auth)

    const addProduct = (e) => {
        e.preventDefault()

        let formValues = []
        let tags = []

        for (let i = 3; i < (e.nativeEvent.srcElement.length - 1); i++) {
            formValues.push({ [e.nativeEvent.srcElement[i].name]: e.nativeEvent.srcElement[i].value })
        }
        for (let i = 2; i < (e.nativeEvent.srcElement.length - 1); i++) {
            tags.push(e.nativeEvent.srcElement[i].value)
        }
        formValues.push({ type: type })
        fetch(url + 'add-product', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, price, formValues, tags })
        })
            .then(navigate('/admin/products?action=add'))
            .catch(err => console.log(err))
    }

    return (
        <div className='add-product-page'>
            <form onSubmit={addProduct} className="form">
                <h2>Add Product Form</h2>
                <label>
                    <span className='disable'>Title</span>
                    <input onChange={(e) => SetTitle(e.target.value)} name="title" type='text' />
                </label>
                <label>
                    <span className='disable'>Price</span>
                    <input onChange={(e) => SetPrice(e.target.value)} name="price" type='text' />
                </label>
                <label>
                    <span className='disable'>Type</span>
                    <select onChange={(e) => {
                        dispatch(selectTypesObj(e.target.value))
                        SetType(e.target.value)
                    }}>
                        {typesArr && typesArr.map((element, index) =>
                            <option key={index}>{element}</option>
                        )}
                    </select>
                </label>
                {selectedTypesObj.array && selectedTypesObj.array.map((element, index) =>
                    <label key={index}>
                        <span className='disable'>{element}</span>
                        <input name={element} type='text' />
                    </label>
                )}
                <button type="submit">Add Product</button>
            </form>
        </div >
    )
}