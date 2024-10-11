import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Filters({ onRegionChange }) {
    const [regions, setRegions] = useState([])
    const API_URL = 'https://pokeapi.co/api/v2'

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await axios.get(`${API_URL}/region`)
                const discardHisui = response.data.results.filter(
                    region => region.name.toLowerCase() !== 'hisui'
                )
                setRegions(discardHisui)
            } catch (err) {
                console.error("ERROR: Error in fetching regions:", err)
            }
        }
        fetchRegions()
    }, [])

    return (
        <select onChange={(e) => onRegionChange(e.target.value)} className="filter-dropdown">
            <option>All Regions</option>
            {
                regions.map((region) => (
                    <option key={region.name} value={region.name}>
                        {region.name.charAt(0).toUpperCase() + region.name.slice(1)}
                    </option>
                ))
            }
        </select>
    )
}
