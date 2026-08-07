load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    var response = fetch(url + "?page=" + page);
    if (response.ok) {
        var doc = response.html();

        var nextPage = /page=(\d+)/.exec(doc.select(".next-page").first().attr("href"));
        if (nextPage) nextPage = nextPage[1];
        else nextPage = "";

        var books = [];
        doc.select(".basis-full").first().select(".novel-item").forEach(function(e) {
            var type = e.select("a[href^=danh-muc]").text();
            if (type) {
                type = "[" + type + "] ";
            }
            books.push({
                name: type + e.select("h3").text(),
                link: e.select("a").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                description: e.select(".author ").text() + " - " + e.select(".story-info").text(),
                host: BASE_URL
            });
        });

        return Response.success(books, nextPage);
    }
    return null;
}