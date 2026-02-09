// Component
import PokeCard from "./PokeCard";
// Asset
import cryingPikachu from "../assets/pikachu/crying-pikachu.png"
// CSS
import './PokeList.css';

const PokeList = ({ pokemons }) => {

  // Not in use
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) { 
      // 
    }
  }
  
  return (
    <>
    {pokemons.count !== 0 ? (
      <div className="list" onScroll={handleScroll}>
        {pokemons?.results?.map((pokemon) => (
          <PokeCard key={pokemon.name} name={pokemon.name || pokemon.pokemon.name} />
        ))}
      </div>
    ) : (
      <div className="not-found">
        <h1>No Pokemon found</h1>
        <img src={cryingPikachu} alt="crying-pikachu" />
      </div>
    )}
    </>
  );
}

export default PokeList;
