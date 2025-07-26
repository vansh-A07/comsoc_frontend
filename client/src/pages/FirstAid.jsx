import React, { useEffect, useState } from 'react';
import '../styles/firstaid.css';
import { setdata, getData } from '../utils/firstaid';


const FirstAid = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setdata();
    const storedData = getData();
    setData(storedData);
  }, []);

  return (
    <div className="firstaid-container">
      <h1 className="firstaid-title">🩺 First Aid Help</h1>
      <div className="firstaid-cards">
        {data.map((item, index) => (
          <div key={index} className="card-flip">
            <div className="card-inner">
              <div className="card-front">
                <h3>{item.title}</h3>
              </div>
              <div className="card-back">
                <h4>What to do:</h4>
                <ul>
                  {item.steps.map((step, idx) => (
                    <li key={idx}>✅ {step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirstAid;
