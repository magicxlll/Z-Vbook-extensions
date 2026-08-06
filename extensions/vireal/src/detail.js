load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?://)?(?:[^@
]+@)?(?:www.)?([^:/
?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var html = res.text();
    var doc = res.html();

    var name = "";
    var mName = html.match(/\"name\":\"([^\"]+)\"/);
    if (mName) name = mName[1];
    if (!name) {
        var h1 = doc.select("h1").first();
        if (h1) name = (h1.text() || "").trim();
    }

    var cover = "";
    var mCover = html.match(/\"thumbnail\":\"([^\"]+)\"/) || html.match(/og:image"s+content="([^"]+)"/);
    if (mCover) cover = mCover[1];

    var author = "";
    var mAuthor = html.match(/\"author\":\"([^\"]+)\"/);
    if (mAuthor) author = mAuthor[1];

    var description = "";
    var mDesc = html.match(/\"metadata\":\"([^\"]+)\"/);
    if (mDesc) description = mDesc[1].replace(/\n/g, "
");

    return Response.success({
        name: name || "Vireal Story",
        cover: cover,
        host: BASE_URL,
        author: author || "Vireal Author",
        description: description,
        ongoing: true
    });
}