import Filters from "./Filters";

export default function Header({ input, search, region }) {
    return (
        <>
            <header>
                <h1>PokéDex</h1>
                <div className="search-bar">
                    <input type="text" onChange={input} placeholder="Search Pokemon" />
                    <button onClick={search}>Search</button>
                    <Filters onRegionChange={region} />
                </div>
            </header>  
        </>
    )
};
