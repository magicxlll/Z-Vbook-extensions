var BASE_URL = "https://conduongbachu.com";
try { if (CONFIG_URL) BASE_URL = CONFIG_URL; } catch (e) {}

// fetchBook: Wrapper tự động giả lập User-Agent và đính kèm Cookie để vượt qua các chốt kiểm tra IIS/redirection
function fetchBook(url, options) {
    options = options || {};
    options.headers = options.headers || {};
    
    // Giả lập User-Agent trình duyệt hiện đại
    options.headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    
    // Đính kèm Cookie bảo mật IIS phổ biến (như vietnamthuquan...)
    options.headers["Cookie"] = "AspxAutoDetectCookieSupport=1";
    
    return fetch(url, options);
}
