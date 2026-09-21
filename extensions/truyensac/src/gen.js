load("config.js");

function execute(url, page) {
    page = page || "1";
    var p = parseInt(page, 10);

    var fetchUrl = url;
    if (fetchUrl.indexOf("/the-loai/") > -1) {
        var gSlug = fetchUrl.split("/the-loai/")[1].split("/")[0].split("?")[0];
        fetchUrl = API_URL + "/novels?genreSlug=" + encodeURIComponent(gSlug);
    } else if (fetchUrl.indexOf("/danh-sach/truyen-hot") > -1) {
        fetchUrl = API_URL + "/novels/hot";
    } else if (fetchUrl.indexOf("/danh-sach/truyen-moi") > -1) {
        fetchUrl = API_URL + "/novels/latest";
    } else if (fetchUrl.indexOf("/danh-sach/truyen-full") > -1) {
        fetchUrl = API_URL + "/novels?status=completed";
    } else if (fetchUrl.indexOf("http") !== 0) {
        fetchUrl = API_URL + "/" + fetchUrl.replace(/^\/+/, "");
    }

    var sep = fetchUrl.indexOf("?") > -1 ? "&" : "?";
    var apiUrl = fetchUrl + sep + "page=" + p + "&limit=20";

    var json = fetchJson(apiUrl);
    if (!json) return Response.error("Không thể tải danh sách truyện");

    var list = [];
    var total = 0;

    if (Array.isArray(json)) {
        list = json;
        total = json.length;
    } else if (json.novels) {
        list = json.novels;
        total = json.totalItems || 0;
    }

    var books = parseStories(list);
    var nextPage = null;
    if (books.length >= 20 && (!total || p * 20 < total)) {
        nextPage = String(p + 1);
    }

    return Response.success(books, nextPage);
}
