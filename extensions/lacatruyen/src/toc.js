load("config.js");
load("crypto.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res || !res.ok) return Response.error("Không thể tải mục lục");

    var html = res.text();
    var nextData = extractNextData(html);

    if (nextData && nextData.props && nextData.props.pageProps) {
        var p = nextData.props.pageProps;
        var storyId = p.story ? p.story.id : null;

        if (storyId) {
            var payload = {
                id_story: encryptAES(storyId + ""),
                page: encryptAES("1"),
                items_per_page: encryptAES("5000"),
                order: encryptAES("asc")
            };

            var chapRes = postJson(BASE_URL + "/api/chapters/list-chapters", payload);
            if (chapRes && chapRes.data) {
                var decData = decryptAES(chapRes.data);
                try {
                    var chapters = JSON.parse(decData);
                    if (Array.isArray(chapters) && chapters.length > 0) {
                        var list = [];
                        for (var i = 0; i < chapters.length; i++) {
                            var c = chapters[i];
                            var title = (c.title || ("Chương " + (c.chapter_order || (i + 1)))).trim();
                            var slug = (c.slug || "").trim();
                            if (!slug) continue;

                            list.push({
                                name: title,
                                url: BASE_URL + "/chapter/" + slug,
                                host: BASE_URL
                            });
                        }
                        if (list.length > 0) {
                            return Response.success(list);
                        }
                    }
                } catch (e) {}
            }
        }

        // Fallback: First & Latest chapters from SSR props
        var fbList = [];
        if (p.firstChapter && Array.isArray(p.firstChapter)) {
            p.firstChapter.forEach(function (c) {
                if (c.slug) {
                    fbList.push({
                        name: (c.title || "Chương 1").trim(),
                        url: BASE_URL + "/chapter/" + c.slug,
                        host: BASE_URL
                    });
                }
            });
        }
        if (p.latestChapters && Array.isArray(p.latestChapters)) {
            p.latestChapters.forEach(function (c) {
                if (c.slug && (!fbList.length || fbList[0].url.indexOf(c.slug) === -1)) {
                    fbList.push({
                        name: (c.title || ("Chương " + c.chapter_order)).trim(),
                        url: BASE_URL + "/chapter/" + c.slug,
                        host: BASE_URL
                    });
                }
            });
        }
        if (fbList.length > 0) {
            return Response.success(fbList);
        }
    }

    // Fallback: DOM parsing
    var doc = Html.parse(html);
    var list = [];
    doc.select("a[href*='/chapter/']").forEach(function (el) {
        var href = el.attr("href") || "";
        var title = (el.text() || el.attr("title") || "").trim();
        if (href && title) {
            var fullUrl = href.indexOf("http") === 0 ? href : BASE_URL + (href.indexOf("/") === 0 ? "" : "/") + href;
            list.push({
                name: title,
                url: fullUrl,
                host: BASE_URL
            });
        }
    });

    return Response.success(list);
}
