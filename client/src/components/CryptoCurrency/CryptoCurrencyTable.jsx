import { useEffect, useState } from "react";

function CryptoCurrencyTable() {
    const [cryptoData, setCryptoData] = useState([]);
    const [visibleCount, setVisibleCount] = useState(20);
    const [allData, setAllData] = useState([]);
    const [sortBy, setSortBy] = useState("rank");
    const [filter, setFilter] = useState("");

    useEffect(() => {
        async function fetchCryptoData() {
            try {
                const response = await fetch('https://api.coinpaprika.com/v1/tickers');
                const data = await response.json();
                setAllData(data);
                setCryptoData(data.slice(0, visibleCount));
            } catch (error) {
                console.error("Error fetching cryptocurrency data:", error);
            }
        }

        fetchCryptoData();
    }, [visibleCount]);

    const handleLoadMore = () => {
        const newVisibleCount = visibleCount + 10;
        setVisibleCount(newVisibleCount);
        setCryptoData(allData.slice(0, newVisibleCount));
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredAndSortedData = cryptoData
        .filter((coin) =>
            coin.name.toLowerCase().includes(filter.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(filter.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "price") return b.quotes.USD.price - a.quotes.USD.price;
            if (sortBy === "marketCap") return b.quotes.USD.market_cap - a.quotes.USD.market_cap;
            return a.rank - b.rank;
        });

    return (
        <div>
            <div className="flex flex-col justify-center">
                <div className="flex justify-between mb-3 mx-20">
                    <div>
                        <label className="mr-2">Filter by Name/Symbol:</label>
                        <input
                            type="text"
                            value={filter}
                            onChange={handleFilterChange}
                            placeholder="Search..."
                            className="border border-gray-300 rounded px-3 py-1 dark:bg-gray-700 dark:text-white dark:border-gray-800"
                        />
                    </div>
                    <div>
                        <label className="mr-2">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="border border-gray-300 rounded p-1 dark:bg-gray-700 dark:text-white dark:border-gray-800"
                        >
                            <option value="rank">Rank</option>
                            <option value="price">Price</option>
                            <option value="marketCap">Market Cap</option>
                        </select>
                    </div>
                </div>
                
                <div className="mx-10 mb-10 bg-white shadow-lg rounded-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-3">
                        <div className="overflow-x-auto">
                            {cryptoData.length > 0 ? (
                                <table className="table-auto w-full table-fixed">
                                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                                        <tr>
                                            <th className="p-2"><div className="font-semibold text-center">Logo</div></th>
                                            <th className="p-2"><div className="font-semibold text-center">Name</div></th>
                                            <th className="p-2"><div className="font-semibold text-center">Symbol</div></th>
                                            <th className="p-2"><div className="font-semibold text-center">Price (USD)</div></th>
                                            <th className="p-2"><div className="font-semibold text-center">Market Cap (USD)</div></th>
                                            <th className="p-2"><div className="font-semibold text-center">Total Supply</div></th>
                                            <th className="p-2"><div className="font-semibold text-center">Volume (24h)</div></th>
                                            <th className="p-2"><div className="font-semibold text-center">% Change (24h)</div></th>
                                            <th className="p-2"><div className="font-semibold text-center">ATH Price</div></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-600">
                                        {filteredAndSortedData.map((coin) => (
                                            <tr key={coin.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <td className="p-2 text-center">
                                                    <img
                                                        src={`https://static.coinpaprika.com/coin/${coin.id}/logo.png`}
                                                        alt={`${coin.name} logo`}
                                                        className="w-8 h-8 mx-auto"
                                                    />
                                                </td>
                                                <td className="p-2 text-center">{coin.name}</td>
                                                <td className="p-2 text-center">{coin.symbol}</td>
                                                <td className="p-2 text-center font-medium">${coin.quotes.USD.price.toFixed(2)}</td>
                                                <td className="p-2 text-center font-medium">${Number(coin.quotes.USD.market_cap).toLocaleString()}</td>
                                                <td className="p-2 text-center">{coin.total_supply ? coin.total_supply.toLocaleString() : "N/A"}</td>
                                                <td className="p-2 text-center font-medium">${Number(coin.quotes.USD.volume_24h).toLocaleString()}</td>
                                                <td className="p-2 text-center font-medium">
                                                    <span className={coin.quotes.USD.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                                                        {coin.quotes.USD.percent_change_24h.toFixed(2)}%
                                                    </span>
                                                </td>
                                                <td className="p-2 text-center font-medium">${coin.quotes.USD.ath_price.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center text-gray-500 font-medium p-4 dark:text-gray-400">
                                    Loading data...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center pb-5">
                <button
                    className="bg-gray-800 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded dark:bg-gray-700 dark:hover:bg-gray-600"
                    onClick={handleLoadMore}>
                    Show More
                </button>
            </div>
        </div>
    );
}

export default CryptoCurrencyTable;