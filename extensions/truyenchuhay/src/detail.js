load("config.js");

function execute(url) {
    try {
        url = cleanUrl(url);

        var res = fetchBook(url);
        if (!res || !res.ok) {
            return Response.error("Không thể tải thông tin truyện: " + (res ? res.status : "network error"));
        }

        var html = res.text() || "";
        var doc = Html.parse(html);

        var storySlug = url.replace(/^https?:\/\/[^\/]+\//i, "").replace(/[\/\?#].*$/, "");

        // Tên truyện
        var titleEl = doc.select("h1").first();
        var name = titleEl ? titleEl.text().trim() : "";
        name = name.replace(/\s*-\s*Truyện\s*Chữ.*$/i, "").trim();

        // Tác giả
        var authorMatch = html.match(/itemProp="author"[\s\S]*?itemProp="name"[^>]*>([\s\S]*?)<\//i)
            || html.match(/Tác\s*giả\s*:?[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
        var author = authorMatch ? authorMatch[1].replace(/<[^>]+>/g, '').trim() : "";
        if (!author) {
            var authorEl = doc.select("div[itemprop='author'] span[itemprop='name']").first()
                || doc.select("div[itemprop='author'] a").first();
            author = authorEl ? authorEl.text().trim() : "Chưa rõ";
        }

        // Ảnh bìa
        var coverMeta = doc.select("meta[property='og:image']").first();
        var rawCover = coverMeta ? coverMeta.attr("content") : "";
        if (!rawCover) {
            var imgEl = doc.select("img[src*='static2.truyenchuhay.org']").first()
                || doc.select("img[itemprop='image']").first();
            rawCover = imgEl ? (imgEl.attr("src") || imgEl.attr("data-src")) : "";
        }
        var cover = resolveCover(rawCover, storySlug);

        // Trạng thái
        var ongoing = true;
        var statusEl = doc.select("strong.truncate.text-default").first();
        var statusText = statusEl ? statusEl.text().toLowerCase() : "";
        if (!statusText) {
            var allText = html.toLowerCase();
            if (allText.indexOf("hoàn thành") !== -1 || allText.indexOf("full") !== -1) {
                ongoing = false;
                statusText = "Hoàn thành";
            } else {
                statusText = "Đang ra";
            }
        } else {
            if (statusText.indexOf("hoàn thành") !== -1 || statusText.indexOf("full") !== -1) {
                ongoing = false;
            }
        }

        // Thể loại
        var genreElements = doc.select("a[href*='/the-loai/']");
        var genres = [];
        var seenGenre = {};
        for (var i = 0; i < genreElements.size(); i++) {
            var gEl = genreElements.get(i);
            var gName = gEl.text().trim();
            var gHref = gEl.attr("href");
            if (gName && gHref && !seenGenre[gName]) {
                // Loại trừ menu navbar chính nếu danh sách quá dài
                if (genres.length >= 10) break;
                seenGenre[gName] = true;
                genres.push({
                    title: gName,
                    input: cleanUrl(gHref),
                    script: "gen.js"
                });
            }
        }

        // Giới thiệu / Review
        var descEl = doc.select("#review-truyen div.prose").first()
            || doc.select("#review-truyen").first();
        var description = "";
        if (descEl) {
            description = descEl.html() || "";
            description = description.replace(/<h[1-6][^>]*>[\s\S]*?Review[\s\S]*?<\/h[1-6]>/gi, "");
            description = description.replace(/<h[1-6][^>]*>/gi, "<p><b>").replace(/<\/h[1-6]>/gi, "</b></p>");
            description = description.trim();
        }

        var detail = "Tác giả: " + author + "<br>Trạng thái: " + (ongoing ? "Đang ra" : "Hoàn thành");

        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            detail: detail,
            ongoing: ongoing,
            genres: genres,
            host: BASE_URL
        });
    } catch (e) {
        return Response.error("Lỗi khi đọc chi tiết truyện: " + (e.message || e));
    }
}
