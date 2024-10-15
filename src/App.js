import React, { useState, useRef } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false); // Track if retrying
  const retryTimeoutRef = useRef(null); // To store the retry timeout ID

  const fetchMoviesHandler = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://swapi.dev/api/film/');
      if (!response.ok) {
        throw new Error('Something went wrong... Retrying');
      }
      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
      setIsRetrying(false); // Stop retrying when successful
    } catch (error) {
      setError(error.message);
      setIsRetrying(true); // Start retrying
      retryTimeoutRef.current = setTimeout(fetchMoviesHandler, 5000); // Retry after 5 seconds
    }
    setIsLoading(false);
  };

  const cancelRetryHandler = () => {
    setIsRetrying(false); // Stop retrying
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current); // Clear the retry timeout
    }
    setError('Retrying canceled');
  };

  let content = <p>Found no movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        {isRetrying && <button onClick={cancelRetryHandler}>Cancel Retry</button>}
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
