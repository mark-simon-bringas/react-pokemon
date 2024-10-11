import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from "./Header";

export default function PokeDex() {
    const [pokemon, setPokemon] = useState('');
    const [pokeData, setPokeData] = useState(null);
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemonList, setFilteredPokemonList] = useState([]);
    const API_URL = 'https://pokeapi.co/api/v2';

    const regions = {
        // Your region data...
    };

    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                const response = await axios.get(`${API_URL}/pokemon?limit=100000`);
                setPokemonList(response.data.results);
                setFilteredPokemonList(response.data.results);  // Initialize filtered list
            } catch (err) {
                console.error("ERROR: Error in fetching Pokémon list:", err);
            }
        };
        fetchAllPokemon();
    }, []);

    // Automatically detect whether input is a number or name
    const handleInputChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setPokemon(searchTerm);

        // Check if the searchTerm is a number or a string
        const isNumber = !isNaN(searchTerm) && searchTerm.trim() !== '';

        // Filter the list based on whether it's a number or name
        const filteredList = pokemonList.filter((pokemon, index) => {
            const pokemonID = (index + 1).toString();  // Pokémon ID based on the index
            if (isNumber) {
                // If searching by number, check if the Pokémon ID starts with the search term
                return pokemonID.startsWith(searchTerm);
            } else {
                // If searching by name, check if the Pokémon name starts with the search term
                return pokemon.name.startsWith(searchTerm);
            }
        });
        setFilteredPokemonList(filteredList);
    };

    const handleSearch = async () => {
        if (!pokemon.trim()) {
            return;
        }
        const data = await getPokeData(pokemon);
        if (data) {
            const pokeDesc = await getPokeDesc(data.id);
            if (pokeDesc) {
                const englishDesc = pokeDesc.flavor_text_entries.find(entry => entry.language.name === 'en');
                data.description = englishDesc
                    ? englishDesc.flavor_text
                        .replace(/&#\d+;/g, '')
                        .replace(/[^\w\s,.!?'-]/g, '')
                        .replace(/\n/g, ' ')
                        .replace(/\u000C/g, ' ')
                        .trim()
                    : "Description not found.";
                setPokeData(data);
            }
        }
    };

    const handleRegionChange = (regionName) => {
        // Your region filter logic...
    };

    return (
        <div>
            <Header 
                input={handleInputChange}  // Pass the input handler to Header
                search={handleSearch}  // Pass the search handler to Header
                region={handleRegionChange}  // Pass the region handler to Header
            />

            {pokeData ? (
                <div>
                    <h2>{pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1)}</h2>
                    <img src={pokeData.sprites.front_default} alt={pokeData.name} />
                    <p>Height: {pokeData.height}</p>
                    <p>Weight: {pokeData.weight}</p>
                    <p>Type: {pokeData.types.map(type => type.type.name).join(', ')}</p>
                    <p>Description: {pokeData.description}</p>
                </div>
            ) : (
                <div className="pokemon-grid">
                    {filteredPokemonList.length > 0 ? (
                        filteredPokemonList.map((pokemon, index) => {
                            const regionId = pokemon.url.split('/')[6];
                            return (
                                <div className="pokemon-card" key={index}>
                                    <p className="id-number">{`#${regionId}`}</p>
                                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${regionId}.png`} alt={pokemon.name} />
                                    <span className="pokemon-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
                                </div>
                            );
                        })
                    ) : (
                        <p>No Pokémon found</p>
                    )}
                </div>
            )}
        </div>
    );
}
