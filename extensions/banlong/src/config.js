var BASE_URL = "https://blhvip.vn";
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}

function fetchBook(url, options) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
    options.headers["Cookie"] = "XSRF-TOKEN=eyJpdiI6ImU5NGNDWFZOZWc1azhDUitDUkVoZXc9PSIsInZhbHVlIjoiOHhjRnZEdEhPcWVCZjFMWjMwRkRqbkh5b0taQVl0U2dBc0M5MThyREVXaGRhTVRCQkZPejdST2FlZkJ0cmxIN2J0M3h5SzJqdkNCNG5IWW0yYnFtdG9kOG1TaERZWDdLYlJoMnJKVkMzNHhzbE9NaGs5cUFNb1psV1B2TmZDeWEiLCJtYWMiOiIzYmY1NThiMTRjZDkwNTYyYTU5Mzc4MmY1OGZlZDNkNWQyYTYwYjYwM2VkZDU4YTc2YWU2ZDIyMTY1MTgxODAxIiwidGFnIjoiIn0%3D";
    return fetch(url, options);
}