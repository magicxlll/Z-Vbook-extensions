load("config.js");

function execute(key, page) {
    page = page || "1";
    var fetchUrl = key ? BASE_URL + "/tim-kiem?key=" + encodeURIComponent(key) + "&page=" + page : BASE_URL + "/truyen-hot";

    var response = fetchBook(fetchUrl);
    if (!response.ok) return Response.error("Cannot load: " + response.status);

    var doc = response.html();
    var list = [];
    var seen = {};

    doc.select(".book-item, .story-item, a[href*='/truyen/']").forEach(function(el) {
        var a = el.name() === "a" ? el : el.select("a[href*='/truyen/']").first();
        if (!a) return;
        var href = (a.attr("href") || "") + "";
        if (!href || href === "/truyen/") return;
        var link = href.indexOf("http") === 0 ? href : BASE_URL + href;
        if (seen[link]) return;
        seen[link] = true;

        var name = (el.select(".title, h3, h2").text() || a.text() || "").trim();
        var img = el.select("img").first();
        var cover = img ? (img.attr("src") || img.attr("data-src") || "") + "" : "";

        if (name) {
            list.push({
                name: name,
                link: link,
                cover: cover,
                host: BASE_URL
            });
        }
    });

    return Response.success(list);
}