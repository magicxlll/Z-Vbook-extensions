load("config.js");

function execute(key, page) {
    page = page || "1";
    var p = parseInt(page, 10);

    var apiUrl = API_URL + "/novels?keyword=" + encodeURIComponent(key) + "&page=" + p + "&limit=20";
    var json = fetchJson(apiUrl);
    if (!json || !json.novels) return Response.success([], null);

    var books = parseStories(json.novels);
    var nextPage = null;
    if (books.length >= 20 && json.totalItems && p * 20 < json.totalItems) {
        nextPage = String(p + 1);
    }

    return Response.success(books, nextPage);
}
