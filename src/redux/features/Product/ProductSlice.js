import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import axios from 'axios'

const fetchPlants = createAsyncThunk(
    'product/fetchPlants',
    async ( ) => {
        try {
            const plantResponse = await axios.get('/products')
            const plantData = plantResponse.data

            const imageResponse = await axios.get('/products/image')
            const imageData = imageResponse.data
            
            const speciesResponse = await axios.get('/products/species')
            const speciesData = speciesResponse.data

            return {plants: plantData, images: imageData, species: speciesData }

        } catch (error) {
            console.log(error)
            return []
        }
    }
)

const ProductSlice = createSlice({
    name: 'product',
    initialState: {
        plants: [],
        species: [],
        images: []
    },
    reducers: {
        
    },
    extraReducers: {
        [fetchPlants.fulfilled] : (state, action) => {
            const { plants, images, species } = action.payload

            const newImageFullURL = images.map((image) => {
                return {...image, DUONGDAN: `http://localhost:4000/images/${image.DUONGDAN}`}
            })

            return {
                plants: plants.map(( plant ) => {
                    plant.key = plant.MACAYCANH
                    plant.images = newImageFullURL.filter((img ) => {
                        return img.MACAYCANH === plant.MACAYCANH 
                    })
                    return plant
                }),
                species: species,
                images: newImageFullURL
            }
        }
    }

})


export { fetchPlants }
export default ProductSlice.reducer
