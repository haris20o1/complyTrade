// File: src/components/common/Card.jsx
import React from 'react';

const Card = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 md:p-6 ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;