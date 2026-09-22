load("config.js");

function execute(url) {
    try {
        var res = fetchBook(url);
        if (!res || res.status !== 200) {
            return Response.error("Không thể tải thông tin mục lục.");
        }

        var html = res.text();
        var doc = res.html();

        var bookId = extractBookId(html, url);
        var slug = extractBookSlug(url);

        var options = doc.select("select option");
        var pages = [];

        for (var i = 0; i < options.size(); i++) {
            var opt = options.get(i);
            var text = opt.text().trim();
            var val = opt.attr("value");

            // Only pick chapter range options (e.g., "Chương 1-100")
            if (text.indexOf("Chương") !== -1 || text.indexOf("chương") !== -1) {
                if (bookId) {
                    pages.push(BASE_URL + "/api/books/" + bookId + "/chapters?page=" + val + "&slug=" + slug);
                }
            }
        }

        // If no select options found, either short book (<100 chapters) or single page
        if (pages.length === 0) {
            if (bookId) {
                pages.push(BASE_URL + "/api/books/" + bookId + "/chapters?page=0&slug=" + slug);
            } else {
                // Fallback to static URL
                pages.push(cleanUrl(url));
            }
        }

        return Response.success(pages);
    } catch (e) {
        return Response.error("Lỗi: " + e.message);
    }
}
