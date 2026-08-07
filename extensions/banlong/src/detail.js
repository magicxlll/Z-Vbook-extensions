load("config.js");

function execute(url) {
    var response = fetchBook(url);
    if (response.ok) {
        var doc = response.html();
        var info = doc.select(".info-story");
        var genres = [];
        info.select("a[href^=the-loai]").forEach(function(e) {
            genres.push({
                title: e.text(),
                input: BASE_URL + "/" + e.attr("href"),
                script: "search.js"
            });
        });
        var name = (info.select("h1").text() || doc.select("h1").text() || "").trim();
        var cover = (doc.select(".image-story img").attr("src") || doc.select("meta[property='og:image']").attr("content") || "").trim();
        var author = (info.select("a[href^=tac-gia]").text() || "").trim();
        var description = (doc.select("#tab-info-1 .s-content, .desc-text").html() || "").trim();

        return Response.success({
            name: name || "Bàn Long Novel",
            cover: cover,
            author: author || "Khuyết Danh",
            description: description,
            genres: genres,
            detail: info.select(".story-info").html(),
            ongoing: info.text().indexOf("Đã hoàn thành") === -1,
            host: BASE_URL
        });
    }
    return Response.error("Không thể tải thông tin truyện");
}