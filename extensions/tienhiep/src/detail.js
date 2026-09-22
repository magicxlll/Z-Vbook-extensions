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
        var authorEl = doc.select("p:contains(Tác giả:) span, div:contains(Tác giả:) span");
        if (authorEl.size() > 0) {
            author = authorEl.first().text().trim();
        } else {
            var authorMatch = html.match(/Tác giả:\s*<[^>]+>([^<]+)<\/[^>]+>/);
            if (authorMatch) author = authorMatch[1].trim();
        }

        var cover = "";
        var imgEl = doc.select("img[src*='covers'], img[src*='supabase'], img[src*='r2.dev']");
        if (imgEl.size() > 0) {
            cover = imgEl.first().attr("src");
        } else {
            var allImg = doc.select("img");
            if (allImg.size() > 0) {
                cover = allImg.first().attr("src");
            }
        }
        if (!cover) {
            var coverMatch = html.match(/<img[^>]+src=["']([^"']*(?:covers|supabase|r2\.dev)[^"']*)["']/i);
            if (!coverMatch) {
                coverMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
            }
            if (coverMatch) cover = coverMatch[1];
        }

        var ongoing = true;
        var statusEl = doc.select("span:contains(Hoàn thành)");
        if (statusEl.size() > 0 || html.indexOf("Hoàn thành") !== -1) {
            if (html.indexOf("Hoàn thành") !== -1 && html.indexOf("Đang ra") === -1) {
                ongoing = false;
            }
        }

        var genres = [];
        var tagElements = doc.select("div.flex.flex-wrap span");
        var ignoredTags = ["hoàn thành", "đang ra", "chương", "lượt đọc", "bình luận", "sao"];
        for (var i = 0; i < tagElements.size(); i++) {
            var tag = tagElements.get(i).text().trim();
            var lower = tag.toLowerCase();
            var isIgnored = false;
            for (var j = 0; j < ignoredTags.length; j++) {
                if (lower.indexOf(ignoredTags[j]) !== -1) {
                    isIgnored = true;
                    break;
                }
            }
            if (!isIgnored && tag.length > 1 && tag.length < 30) {
                genres.push({
                    title: tag,
                    input: BASE_URL + "/?q=" + encodeURIComponent(tag),
                    script: "gen.js"
                });
            }
        }

        var descEl = doc.select("p.leading-7, p[class*='leading-'], div[class*='text-[#5E5448]']");
        var description = "";
        if (descEl.size() > 0) {
            description = descEl.first().html();
        } else {
            var descMatch = html.match(/<p\b[^>]*class=["'][^"']*leading-7[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
            if (descMatch) description = descMatch[1].trim();
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
