import React from 'react';

/**
 * Toolbar Component - Figma matched layout: Search box on the left, sort buttons on the right.
 */
export default function Toolbar({ 
  searchQuery, 
  onSearchChange, 
  sortConfig, 
  onSort 
}) {
  return (
    <div className="toolbar-container">
      {/* Search Input box */}
      <div className="search-input-wrapper">
        <input 
          type="text" 
          placeholder="Search By Name or Symbol" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Action Buttons Panel */}
      <div className="sort-buttons-wrapper">
        <button 
          className={`sort-action-btn ${sortConfig.key === 'market_cap' ? 'active' : ''}`}
          onClick={() => onSort('market_cap')}
        >
          Sort By Mkt Cap
        </button>
        
        <button 
          className={`sort-action-btn ${sortConfig.key === 'price_change_percentage_24h' ? 'active' : ''}`}
          onClick={() => onSort('price_change_percentage_24h')}
        >
          Sort by percentage
        </button>
      </div>
    </div>
  );
}
