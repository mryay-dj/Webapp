import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AnomalyProps {
  imageUrl: string;
  count: number;
  title: string; // Added title property to AnomalyProps
}

const Anomaly: React.FC<AnomalyProps> = ({ imageUrl, count, title }) => {
  const isCountPositive = count > 0;
  
  const handleAnomalyClick = () => {
    // Show toast message with the respective title when Anomaly is clicked
    toast.info(`Anomaly clicked! Title: ${title}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000
    });
    // Add any other functionality you want to occur when Anomaly is clicked
  };

  return (
    <div className={`anomaly ${isCountPositive ? 'red-background' : ''}`} onClick={handleAnomalyClick}>
      <div className="anomaly-container">
        <img
          src={imageUrl}
          alt="Anomaly"
          className={`anomaly-image ${isCountPositive ? 'red-background' : ''}`}
        />
        <p >
          {count}
        </p>
      </div>
    </div>
  );
};

export default Anomaly;
