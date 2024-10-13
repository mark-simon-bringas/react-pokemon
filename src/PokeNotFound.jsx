/**
 * 404 Not Found page of the PokéDex.
*/
import UnownQuestionMark from './assets/unown-question-mark.gif';   // located in assets folder, change GIF if necessary

export default function PokeNotFound() {
    return (
        <>
            <div className='404-not-found'>
                <h2>Error 404: Not Found</h2>
                <img src={UnownQuestionMark} alt="unown-question-mark" title='404 Not Found' />
                <h3><i>Oh no! The wild Pokémon fled!</i></h3>
                <p>Or, the Pokémon searched does not exist.</p>
                <p>Please check if you have entered the correct Pokémon name or ID.</p>
            </div>
        </>
    )
}