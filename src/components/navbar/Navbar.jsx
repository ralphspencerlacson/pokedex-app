import { useEffect, useState } from "react";
// Components
import Dropdown from "../dropdown/Dropdown";
// Service
import { getPokemonTypes, getPokemonGenerations } from "../../service/pokeapi.js";
// Logo
import PokeApiLogo from '../../assets/pokeapi.png';

// CSS
import './Navbar.css';

/**
 * Navbar component for filtering and searching options.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.selectedOption - The currently selected option.
 * @param {Function} props.onSearch - Callback function for search action.
 * @param {Function} props.onTypeFilter - Callback function for type filtering.
 * @param {Function} props.onGenerationFilter - Callback function for generation filtering.
 * @returns {JSX.Element} The Navbar component.
 */
const Navbar = ({ selectedOption, onSearch, onTypeFilter, onGenerationFilter }) => {
  const [query, setQuery] = useState("");
  const [typeOptions, setTypeOptions] = useState('');
  const [genOptions, setGenOption] = useState('');

  useEffect(() => {
    // Fetch Pokemon types
    fetchPokemonTypes();
    
    // Fetch Pokemon generations
    fetchPokemonGenerations();
  }, []);

  /**
   * Fetches Pokemon types from the API and updates the type options.
   *
   */
  const fetchPokemonTypes =  async () => {
    try {
      const apiData = await getPokemonTypes();
      setTypeOptions(apiData);
    } catch (error) {
      console.error("fetchPokemon: err: " + error);
    }
  }

  /**
   * Fetches Pokemon generation from the API and updates the generation options.
   *
   */
  const fetchPokemonGenerations = async () => {
    try {
      const apiData = await getPokemonGenerations();
      setGenOption(apiData);
    } catch (error) {
      console.error("fetchPokemon: err: " + error);
    }
  }

  /**
   * Handles the change of the search query and invokes the onSearch callback.
   *
   * @param {Object} e - The event object triggered by the input change.
   */
  const handleQueryChange = (e) => {
    // Update the query state with the new value from the input
    setQuery(e.target.value);
    
    // Invoke the onSearch callback with the new query value
    onSearch(e.target.value);
  }

  return(
    <div className="navbar">
      <div className="logo">
        <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer">
          <img src={PokeApiLogo} alt="pokeapi-logo" />
        </a>
      </div>

      <div className="search">
        <input 
            type="text"  
            placeholder="Search by pokedex ID or Name" 
            name="query"
            value={query} 
            onChange={handleQueryChange}
        />
        {query && (
          <span className="search-clear" onClick={() => { setQuery(''); onSearch(''); }}>
            &times;
          </span>
        )}
      </div>

      <div className="filter">
        <span>Filter:</span>
        <Dropdown 
          header="Generation"
          options={genOptions} 
          selectedOption={selectedOption.gen}
          onSelect={onGenerationFilter} 
        />
        <Dropdown 
          header="Type"
          options={typeOptions} 
          selectedOption={selectedOption.type}
          onSelect={onTypeFilter}
        />
      </div>
    </div>
  );
}

export default Navbar;
