load("config.js");

function execute(key, page) {
    try {
        var currentPage = parseInt(page || "1", 10);
        var searchUrl = BASE_URL + "/search?keyword=" + encodeURIComponent(key);

        if (currentPage > 1) {
            searchUrl += "&page=" + currentPage;
        }

        var res = fetchBook(searchUrl);
        if (!res || res.status !== 200) {
            return Response.error("Không thể tìm kiếm truyện.");
        }

        var doc = res.html();
        var items = doc.select(".novel-item, .item-story, div[class*='novel-item']");
        var books = [];
        var seen = {};

        for (var i = 0; i < items.size(); i++) {
            var item = items.get(i);

            var title = item.select("h3 a").text().trim();
            if (!title) {
                var aImg = item.select("a.img");
                if (aImg.size() > 0) {
                    title = aImg.first().attr("title").trim();
                }
            }
            if (!title) {
                var imgTitle = item.select("img");
                if (imgTitle.size() > 0) {
                    title = imgTitle.first().attr("alt").trim();
                }
            }

            var link = "";
            var linkEl = item.select("h3 a, a.img, a[href*='hachoangdaide.online/']");
            if (linkEl.size() > 0) {
                link = linkEl.first().attr("href");
            }
            if (!link || link.indexOf("javascript:") !== -1) continue;

            var cleanLink = cleanUrl(link);
            if (seen[cleanLink]) continue;
            seen[cleanLink] = true;

            var cover = "";
            var imgEl = item.select("img");
            if (imgEl.size() > 0) {
                cover = imgEl.first().attr("src") || imgEl.first().attr("data-src") || "";
            }
            if (!cover) {
                var sourceEl = item.select("source");
                if (sourceEl.size() > 0) {
                    cover = sourceEl.first().attr("srcset") || sourceEl.first().attr("data-srcset") || "";
                }
            }

            var desc = item.select(".content p, .author, .text-info").text().trim();

            books.push({
                name: title,
                link: cleanLink,
                cover: resolveCover(cover),
                description: desc,
                host: BASE_URL
            });
        }

        var nextPage = currentPage + 1;
        var hasNext = doc.select("a[href*='page=" + nextPage + "']").size() > 0;
        var next = hasNext ? String(nextPage) : null;

        return Response.success(books, next);
    } catch (e) {
        return Response.error("Lỗi: " + e.message);
    }
}
