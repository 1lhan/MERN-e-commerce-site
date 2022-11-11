import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

export default function EditProduct() {

    const navigate = useNavigate()
    const [product, SetProduct] = useState([])
    const { url } = useSelector(state => state.auth)
    const { typesArr } = useSelector(state => state.product)
    const { productId } = useParams()
    const [type, SetType] = useState('')

    useEffect(() => {
        fetch(url + 'product/' + productId)
            .then(res => res.json())
            .then(data => {
                for (let i in data.product.informations) {
                    if (Object.keys(data.product.informations[i])[0] === 'type') {
                        SetType(Object.values(data.product.informations[i])[0])
                    }
                }
                SetProduct(data.product)
            })
            .catch(err => console.log(err))
    }, [url, productId])

    const updateProduct = (e) => {
        e.preventDefault()
        const formValues = { title: '', price: '', tags: [], informations: [] }
        formValues.title = e.nativeEvent.srcElement[0].value
        formValues.price = Number(e.nativeEvent.srcElement[1].value)

        for (let i = 2; i < (e.nativeEvent.srcElement.length - 1); i++) {
            formValues.informations.push({ [e.nativeEvent.srcElement[i].name]: e.nativeEvent.srcElement[i].value });
            formValues.tags.push(e.nativeEvent.srcElement[i].value)
        }

        fetch(url + 'update-product', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, formValues })
        })
            .then(navigate('/admin/products?action=update'))
            .catch(err => console.log(err))
    }

    return (
        <div className="edit-product-page">
            <form onSubmit={updateProduct} className='product-edit-form form'>
                <h2>Edit Product Form</h2>
                <label>
                    <span className='disable'>Title</span>
                    <input name='title' defaultValue={product.title} type='text' />
                </label>
                <label>
                    <span className='disable'>Price</span>
                    <input name='price' defaultValue={product.price} type='text' />
                </label>
                {product.informations && product.informations.map((element, index) =>
                    Object.keys(element)[0] !== 'type' ?
                        <label key={index}>
                            <span className='disable'>{Object.keys(element)[0]}</span>
                            <input name={Object.keys(element)[0]} defaultValue={Object.values(element)[0]} type='text' required />
                        </label> : ''
                )}
                {product.informations &&
                    <select defaultValue={type} name="type">
                        {typesArr && typesArr.map((t, i) =>
                            <option key={i}>{t}</option>
                        )}
                    </select>}
                <button type='submit'>Update Product</button>
            </form>
        </div >
    )
}