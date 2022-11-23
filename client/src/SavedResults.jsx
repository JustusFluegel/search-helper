import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SavedResults(props) {
  const navigate = useNavigate();
  const savedList = [];

  return (
    <div className="articles">
      <div className="options">
        <button
          onClick={() => {
            navigate('/results');
          }}
        >
          <h3>Results</h3>
        </button>
        <button
          onClick={() => {
            navigate('/saved');
          }}
        >
          <h3>Saved</h3>
        </button>
      </div>
      <ul>{savedList}</ul>
    </div>
  );
}
