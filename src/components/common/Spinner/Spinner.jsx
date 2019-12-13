import React from 'react';

const Spinner = () => {
  return (
    <div style={{height: 400}} data-testid="loading">
      <div className="h-100 d-flex justify-content-center align-items-center" >
        <div className="spinner-grow text-primary" style={{width: '5rem', height: '5rem'}}>
         <span className="sr-only"></span>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
