// Kindacode.com
import React, { useState } from 'react';
import axios from "axios";

const CheckForm: React.FunctionComponent = () => {
  const [term, setTerm] = useState('');
  const [paraText, setParaText] = useState('');

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    // Preventing the page from reloading
    event.preventDefault();
    console.log(term);

    fetch("http://localhost:3000/summit-check-token", {
        method: "POST",
        body: JSON.stringify(term),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      Object.entries(data).map(([key, value]) => {
        // Pretty straightforward - use key for the key and value for the value.
        // Just to clarify: unlike object destructuring, the parameter names don't matter here.
        setParaText(`${key}: ${value}`);
        setTerm('');
        return console.log(value);
      })
    });
    
  }

  return (
      <div>
        <form onSubmit={submitForm}>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            type="text"
            placeholder="Enter a term"
            className="input"
            name="token_address"
          />
          <button type="submit" className="btn">Submit</button>
        </form>
        <br />
        <div>
          <p id="result">{paraText}</p>
        </div>
      </div>
  );
};

export default CheckForm;