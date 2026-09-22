load("config.js");

function execute(key, page) {
    try {
        var currentPage = parseInt(page || "1", 10);
        var searchUrl = BASE_URL + "/?q=" + encodeURIComponent(key);

        if (currentPage > 1) {
            searchUrl += "&page=" + currentPage;
        }

        var res = fetchBook(searchUrl);
        if (!res || res.status !== 200) {
            return Response.error("Không thể tìm kiếm truyện.");
        }

        var doc = res.html();
        var elements = doc.select("a[href*='/books/']");
        var books = [];
        var seen = {};

        for (var i = 0; i < elements.size(); i++) {
            var el = elements.get(i);
            var href = el.attr("href");
            if (!href || href.indexOf("/chapters/") !== -1) continue;

            var m = href.match(/\/books\/[a-zA-Z0-9_\-]+/);
            if (!m) continue;
            var bookPath = m[0];
            if (seen[bookPath]) continue;
            seen[bookPath] = true;

            var elHtml = el.html();

            // Extract title cleanly
            var title = el.select("h3, h2").text().trim();
            if (!title) {
                var imgEl = el.select("img");
                if (imgEl.size() > 0) {
                    title = imgEl.attr("alt").trim();
                }
            }
            if (!title && elHtml) {
                var titleMatch = elHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
                if (titleMatch) {
                    title = titleMatch[1].replace(/<[^>]+>/g, "").trim();
                }
            }
            if (!title && elHtml) {
                var altMatch = elHtml.match(/alt=["']([^"']+)["']/i);
                if (altMatch) {
                    title = altMatch[1].trim();
                }
            }

            // Extract cover
            var cover = "";
            var imgSel = el.select("img");
            if (imgSel.size() > 0) {
                cover = imgSel.attr("src") || imgSel.attr("data-src") || "";
            }
            if (!cover && elHtml) {
                var coverMatch = elHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
                if (coverMatch) {
                    cover = coverMatch[1];
                }
            }

            // Extract description / author / chapter count
            var desc = el.select("div.flex.items-center, div.text-\\[\\#7A7365\\]").text().trim();
            if (!desc) {
                var spans = el.select("span");
                var descParts = [];
                for (var s = 0; s < spans.size(); s++) {
                    var st = spans.get(s).text().trim();
                    if (st && st !== "•" && st.length < 50) descParts.push(st);
                }
                desc = descParts.join(" • ");
            }

            books.push({
                name: title,
                link: cleanUrl(bookPath),
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
