import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MyProfileLinks from "./MyProfileLinks";

export default function Addresses() {

    const navigate = useNavigate()
    const { url, userId } = useSelector(state => state.auth)
    const [addAddressTitle, SetAddAddressTitle] = useState('')
    const [addAddress, SetAddAddress] = useState('')
    const [addAddressFormController, SetAddAddressFormController] = useState(false)
    const [addresses, SetAddresses] = useState([])
    const [refreshDataController, SetRefreshDataController] = useState(0)
    const [selectedAddress, SetSelectedAddress] = useState({})

    const [editAddressFormController, SetEditAddressFormController] = useState(false)
    const [editAddressTitle, SetEditAddressTitle] = useState('')
    const [editAddress, SetEditAddress] = useState('')

    useEffect(() => {
        fetch(url + 'get-addresses/' + userId)
            .then(res => res.json())
            .then(data => {
                SetAddresses(data)
            })
            .catch(err => console.log(err))
    }, [url, userId, refreshDataController])

    const addAddressHandle = (e) => {
        e.preventDefault()
        fetch(url + 'add-address', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, address: addAddress, addressTitle: addAddressTitle })
        })
            .then(SetAddAddressFormController(false))
            .then(navigate('/my-account/addresses?action=add'))
            .then(SetRefreshDataController(refreshDataController + 1))
            .catch(err => console.log(err))
    }

    const deleteAddressHandle = (addressId) => {
        let x = window.confirm('Are sure about that you want delete address ?')
        if (x) {
            fetch(url + 'delete-address', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, addressId })
            })
                .then(navigate('/my-account/addresses?action=delete'))
                .then(SetRefreshDataController(refreshDataController + 1))
                .catch(err => console.log(err))
        }
    }

    const updateAddressHandle = (e, addressId) => {
        e.preventDefault()
        fetch(url + 'update-address', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, addressId, editAddressTitle, editAddress })
        })
            .then(SetEditAddressFormController(false))
            .then(navigate('/my-account/addresses?action=update'))
            .then(SetRefreshDataController(refreshDataController + 1))
            .catch(err => console.log(err))
    }

    return (
        <div className="addresses-page">
            <MyProfileLinks />
            <div className="addresses-page-second-div">
                <h2 className="page-title">
                    Addresses
                    <button onClick={() => SetAddAddressFormController(true)}>Add Address</button>
                </h2>
                <div className="addresses">
                    {addresses && addresses.map((address, index) =>
                        <div key={index} className="address">
                            <div>
                                <h4 className="address-title">{address.addressTitle}</h4>
                                <i onClick={() => deleteAddressHandle(address._id)} className="fa-regular fa-trash-can delete-address-btn" />
                                <i onClick={() => {
                                    SetEditAddressFormController(true)
                                    SetSelectedAddress(address)
                                    SetEditAddressTitle(address.addressTitle)
                                    SetEditAddress(address.address)
                                }} className="fa-regular fa-pen-to-square edit-address-btn" />
                            </div>
                            <p className="address-content">{address.address}</p>
                        </div>
                    )}
                </div>
                <div style={{ display: addAddressFormController ? 'flex' : 'none' }} className="add-address-div blur">
                    <form onSubmit={addAddressHandle} className="add-address-form form">
                        <h2>
                            Add Address Form
                            <i onClick={() => SetAddAddressFormController(false)} className="fa-solid fa-xmark close-btn" />
                        </h2>
                        <label>
                            <span className="disable">Address Title</span>
                            <input type='text' onChange={(e) => SetAddAddressTitle(e.target.value)} name="address-title" />
                        </label>
                        <label>
                            <span className="disable">Address</span>
                            <textarea onChange={(e) => SetAddAddress(e.target.value)} name="address-title" />
                        </label>
                        <button type="submit">Add Address</button>
                    </form>
                </div>
                <div style={{ display: editAddressFormController ? 'flex' : 'none' }} className="edit-address-div blur">
                    <form onSubmit={(e) => updateAddressHandle(e, selectedAddress._id)} className="add-address-form form">
                        <h2>
                            Edit Address Form
                            <i onClick={() => SetEditAddressFormController(false)} className="fa-solid fa-xmark close-btn" />
                        </h2>
                        <label>
                            <span className="disable">Address Title</span>
                            <input defaultValue={selectedAddress.addressTitle} type='text' onChange={(e) => SetEditAddressTitle(e.target.value)} name="address-title" />
                        </label>
                        <label>
                            <span className="disable">Address</span>
                            <textarea defaultValue={selectedAddress.address} onChange={(e) => SetEditAddress(e.target.value)} name="address-title" />
                        </label>
                        <button type="submit">Add Address</button>
                    </form>
                </div>
            </div>
        </div>
    )
}