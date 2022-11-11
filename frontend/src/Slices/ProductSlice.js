import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getProducts = createAsyncThunk('Product/getProducts', async (query) => {
    return await fetch(`http://localhost:5000/products/${query}`)
        .then(res => res.json()).catch(err => console.log(err))
})

export const ProductSlice = createSlice({
    name: 'Product',
    initialState: {
        status: null,
        products: [],
        selectedTypesObj: {},
        typesArr: ['Choose type', 'mouse', 'gpu', 'cpu', 'motherboard', 'keyboard', 'hdd', 'ssd', 'ram'],
        typesObj: [{ type: 'Choose type', array: [] }, { type: 'mouse', array: ['brand', 'dpi'] }, { type: 'gpu', array: ['brand', 'graphics memory', 'graphics processor', 'bit value'] }, { type: 'cpu', array: ['brand'] }, { type: 'motherboard', array: ['brand', 'processor type', 'processor socket type', 'motherboard size'] }, { type: 'keyboard', array: ['brand'] }, { type: 'hdd', array: ['brand'] }, { type: 'ssd', array: ['brand'] }, { type: 'ram', array: ['brand', 'ram type', 'capacity', 'frequency speed', 'cl'] }],
        categories: [{ name: 'Computer Components', arr: ['motherboard', 'gpu', 'cpu', 'ram', 'hdd', 'ssd'] }, { name: 'Computer Peripherals', arr: ['mouse', 'keyboard'] }],
    },
    extraReducers: {
        [getProducts.pending]: (state, action) => { state.status = 'pending' },
        [getProducts.fulfilled]: (state, action) => {
            state.status = 'fullfilled';
            state.products = action.payload.products;
        },
        [getProducts.rejected]: (state, action) => { state.status = 'rejected' }
    },
    reducers: {
        selectTypesObj: (state, action) => {
            state.selectedTypesObj = state.typesObj.find(element => element.type === action.payload)
        }
    }
})

export const { selectTypesObj } = ProductSlice.actions;
export default ProductSlice.reducer;