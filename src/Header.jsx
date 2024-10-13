/**
 * Header of the PokéDex.
 * Contains the branding and Home, search field, search button, 
 * and a dropdown menu to filter by Pokémon region.
*/
import { Link } from 'react-router-dom';
import Filters from "./Filters";

export default function Header({ input, search, region }) {
    return (
        <>
            <header>
                <Link to="/" style={{textDecoration: 'none'}}>
                    <h1 title='PokéDex | Home'>PokéDex</h1>
                </Link>
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search Pokémon" 
                        title="Search Pokémon"
                        onChange={input} 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                search();
                            }
                        }}
                    />
                    <button title="Search" onClick={search}>Search</button>
                    <Filters onRegionChange={region} />
                </div>
            </header>  
        </>
    )
};
