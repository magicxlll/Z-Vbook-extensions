load("config.js");

function execute(url) {
    try {
        var chapters = [];

        // Case 1: URL is API endpoint
        if (url.indexOf("/api/books/") !== -1) {
            var slugMatch = url.match(/[?&]slug=([a-zA-Z0-9_\-]+)/);
            var slug = slugMatch ? slugMatch[1] : "";

            var data = fetchJson(url);
            if (data && data.chapters && Array.isArray(data.chapters)) {
                for (var i = 0; i < data.chapters.length; i++) {
                    var ch = data.chapters[i];
                    var chNum = ch.chapter_number;
                    var chTitle = ch.title || ("Chương " + chNum);
                    var chUrl = BASE_URL + "/books/" + slug + "/chapters/" + chNum;

                    chapters.push({
                        name: chTitle,
                        url: chUrl,
                        host: BASE_URL
                    });
                }
                return Response.success(chapters);
            }
        }

        // Case 2: Fallback to HTML scraping
        var res = fetchBook(url);
        if (!res || res.status !== 200) {
            return Response.error("Không thể tải danh sách chương.");
        }

        var doc = res.html();
        var links = doc.select("a[href*='/chapters/']");
        var seen = {};

        for (var j = 0; j < links.size(); j++) {
            var a = links.get(j);
            var href = a.attr("href");
            if (!href) continue;

            var cleanHref = cleanUrl(href);
            if (seen[cleanHref]) continue;
            seen[cleanHref] = true;

            var title = a.select("span.truncate").text().trim() || a.text().trim();
            if (!title) title = "Chương " + (j + 1);

            chapters.push({
                name: title,
                url: cleanHref,
                host: BASE_URL
            });
        }

        return Response.success(chapters);
    } catch (e) {
        return Response.error("Lỗi: " + e.message);
    }
}
