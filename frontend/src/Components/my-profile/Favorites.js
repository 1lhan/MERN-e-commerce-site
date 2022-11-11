import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MyProfileLinks from "./MyProfileLinks";
import { NavLink } from "react-router-dom";

export default function Favorites() {

    const { url, userId } = useSelector(state => state.auth)
    const [favorites, SetFavorites] = useState([])
    const [refreshDataController, SetRefreshDataController] = useState(0)

    useEffect(() => {
        fetch(url + 'get-favorites-and-cart/' + userId)
            .then(res => res.json())
            .then(data => SetFavorites(data.favorites))
            .catch(err => console.log(err))
    }, [url, userId, refreshDataController])

    const addToFavorites = (productId) => {
        fetch(url + 'favorites', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, productId })
        })
            .then(() => SetRefreshDataController(refreshDataController + 1))
            .catch(err => console.log(err))
    }

    return (
        <div className="favorites-page">
            <MyProfileLinks />
            <div className="favorites-page-second-div">
                <h2 className="page-title">My Favorite Products</h2>
                {favorites.length > 0 ?
                    <div className="favorite-products">
                        {favorites && favorites.map((favorite, index) =>
                            <div key={index} className="favorite-product">
                                <div className="img" />
                                <div className="favorite-product-second-div">
                                    <NavLink to={'/product/' + favorite.productId._id} className="title">{favorite.productId.title}</NavLink>
                                    <p className="price">{Number(favorite.productId.price).toFixed(2)}</p>
                                </div>
                                <i onClick={() => addToFavorites(favorite.productId._id)}
                                    className="fa-regular fa-bookmark add-to-favorites-btn" />
                            </div>
                        )}
                    </div>
                    :
                    <p className="loading">There is not any favorite product</p>
                }
            </div>
        </div>
    )
}