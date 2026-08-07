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
        doc.select(".list-story__item li").forEach(function(e) {
            var aTags = e.select("a.line-clamp-1");
            if (aTags.size() > 0) {
                var firstA = aTags.first();
                var lastA = aTags.last();
                var link = firstA.attr("href");
                if (link && link.indexOf("http") !== 0 && link.charAt(0) !== "/") {
                    link = "/" + link;
                }
                books.push({
                    name: firstA.text().trim(),
                    link: link,
                    description: lastA.text().trim(),
                    host: BASE_URL
                });
            }
        });

        return Response.success(books, nextPage);
    }
    return null;
}