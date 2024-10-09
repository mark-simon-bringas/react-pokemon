import React, { useState, useEffect } from "react";
import axios from 'axios'

export default function PokeDex() {
    const [pokemon, setPokemon] = useState('')
    const [pokeData, setPokeData] = useState(null)
    const [pokemonList, setPokemonList] = useState([])
    const API_URL = 'https://pokeapi.co/api/v2'
    
    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                const response = await axios.get(`${API_URL}/pokemon?limit=100000`); // Fetching first 151 Pokémon
                setPokemonList(response.data.results);
            } catch (err) {
                console.error("ERROR: Error in fetching Pokémon list:", err);
            }
        }
        fetchAllPokemon();
    }, [])
    
    const handleInputChange = (e) => {
        setPokemon(e.target.value.toLowerCase());
    }

    const getPokeData = async (pokemon) => {
        try {
            const response = await axios.get(`${API_URL}/pokemon/${pokemon}`)
            console.log("Data fetched.")
            return response.data
        } catch (err) {
            console.error("ERROR: Error in fetching data:", err)
        }
    }

    const handleSearch = async () => {
        if (!pokemon.trim()) {
            return;
        }
        const data = await getPokeData(pokemon);
        setPokeData(data);
    }

    return (
        <div>
            <input type="text" onChange={handleInputChange} placeholder="Search Pokemon" />
            <button onClick={handleSearch}>Search</button>
            {pokeData ? (
                <div>
                    <h2>{pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1)}</h2>
                    <img src={pokeData.sprites.front_default} alt={pokeData.name} />
                    <p>Height: {pokeData.height}</p>
                    <p>Weight: {pokeData.weight}</p>
                    <p>Type: {pokeData.types.map(type => type.type.name).join(', ')}</p>
                </div>
            ) : (
                <div>
                    {
                        pokemonList.map((pokemon, index) => (
                            <div className="pokemon-card" key={index}>
                                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`} alt={pokemon.name} />
                                <span>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    )
}
