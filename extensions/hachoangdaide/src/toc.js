load("config.js");

function execute(url) {
    try {
        var chapters = [];

        // Case 1: API URL
        if (url.indexOf("/get-list-chapers") !== -1) {
            var data = fetchJson(url);
            if (data && data.result && data.data && Array.isArray(data.data)) {
                for (var i = 0; i < data.data.length; i++) {
                    var ch = data.data[i];
                    chapters.push({
                        name: ch.name,
                        url: cleanUrl(ch.url),
                        host: BASE_URL,
                        pay: ch.money > 0
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
        var links = doc.select("a[href*='/chuong-']");
        var seen = {};

        for (var j = 0; j < links.size(); j++) {
            var a = links.get(j);
            var href = a.attr("href");
            if (!href) continue;

            var cleanHref = cleanUrl(href);
            if (seen[cleanHref]) continue;
            seen[cleanHref] = true;

            var title = a.text().trim();
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
