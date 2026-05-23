import React, { useState, useEffect, useCallback } from 'react';
import ConsoleBox from './components/ConsoleBox.jsx';
import Toolbar from './components/Toolbar.jsx';
import CryptoTable from './components/CryptoTable.jsx';
import Toast from './components/Toast.jsx';

// Core API Endpoint configuration
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

// Figma screenshot replica mock data fallback
const MOCK_FALLBACK_DATA = [
  {
    "id": "bitcoin",
    "symbol": "BTC",
    "name": "Bitcoin",
    "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    "current_price": 20023,
    "market_cap": 382801405357,
    "market_cap_rank": 1,
    "total_volume": 28534462145,
    "price_change_percentage_24h": 3.79
  },
  {
    "id": "ethereum",
    "symbol": "ETH",
    "name": "Ethereum",
    "image": "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    "current_price": 1354.77,
    "market_cap": 163323147715,
    "market_cap_rank": 2,
    "total_volume": 9002850028,
    "price_change_percentage_24h": 3.48
  },
  {
    "id": "tether",
    "symbol": "USDT",
    "name": "Tether",
    "image": "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    "current_price": 1.001,
    "market_cap": 67968396233,
    "market_cap_rank": 3,
    "total_volume": 33471352657,
    "price_change_percentage_24h": -0.03
  },
  {
    "id": "binancecoin",
    "symbol": "BNB",
    "name": "BNB",
    "image": "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
    "current_price": 293.02,
    "market_cap": 47697282647,
    "market_cap_rank": 4,
    "total_volume": 362136764,
    "price_change_percentage_24h": 2.19
  },
  {
    "id": "usd-coin",
    "symbol": "USDC",
    "name": "USD Coin",
    "image": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    "current_price": 1,
    "market_cap": 47095350153,
    "market_cap_rank": 5,
    "total_volume": 3277543643,
    "price_change_percentage_24h": 0.01
  },
  {
    "id": "ripple",
    "symbol": "XRP",
    "name": "XRP",
    "image": "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white_-blue_200x200.png",
    "current_price": 0.474016,
    "market_cap": 23426798467,
    "market_cap_rank": 6,
    "total_volume": 1839266667,
    "price_change_percentage_24h": 4.98
  },
  {
    "id": "binance-usd",
    "symbol": "BUSD",
    "name": "Binance USD",
    "image": "https://assets.coingecko.com/coins/images/9576/large/BUSD.png",
    "current_price": 1.001,
    "market_cap": 20894853241,
    "market_cap_rank": 7,
    "total_volume": 6792694651,
    "price_change_percentage_24h": 0.10
  },
  {
    "id": "cardano",
    "symbol": "ADA",
    "name": "Cardano",
    "image": "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    "current_price": 0.432245,
    "market_cap": 14621316672,
    "market_cap_rank": 8,
    "total_volume": 396179844,
    "price_change_percentage_24h": 1.71
  }
];

