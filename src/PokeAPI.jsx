import axios from 'axios'

const API_URL = 'https://pokeapi.co/api/v2'

export const getPokeData = async (pokemon) => {
    try {
        const response = await axios.get(`${API_URL}/pokemon/${pokemon}`)
        console.log("Data fetched.")
        return response.data
    } catch (err) {
        console.error("ERROR: Error in fetching data:", err)
    }
}
