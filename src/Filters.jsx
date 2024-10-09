import React, {useState} from 'react'

export default function Filters() {
    
    return (
        <>
            <div>
                <input type="text" />
                <button type="submit">Search</button>
                <select name="" id="">
                    <option value="">Kanto</option>
                    <option value="">Johto</option>
                    <option value="">Hoenn</option>
                    <option value="">Sinno</option>
                    <option value="">Unova</option>
                    <option value="">Kalos</option>
                    <option value="">Alola</option>
                    <option value="">Galar</option>
                    <option value="">Paldea</option>
                </select>
            </div>
        </>
    )
};
