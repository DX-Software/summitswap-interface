// Kindacode.com
import React, { useState } from 'react';
import axios from "axios";

const CheckForm: React.FunctionComponent = () => {
  const [term, setTerm] = useState('');
  const [paraText, setParaText] = useState({ total_supply: '', holders: 0, owner_address: '', top_holders: [{TokenHolderAddress: '', TokenHolderQuantity: ''}], burned_tokens: 0 });

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
      /*
      let textPara = "";
      Object.entries(data).map(([key, value]) => {
        // Pretty straightforward - use key for the key and value for the value.
        // Just to clarify: unlike object destructuring, the parameter names don't matter here.
        
          textPara += `${key}: ${value}`;
        
        return console.log(value);
      });&& paraText.length>0 && paraText.map((item)=><p>{item}</p>)
      */
     setParaText({total_supply: data.total_supply, holders: data.holders, owner_address: data.owner_address, top_holders: data.top_holders, burned_tokens: data.burned_tokens});
      setTerm('');
    });
    
  }

  return (
      <div>
        <form onSubmit={submitForm}>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            type="text"
            placeholder="Enter address"
            className="input"
            name="token_address"
          />
          <button type="submit" className="btn">Submit</button>
        </form>
        <br />
        <div id="result">
          <p>Total Supply: { paraText.total_supply }</p>
          <br />
          <p>Holders: { paraText.holders }</p>
          <br />
          <p>Owner Address: { paraText.owner_address }</p>
          <br />
          <p>Burned Tokens: { paraText.burned_tokens }</p>
          <br />
          <div>Top Holders: {paraText.top_holders.map(holder => <div><p>Holder Address: {holder.TokenHolderAddress}</p><p>Holder Quantity: {holder.TokenHolderQuantity}</p></div>)}</div>
        </div>
      </div>
  );
};

export default CheckForm;