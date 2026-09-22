load("config.js");

function execute(url) {
    try {
        var cleanTargetUrl = cleanUrl(url);
        var res = fetchBook(cleanTargetUrl);
        if (!res || res.status !== 200) {
            return Response.error("Không thể tải thông tin truyện.");
        }

        var html = res.text();
        var doc = Html.parse(html);

        // 1. Tên truyện
        var name = "";
        // Thử tìm trong schema json-ld
        var ldMatches = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
        if (ldMatches) {
            for (var i = 0; i < ldMatches.length; i++) {
                try {
                    var jsonStr = ldMatches[i].replace(/<script\b[^>]*>|<\/script>/gi, "").trim();
                    var ldData = JSON.parse(jsonStr);
                    var graph = ldData["@graph"] || [ldData];
                    for (var g = 0; g < graph.length; g++) {
                        var node = graph[g];
                        if (node["@type"] === "CreativeWorkSeries" || node["@type"] === "Book") {
                            if (node.name) name = node.name.trim();
                            break;
                        }
                    }
                } catch (eJson) {}
                if (name) break;
            }
        }

        if (!name) {
            var h1El = doc.select("h1").first();
            if (h1El) {
                var labelEl = h1El.select(".ct-title-label").first();
                if (labelEl) labelEl.remove();
                name = h1El.text().replace(/^Bộ\s*truyện\s*/i, "").trim();
            }
        }

        if (!name) {
            name = "Truyện";
        }

        // 2. Ảnh bìa
        var cover = "";
        if (ldMatches) {
            for (var j = 0; j < ldMatches.length; j++) {
                try {
                    var jStr = ldMatches[j].replace(/<script\b[^>]*>|<\/script>/gi, "").trim();
                    var ld = JSON.parse(jStr);
                    var gr = ld["@graph"] || [ld];
                    for (var k = 0; k < gr.length; k++) {
                        var n = gr[k];
                        if ((n["@type"] === "CreativeWorkSeries" || n["@type"] === "Book") && n.image) {
                            cover = n.image;
                            break;
                        }
                    }
                } catch (eJ) {}
                if (cover) break;
            }
        }

        if (!cover) {
            var postImg = doc.select("img.wp-post-image").first();
            if (postImg) {
                cover = postImg.attr("data-src") || postImg.attr("src") || "";
            }
        }

        if (!cover) {
            var allImgs = doc.select("img");
            for (var m = 0; m < allImgs.size(); m++) {
                var src = allImgs.get(m).attr("data-src") || allImgs.get(m).attr("src") || "";
                if (src && src.indexOf("/wp-content/uploads/") !== -1 && src.indexOf("Logo") === -1 && src.indexOf("avatar") === -1) {
                    cover = src;
                    break;
                }
            }
        }
        cover = resolveCover(cover);

        // 3. Tác giả
        var author = "";
        var authorEl = doc.select("a[href*='/tac-gia/']").first();
        if (authorEl) {
            author = authorEl.text().trim();
        } else {
            var authorRegex = html.match(/Tác giả:\s*(?:<strong>)?\s*([^<\n]+)/i);
            if (authorRegex && authorRegex[1]) {
                author = authorRegex[1].replace(/<[^>]+>/g, "").trim();
            }
        }
        if (!author) author = "Đang cập nhật";

        // 4. Trạng thái
        var ongoing = true;
        var statusMatch = html.match(/(?:Tình trạng|Trạng thái):\s*(?:<strong>)?\s*([^<\n]+)/i);
        var statusText = "Đang ra";
        if (statusMatch && statusMatch[1]) {
            var st = statusMatch[1].replace(/<[^>]+>/g, "").trim();
            if (/hoàn\s*thành|trọn\s*bộ|full/i.test(st)) {
                ongoing = false;
                statusText = "Hoàn thành";
            }
        }

        // 5. Thể loại
        var genreLinks = doc.select("a[href*='/the-loai/']");
        var genres = [];
        for (var gIdx = 0; gIdx < genreLinks.size(); gIdx++) {
            var gText = genreLinks.get(gIdx).text().trim();
            if (gText && genres.indexOf(gText) === -1) {
                genres.push(gText);
            }
        }

        // 6. Mô tả
        var descEl = doc.select(".truyen-desc").first() || doc.select(".page-description").first();
        var description = "";
        if (descEl) {
            description = descEl.html().trim();
        }

        // 7. Chi tiết metadata
        var detail = "Tác giả: " + author + "<br>Trạng thái: " + statusText;
        if (genres.length > 0) {
            detail += "<br>Thể loại: " + genres.join(", ");
        }

        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            detail: detail,
            ongoing: ongoing,
            host: BASE_URL
        });
    } catch (e) {
        return Response.error("Lỗi khi tải chi tiết truyện: " + (e.message || e));
    }
}
