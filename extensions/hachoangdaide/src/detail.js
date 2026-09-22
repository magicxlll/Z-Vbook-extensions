load("config.js");

function execute(url) {
    try {
        var res = fetchBook(url);
        if (!res || res.status !== 200) {
            return Response.error("Không thể tải thông tin truyện.");
        }

        var html = res.text();
        var doc = res.html();

        var title = doc.select("h1").text().trim();
        if (!title) {
            var h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
            if (h1Match) title = h1Match[1].replace(/<[^>]+>/g, "").trim();
        }

        var author = "";
        var authorEl = doc.select("p.text-info:contains(Tác giả) a, a[href*='/author/']");
        if (authorEl.size() > 0) {
            author = authorEl.first().text().trim();
        } else {
            var authorMatch = html.match(/Tác giả:\s*<a\b[^>]*>([^<]+)<\/a>/i);
            if (authorMatch) author = authorMatch[1].trim();
        }

        var cover = "";
        var imgEl = doc.select("img[src*='/stories/thumbnail/']");
        if (imgEl.size() > 0) {
            cover = imgEl.first().attr("src");
        }
        if (!cover) {
          var coverMatch = html.match(/<img\b[^>]*src=["']([^"']*\/stories\/thumbnail\/[^"']*)["']/i);
          if (coverMatch) cover = coverMatch[1];
        }

        var ongoing = true;
        var statusEl = doc.select("p.text-info:contains(Tình trạng)");
        if (statusEl.size() > 0 && statusEl.text().indexOf("Hoàn thành") !== -1) {
            ongoing = false;
        }

        var genres = [];
        var tagElements = doc.select("ul.tag a[href*='/tag/']");
        for (var i = 0; i < tagElements.size(); i++) {
            var tagEl = tagElements.get(i);
            var tagTitle = tagEl.text().trim().replace(/^,/, "").trim();
            var tagHref = tagEl.attr("href");
            if (tagTitle && tagHref) {
                genres.push({
                    title: tagTitle,
                    input: cleanUrl(tagHref),
                    script: "gen.js"
                });
            }
        }

        var description = "";
        var descEl = doc.select(".tabcontent .s-content, .s-content");
        if (descEl.size() > 0) {
            description = descEl.first().html();
        }

        return Response.success({
            name: title,
            cover: resolveCover(cover),
            author: author || "Chưa rõ",
            description: description,
            ongoing: ongoing,
            genres: genres,
            host: BASE_URL
        });
    } catch (e) {
        return Response.error("Lỗi: " + e.message);
    }
}
