import React from 'react';

/**
 * High-fidelity Figma price formatter:
 * - Whole numbers have no decimals (e.g. $20023, $1)
 * - Decimals keep relevant digits up to 6 places (e.g. $1354.77, $1.001, $0.474016)
 */
const formatPrice = (price) => {
  if (price === undefined || price === null) return '-';
  if (Number.isInteger(price)) {
    return `$${price}`;
  }
  // Convert to fixed 6 and trim trailing zeros if present
  const fixedStr = price.toFixed(6);
  // Parse and convert back to string to automatically drop unnecessary trailing zeros
  const trimmed = parseFloat(fixedStr).toString();
  return `$${trimmed}`;
};

const formatVolume = (vol) => {
  if (vol === undefined || vol === null) return '-';
  return `$${Math.round(vol).toLocaleString()}`;
};

const formatMarketCap = (mc) => {
  if (mc === undefined || mc === null) return '-';
  return `Mkt Cap : $${Math.round(mc).toLocaleString()}`;
};

export default function CryptoTable({ data, isLoading, onClearSearch }) {
  if (isLoading) {
    return (
      <div className="spinner-container">
        <p>Loading CoinGecko market database feeds...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="empty-results">
        <p>No matching cryptocurrencies found.</p>
        <button onClick={onClearSearch}>Reset search queries</button>
      </div>
    );
  }

  return (
    <div className="crypto-list">
      {data.map((item) => {
        const priceVal = item.current_price;
        const changeVal = item.price_change_percentage_24h;
        const isPositive = changeVal >= 0;
        const changeClass = isPositive ? 'positive' : 'negative';
        
        // Match Figma format: e.g. "3.79%" or "-0.03%" (sign is handled by toFixed output or manually)
        const formattedChange = (isPositive ? '' : '') + changeVal.toFixed(2) + "%";

        return (
          <div key={item.id} className="crypto-row">
            {/* Column 1: Icon + Name */}
            <div className="asset-identity">
              <img 
                className="asset-icon" 
                src={item.image} 
                alt={`${item.name} logo`}
                onError={(e) => {
                  e.target.src = 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png';
                }}
              />
              <span className="asset-name">{item.name}</span>
            </div>

            {/* Column 2: Uppercase Symbol */}
            <div className="asset-symbol">
              {item.symbol}
            </div>

            {/* Column 3: Custom Decimals Price */}
            <div className="asset-price">
              {formatPrice(priceVal)}
            </div>

            {/* Column 4: Volume */}
            <div className="asset-volume">
              {formatVolume(item.total_volume)}
            </div>

            {/* Column 5: Pure Percentage text */}
            <div className={`percent-change ${changeClass}`}>
              {formattedChange}
            </div>

            {/* Column 6: Custom Market Cap with Prefix */}
            <div className="asset-marketcap">
              {formatMarketCap(item.market_cap)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
