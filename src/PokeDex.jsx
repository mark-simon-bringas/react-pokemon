/**
 * Main page of the PokéDex.
 * Displays the list of Pokémons depending on the filter given.
*/
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "./Header";
import PokeDetails from "./PokeDetails";
import PokeNotFound from "./PokeNotFound";

export default function PokeDex() {
    const API_URL = 'https://pokeapi.co/api/v2';
    const [pokemon, setPokemon] = useState('');
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemonList, setFilteredPokemonList] = useState([]);
    const [activePokeRegion, setActivePokeRegion] = useState({name: "All Regions", idStart: 1, idEnd: 1025});   // default filter is All Regions
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    // region name, id of the first pokemon of the region, id of the last pokemon in the region
    const regions = {
        all:    {name: "All Regions", idStart: 1, idEnd: 1025},
        kanto:  {name: "Kanto Region", idStart: 1, idEnd: 151},
        johto:  {name: "Johto Region", idStart: 152, idEnd: 251},
        hoenn:  {name: "Hoenn Region", idStart: 252, idEnd: 386},
        sinnoh: {name: "Sinnoh Region", idStart: 387, idEnd: 493},
        unova:  {name: "Unova Region", idStart: 494, idEnd: 649},
        kalos:  {name: "Kalos Region", idStart: 650, idEnd: 721},
        alola:  {name: "Alola Region", idStart: 722, idEnd: 809},
        galar:  {name: "Galar Region", idStart: 810, idEnd: 905},
        paldea: {name: "Paldea Region", idStart: 906, idEnd: 1025}
    };

    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                const response = await axios.get(`${API_URL}/pokemon?limit=1025`);
                setPokemonList(response.data.results);
                setFilteredPokemonList(response.data.results);
            } catch (err) {
                console.error("ERROR: Error in fetching Pokémon list:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllPokemon();
    }, []);
    // handles search filter
    const handleFilters = (searchTerm, region) => {
        const isNumber = !isNaN(searchTerm) && searchTerm.trim() !== '';
        const filteredList = pokemonList.filter((pokemon, index) => {
            const id = (index + 1).toString();
            const inRegion = (region.name === "All Regions") || (id >= region.idStart && id <= region.idEnd);
            if (isNumber) {
                return inRegion && id.toString().startsWith(searchTerm);
            } else {
                return inRegion && pokemon.name.startsWith(searchTerm);
            }
        });
        setFilteredPokemonList(filteredList);
    }
    // handles search term/input
    const handleInputChange = (e) => {
        let searchTerm = e.target.value.toLowerCase().trim();
        setPokemon(searchTerm);
        if (!searchTerm) {
            handleFilters('', activePokeRegion);
            navigate('/');
        } else {
            handleFilters(searchTerm, activePokeRegion);
        }
    };
    // routes to the searched pokemon
    const handleSearch = async () => {
        if (!pokemon.trim()) {
            handleFilters('', activePokeRegion);
            navigate('/');
            return null;
        }
        
        const isPokeId = !isNaN(pokemon) && pokemon.trim() !== '';
        let searchedPokemon;
        if (isPokeId) {
            const id = parseInt(pokemon);
            // routes to pokemon based on the id that was searched
            searchedPokemon = pokemonList.find((_pokemon, index) => (index + 1) === id)
            
        } else {
            // routes to pokemon based on the term/name that was searched
            searchedPokemon = pokemonList.find(p => p.name.toLowerCase() === pokemon.toLowerCase());
        }
        const page = searchedPokemon ? `/${searchedPokemon.name}` : '/404';
        navigate(page);
    };
    // handles filter by region in the dropdown menu
    const handleRegionChange = async (regionName) => {
        const region = regions[regionName.toLowerCase()] || regions.all;
        setActivePokeRegion(region);
        handleFilters(pokemon, region);
    };
    // general function to route to a specific pokemon
    const handlePokeCard = async (pokemon) => {
        navigate(`/${pokemon}`);
    };

    return (
        <>
            <Header 
                input={handleInputChange} 
                search={handleSearch}
                region={handleRegionChange}
            />
            <Routes>
                <Route path="/" element=
                    {
                        isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            filteredPokemonList.length > 0 ? (
                                <>
                                    {/* Region Header */}
                                    <h1>{activePokeRegion.name}</h1>
                                    {/* List of Pokémons basing on region filter */}                                
                                    <div className="pokemon-grid">
                                        {
                                            filteredPokemonList.map((pokemon, index) => {
                                                const regionId = pokemon.url.split('/')[6];
                                                return (
                                                    // Pokémon card component
                                                    <div 
                                                        className="pokemon-card" 
                                                        key={index} 
                                                        onClick={() => handlePokeCard(pokemon.name)}
                                                    >
                                                        <p className="id-number">{`#${regionId}`}</p>
                                                        <img 
                                                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${regionId}.png`} 
                                                            alt={pokemon.name}
                                                        />
                                                        <span className="pokemon-name">
                                                            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                                                        </span>
                                                        
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </>
                            ) : (
                                <p>No Pokémon found.</p>
                            )
                        )
                    }
                />
                <Route path="/:pokemon" element={<PokeDetails />} />
                {/* 404/No Path Pages */}
                <Route path="*" element={<PokeNotFound />} />
                <Route path="/404" element={<PokeNotFound />} />
            </Routes>
        </>
    );
}
