export default function Header({ input, search }) {
    return (
        <>
            <header>
                <h1>PokeDex</h1>
                <div className="search-bar">
                    <input type="text" onChange={input} placeholder="Search Pokemon" />
                    <button onClick={search}>Search</button>
                </div>
            </header>  
        </>
    )
};
