import { Link } from 'react-router-dom';
import Filters from "./Filters";

export default function Header({ input, search, region }) {
    return (
        <>
            <header>
                <Link to="/" style={{textDecoration: 'none'}}>
                    <h1>PokéDex</h1>
                </Link>
                <div className="search-bar">
                    <input 
                        type="text" 
                        onChange={input} 
                        placeholder="Search Pokemon" 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                search();
                            }
                        }}
                    />
                    <button onClick={search}>Search</button>
                    <Filters onRegionChange={region} />
                </div>
            </header>  
        </>
    )
};
