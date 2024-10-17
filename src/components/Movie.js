import React from 'react';
import classes from './Movie.module.css';

const Movie = (props) => {
  return (
    <li className={classes.movie}>
      <div>
        <h2>{props.title}</h2>
        <p>{props.openingText}</p>
        <p>{props.releaseDate}</p>
        {/* Delete Button */}
        <button onClick={() => props.onDeleteMovie(props.id)}>Delete</button>
      </div>
    </li>
  );
};

export default Movie;
