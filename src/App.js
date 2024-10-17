import React, { useState, useRef, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false); // Track if retrying
  const retryTimeoutRef = useRef(null); // To store the retry timeout ID


  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://flash-99933-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong... Retrying');
      }
      const data = await response.json();
      console.log(data);

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        });
      }

      setMovies(loadedMovies);
      setIsRetrying(false); // Stop retrying when successful
    } catch (error) {
      setError(error.message);
      setIsRetrying(true); // Start retrying
      retryTimeoutRef.current = setTimeout(fetchMoviesHandler, 5000); // Retry after 5 seconds
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const cancelRetryHandler = () => {
    setIsRetrying(false); // Stop retrying
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current); // Clear the retry timeout
    }
    setError('Retrying canceled');
  };

  const addMovieHandler = async (movie) => {
    // fetch can both receive and send data
    const response = await fetch('https://flash-99933-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',   // POST method to send data to api
      body: JSON.stringify(movie),  // to convert the js obj to json
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        {isRetrying && <button onClick={cancelRetryHandler}>Cancel Retry</button>}
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
