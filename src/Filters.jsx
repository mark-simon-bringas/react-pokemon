/**
 * Integrated in the dropdown menu to filter list of Pokémon by Pokémon region.
 * Hisui region is discarded.
*/
import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function Filters({ onRegionChange }) {
    const [regions, setRegions] = useState([]);
    const API_URL = 'https://pokeapi.co/api/v2';

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await axios.get(`${API_URL}/region`);
                const discardHisui = response.data.results.filter(
                    region => region.name.toLowerCase() !== 'hisui'
                );
                setRegions(discardHisui);
            } catch (err) {
                console.error("ERROR: Error in fetching regions:", err);
            }
        }
        fetchRegions();
    }, []);

    return (
        <>
            <div className='filter-container' >
                <select className="filter-dropdown" onChange={(e) => onRegionChange(e.target.value)}>
                    <option title="All Regions">All Regions</option>
                    {
                        regions.map((region) => (
                            <option key={region.name} value={region.name} title={region.name.charAt(0).toUpperCase() + region.name.slice(1)}>
                                {region.name.charAt(0).toUpperCase() + region.name.slice(1)}
                            </option>
                        ))
                    };
                </select>
            </div>
        </>
    );
}

Filters.propTypes = {onRegionChange: PropTypes.func.isRequired};
