load("config.js");

function execute(url) {
    url = url.replace(/^https?:\/\/[^\/]+/, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var html = res.text();

    var name = (doc.select("meta[property='og:title']").attr("content") || "").replace(/ - Đọc truyện online.*$/i, "").trim();
    if (!name) {
        var mName = html.match(/"name"s*:s*"([^"]+)"/) || html.match(/\"name\":\"([^\"]+)\"/);
        if (mName) name = mName[1];
    }

    var cover = doc.select("meta[property='og:image']").attr("content") || "";
    if (!cover) {
        var mCover = html.match(/"thumbnail"s*:s*"([^"]+)"/) || html.match(/\"thumbnail\":\"([^\"]+)\"/);
        if (mCover) cover = mCover[1];
    }

    var author = "";
    var mAuthor = html.match(/"author"s*:s*"([^"]+)"/) || html.match(/\"author\":\"([^\"]+)\"/);
    if (mAuthor) author = mAuthor[1];

    var description = doc.select("meta[property='og:description']").attr("content") || "";

    return Response.success({
        name: name || "Vireal Story",
        cover: cover,
        host: BASE_URL,
        author: author || "Vireal Author",
        description: description,
        ongoing: true
    });
}