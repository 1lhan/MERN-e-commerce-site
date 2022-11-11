import React, { useState } from 'react';
import { useEffect } from "react"
import { useDispatch } from 'react-redux'
import { NavLink, useSearchParams } from 'react-router-dom';
import Loading from './Loading';

export default function ProductsByCategory() {
    const dispatch = useDispatch()
    let [searchParams, SetSearchParams] = useSearchParams()
    const [products, SetProducts] = useState([])
    const [filters, SetFilters] = useState([])
    const [filterValues, SetFilterValues] = useState([])
    const [sortValue, SetSortValue] = useState('')
    const [categoryIsExist, SetCategoryIsExist] = useState(null)
    const path = window.location.pathname;

    const filtersHide = (e) => {
        let classname = e.target.className.split(' ')
        if (classname[1] === 'fa-minus') {
            e.target.parentNode.children[0].classList.remove('active')
            e.target.parentNode.children[1].classList.add('active')
        }
        else if (classname[1] === 'fa-plus') {
            e.target.parentNode.children[1].classList.remove('active')
            e.target.parentNode.children[0].classList.add('active')
        }
    }

    const filterHandle = (obj) => {
        if (obj.name === 'sort') {
            if (obj.value === 'Sort') {
                searchParams.delete('sort')
                SetSearchParams(searchParams)
            }
            else {
                searchParams.delete('sort')
                if (obj.value === 'Price: high to low') {
                    searchParams.append('sort', 'highToLow')
                }
                else if (obj.value === 'Price: low to high') {
                    searchParams.append('sort', 'lowToHigh')
                }
                else if (obj.value === 'Newest products') {
                    searchParams.append('sort', 'newest')
                }
                SetSearchParams(searchParams)
            }
        }
        else {
            if (!searchParams.has(obj.name)) {
                searchParams.append(obj.name, obj.value)
                SetSearchParams(searchParams)
            }
            else {
                if (obj.boolen === true) {
                    let x = searchParams.get(obj.name)
                    let y = `${x}-${obj.value}`
                    searchParams.delete(obj.name)
                    searchParams.append(obj.name, y)
                    SetSearchParams(searchParams)
                }
                else {
                    if (!searchParams.get(obj.name).includes('-')) {
                        searchParams.delete(obj.name, obj.value)
                        SetSearchParams(searchParams)
                    }
                    else {
                        let x = searchParams.get(obj.name)
                        if (searchParams.get(obj.name).includes(`${obj.value}-`)) {
                            let y = x.replace(`${obj.value}-`, '')
                            searchParams.delete(obj.name, obj.value)
                            SetSearchParams(searchParams)
                            searchParams.append(obj.name, y)
                            SetSearchParams(searchParams)
                        }
                        else if (searchParams.get(obj.name).includes(`-${obj.value}`)) {
                            let y = x.replace(`-${obj.value}`, '')
                            searchParams.delete(obj.name, obj.value)
                            SetSearchParams(searchParams)
                            searchParams.append(obj.name, y)
                            SetSearchParams(searchParams)
                        }
                    }
                }
            }
        }
        fetch('http://localhost:5000' + window.location.pathname + window.location.search)
            .then(res => res.json())
            .then(data => {
                SetProducts(data.products)
                SetFilters(data.filters)
            })
    }

    useEffect(() => {
        fetch('http://localhost:5000' + window.location.pathname + window.location.search)
            .then(res => res.json())
            .then(data => {
                SetProducts(data.products)
                SetFilters(data.filters)
                SetFilterValues(data.filterValues);

                if (data.filters.length === 0) {
                    SetCategoryIsExist(false)
                }
                else {
                    SetCategoryIsExist(true)
                }

                if (searchParams.get('sort') === 'highToLow') {
                    SetSortValue('Price: high to low')
                }
                else if (searchParams.get('sort') === 'lowToHigh') {
                    SetSortValue('Price: low to high')
                }
                else if (searchParams.get('sort') === 'newest') {
                    SetSortValue('Newest products')
                }
                else {
                    SetSortValue('Sort')
                }
            })
    }, [dispatch, path, searchParams])

    if (categoryIsExist === null) {
        return (
            <Loading />
        )
    }
    else if (categoryIsExist === false) {
        return (
            <NavLink className='page-not-founded-btn' to='/'>Page not founded, back to main page</NavLink>
        )
    }
    return (
        <div className="products-page">
            <div className="filters-div">
                <div className='sort-div'>
                    <select value={sortValue} onChange={(e) => filterHandle({ name: 'sort', value: e.target.value })}>
                        <option>Sort</option>
                        <option>Price: high to low</option>
                        <option>Price: low to high</option>
                        <option>Newest products</option>
                    </select>
                </div>
                {filters && filters.map((f, i) =>
                    <div key={i} className="filter-div">
                        <h4 className='filter-title'>{f.name}
                            <label htmlFor={'filters-hide' + f.name}>
                                <i onClick={(e) => filtersHide(e)} className={"fa-solid fa-minus filter-hide-btn active"} />
                                <i onClick={(e) => filtersHide(e)} className="fa-solid fa-plus filter-hide-btn" />
                            </label></h4>
                        <input className='filter-hide-checkbox' id={'filters-hide' + f.name} type='checkbox' />
                        <div className="filters">
                            {f.arr && f.arr.map((filter, index) =>
                                <label className='filter-element' key={index}>
                                    <input
                                        defaultChecked={filterValues.find(f => f === filter ? true : false)}
                                        onChange={(e) => filterHandle({ name: f.name, value: filter, boolen: e.target.checked })}
                                        type='checkbox'>
                                    </input>{filter}
                                </label>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="product-div-flex-box">
                <div className="products-div">
                    {products && products.map((p, i) =>
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
    )
}