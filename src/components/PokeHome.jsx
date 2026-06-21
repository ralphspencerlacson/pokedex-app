import { useEffect, useState, useRef } from "react";
// Component
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import PokeList from "./PokeList";
import BouncingPokeball from "./others/BouncingPokeball/BouncingPokeball";
// Hooks
import { useDebounce } from "../hooks/useDebounce";
// Service
import { getPokemonsSearchData, getPokemonsPaginated, getPokemonById } from "../service/pokeapi.js";
// Assets
import runningPikachu from '../assets/pikachu/running-pikachu.gif';
// CSS
import './PokeHome.css';

const PokeHome = () => {
  // Pokemons
  const [pokemons, setPokemons] = useState([]);
  // Filter
  const [filter, setFilter] = useState({'type': 'pokemon-species', 'gen': 'pokemon-species'});
  const [selectedOption, setSelectedOption] = useState({'type': null, 'gen': null})
  // Search
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [rawQuery, setRawQuery] = useState('');
  const debouncedQuery = useDebounce(rawQuery, 300);
  // Loading
  const [loading, setLoading] = useState(false);
  const isFirstLoad = useRef(true);
  // Pagination
  const [offset, setOffset] = useState(0);
  const limit = 12;

  useEffect(() => {
    fetchSearchData();

    if(!search) {
      fetchPokemons();
    }
  // eslint-disable-next-line 
  }, [offset, filter]);

  useEffect(() => {
    if (!debouncedQuery) {
      setSearch('');
      if (rawQuery === '') fetchPokemons();
      return;
    }

    if (!isNaN(debouncedQuery)) {
      fetchPokemonById(debouncedQuery);
      return;
    }

    setPokemons([]);
    setSearch(debouncedQuery);

    const regex = new RegExp(`^${debouncedQuery}`, 'i');
    const filteredData = searchData?.results?.filter(item => regex.test(item.name)) || [];

    setPokemons({
      count: filteredData.length,
      results: filteredData
    });
  // eslint-disable-next-line
  }, [debouncedQuery]);

  /**
   * Fetches search data for Pokemon search functionality and updates the search data state.
   *
   * @throws {Error} If there's an error during the search data fetch.
   */
  const fetchSearchData = async () => {
    try {
      // Fetch search data from the API
      const searchData = await getPokemonsSearchData();

      // Update the search data state with the fetched data
      setSearchData(searchData);
    } catch (error) {
      // Handle errors by logging to the console
      console.error("fetchPokemon: err: " + error);
    }
  }

  /**
   * Fetches paginated Pokemon data based on filters and updates the Pokemon data state.
   *
   * @throws {Error} If there's an error during the Pokemon data fetch.
   */
  const fetchPokemons = async () => {
    try {
      setLoading(true);

      const apiData = await getPokemonsPaginated(filter.type, filter.gen, offset, limit);

      setTimeout(function() {
          setPokemons(apiData);
          setLoading(false);
          isFirstLoad.current = false;
      }, 2800);
    } catch (error) {
      console.error("fetchPokemon: err: " + error);
    }
  }

  /**
   * Fetches Pokemon data by ID and updates the Pokemon data state.
   *
   * @param {number} id - The ID of the Pokemon to fetch.
   * @throws {Error} If there's an error during the Pokemon data fetch.
   */
  const fetchPokemonById = async (id) => {
    try {
      // Set loading state to indicate data fetching
      setLoading(true);

      // Fetch Pokemon data from the API based on the provided ID
      const apiData = await getPokemonById(id);
      
      setTimeout(function() {
        // Update the Pokemon data state with the fetched data
        setPokemons(apiData);
        
        // Turn off loading state after a delay
        setLoading(false);
      }, 2000);
    } catch (error) {
      // Handle errors by logging to the console
      console.error("fetchPokemon: err: " + error);
    }
  }
  
  /**
   * Handles the selection of a type filter option and updates relevant state.
   *
   * @param {Object} option - The selected type filter option.
   */
  const onTypeFilter = async (option) => {
    setSearch('');
    setOffset(0);
    setSelectedOption((prev) => ({...prev, 'type': option}));
    
    setFilter((prev) => ({
      'type': option ? option.value : 'pokemon-species',
      'gen': prev.gen
    }));
  }

  /**
   * Handles the selection of a generation filter option and updates relevant state.
   *
   * @param {Object} option - The selected generation filter option.
   */
  const onGenerationFilter = async (option) => {
    setSearch('');
    setOffset(0);
    setSelectedOption((prev) => ({...prev, 'gen': option}));
    
    setFilter((prev) => ({
      'type': prev.type,
      'gen': option ? option.value : 'pokemon-species'
    }));
  }

  /**
   * Handles the search action and updates relevant state based on the query.
   *
   * @param {string} query - The search query entered by the user.
   */
  const onSearch = (query) => {
    setSelectedOption({ type: null, gen: null });
    setRawQuery(query);
  }

  return (
    <div>
      <Navbar
        selectedOption={selectedOption}
        onSearch={onSearch}
        onTypeFilter={onTypeFilter}
        onGenerationFilter={onGenerationFilter}
      />
        {!loading ? (
          <div className="home">
            <PokeList pokemons={pokemons} />
          </div>
        ) : isFirstLoad.current ? (
          <div className="home-loading">
            <img src={runningPikachu} alt='tenor-rafaelfracasso-15385062' />
          </div>
        ) : (
          <div className="home-loading-simple">
            <BouncingPokeball />
          </div>
        )}

        <Footer 
          offset={offset}
          limit={limit}
          total={pokemons.count}
          showPagination={!search && pokemons?.count > limit}
          handlePageClick={(newOffset) =>  setOffset(newOffset)}
        />
    </div>
  );
}

export default PokeHome;