export default function App() {
  // Core Data States
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Sorting UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "desc" });
  const [fetchMode, setFetchMode] = useState("async"); // async | then
  const [isMockActive, setIsMockActive] = useState(false);
  const [isDevOpen, setIsDevOpen] = useState(false);

  // Live log compiler state
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "[SYSTEM] Dashboard loaded. Click 'Developer Panel' to toggle fetches.", type: "system-log" }
  ]);

  // System toast notification alert states
  const [toasts, setToasts] = useState([]);

  const addLog = useCallback((text, type = "system-log") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { time: timestamp, text, type }]);
  }, []);

  const addToast = useCallback((title, msg, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, msg, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearConsole = () => {
    setLogs([
      { time: new Date().toLocaleTimeString(), text: "[SYSTEM] Log console cleared.", type: "system-log" }
    ]);
  };

  const processData = useCallback((rawList, isMock) => {
    setIsMockActive(isMock);
    const formatted = rawList.map((item) => ({
      id: item.id,
      symbol: item.symbol.toUpperCase(),
      name: item.name,
      image: item.image,
      current_price: parseFloat(item.current_price),
      total_volume: parseFloat(item.total_volume),
      market_cap: parseFloat(item.market_cap),
      price_change_percentage_24h: parseFloat(item.price_change_percentage_24h || 0),
      market_cap_rank: parseInt(item.market_cap_rank || 0)
    }));

    setOriginalData(formatted);
    setIsLoading(false);
  }, []);

  /**
   * METHOD A: Chained Promise .then() fetching
   */
  const fetchWithThen = () => {
    setFetchMode("then");
    setIsLoading(true);
    addLog("==========================================", "system-log");
    addLog("INITIALIZING: Promise pipeline fetch via fetchWithThen()", "then-log");
    addLog(`GET API URL: ${API_URL}`, "then-log");

    fetch(API_URL)
      .then((response) => {
        addLog(`PROMISE RESOLVED: Status: ${response.status} ${response.statusText}`, "then-log");
        if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        addLog(`PARSED ASSETS: Successfully retrieved ${data.length} array objects.`, "success-log");
        processData(data, false);
        addToast("Success (.then)", "Retrieved live market data using chained Promises.", "success");
      })
      .catch((error) => {
        addLog(`PIPELINE EXCEPTION: ${error.message}`, "error-log");
        addLog("FALLBACK ACTIVATION: Triggering resilient Mock Data pipeline...", "warning-log");
        processData(MOCK_FALLBACK_DATA, true);
        addToast("Connected to Fallback Feed", "Loaded high-fidelity assets due to network rate limits.", "warning");
      });
  };

  /**
   * METHOD B: Modern Async / Await fetching
   */
  const fetchWithAsyncAwait = async () => {
    setFetchMode("async");
    setIsLoading(true);
    addLog("==========================================", "system-log");
    addLog("INITIALIZING: Asynchronous pipeline fetch via fetchWithAsyncAwait()", "async-log");
    addLog(`GET API URL: ${API_URL}`, "async-log");

    try {
      const response = await fetch(API_URL);
      addLog(`RESPONSE RECEIVED: Status code ${response.status} ${response.statusText}`, "async-log");
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);

      const data = await response.json();
      addLog(`RESOLVED ASSETS: Parsed ${data.length} items.`, "success-log");
      processData(data, false);
      addToast("Success (async/await)", "Fetched live market assets from CoinGecko.", "success");
    } catch (error) {
      addLog(`ASYNC/AWAIT ERROR: ${error.message}`, "error-log");
      addLog("FALLBACK STRATEGY: Initializing Mock fallback dashboard state...", "warning-log");
      processData(MOCK_FALLBACK_DATA, true);
      addToast("Connected to Fallback Feed", "Loaded high-fidelity assets due to network rate limits.", "warning");
    }
  };

  // Bootstrap initial async fetch
  useEffect(() => {
    fetchWithAsyncAwait();
  }, []);

  /**
   * Sorting Core Controller
   */
  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    addLog(`SORT ACTION: Toggling sort order on ${key} to [${direction.toUpperCase()}]`, "system-log");
    setSortConfig({ key, direction });
  };

  const handleResetFilters = () => {
    addLog("RESET ACTION: Restoring default search metrics and ranked orders.", "system-log");
    setSearchQuery("");
    setSortConfig({ key: "", direction: "desc" });
    addToast("Dashboard Reset", "All active filters and sorting queries have been cleared.", "info");
  };

  /**
   * Coordinates search queries and active sorting rules reactively
   */
  useEffect(() => {
    let processed = [...originalData];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      processed = processed.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.symbol.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
      );
    }

    if (sortConfig.key !== "") {
      processed.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (sortConfig.direction === "asc") {
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        } else {
          return valA < valB ? 1 : valA > valB ? -1 : 0;
        }
      });
    }

    setFilteredData(processed);
  }, [originalData, searchQuery, sortConfig]);

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />

      <div className="app-container">
        {/* Figma Header controls */}
        <Toolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        {/* Status indicator / Reset Link */}
        <div className="meta-status-bar">
          <div>
            <span>Data Feed Status: </span>
            <strong style={{ color: isMockActive ? '#fbbf24' : '#38a169' }}>
              {isMockActive ? 'Fallback Offline Mode' : 'Connected (Live)'}
            </strong>
          </div>
          <div>
            <button className="reset-link-btn" onClick={handleResetFilters}>
              Reset filters & sorting
            </button>
          </div>
        </div>

        {/* Clean borderless grid table matching Figma layout exactly */}
        <CryptoTable 
          data={filteredData}
          isLoading={isLoading}
          onClearSearch={() => setSearchQuery("")}
        />

        {/* Collapsible developer options at bottom to test promise toggles */}
        <div className="dev-drawer">
          <div className="drawer-header" onClick={() => setIsDevOpen(!isDevOpen)}>
            <div className="drawer-title">
              <i className="fa-solid fa-gears"></i> Developer Options & Promise Pipeline Console
            </div>
            <div className="drawer-toggle-icon">
              {isDevOpen ? '▲ Hide Details' : '▼ Expand Promise Log Panel'}
            </div>
          </div>

          {isDevOpen && (
            <div className="drawer-content">
              <p style={{ fontSize: '0.8rem', color: '#8a8a8a', lineHeight: '1.4' }}>
                Toggle below to test promise handling methods. The log below captures network stream actions dynamically.
              </p>
              <div className="fetch-controls-row">
                <button 
                  className={`pipeline-btn ${fetchMode === 'then' ? 'active' : ''}`}
                  onClick={fetchWithThen}
                >
                  <i className="fa-solid fa-code-branch"></i> Chained <code>.then()</code> Fetch
                </button>
                <button 
                  className={`pipeline-btn ${fetchMode === 'async' ? 'active' : ''}`}
                  onClick={fetchWithAsyncAwait}
                >
                  <i className="fa-solid fa-bolt"></i> Asynchronous <code>async / await</code> Fetch
                </button>
              </div>

              <ConsoleBox logs={logs} onClear={clearConsole} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
