load("config.js");

function execute(url) {
    try {
        url = cleanUrl(url);

        var res = fetchBook(url);
        if (!res || !res.ok) {
            return Response.error("Không thể tải trang truyện: " + (res ? res.status : "network error"));
        }

        var html = res.text() || "";
        var nextData = extractNextData(html);
        var storyId = null;
        var p = (nextData && nextData.props && nextData.props.pageProps) ? nextData.props.pageProps : null;

        if (p && p.story && p.story.id) {
            storyId = p.story.id;
        }

        if (!storyId) {
            var idMatch = html.match(/"story"\s*:\s*\{[^}]*"id"\s*:\s*(\d+)/i)
                || html.match(/"id_story"\s*:\s*(\d+)/i)
                || html.match(/story[_-]?id["':\s]+(\d+)/i);
            if (idMatch) {
                storyId = idMatch[1];
            }
        }

        // TẦNG 1: Lấy mục lục đầy đủ qua API list-chapters (Mã hóa AES tối ưu O(1))
        if (storyId) {
            try {
                var payload = {
                    id_story: encryptAES(storyId + ""),
                    page: encryptAES("1"),
                    items_per_page: encryptAES("1500"),
                    order: encryptAES("asc")
                };

                var chapRes = postJson(BASE_URL + "/api/chapters/list-chapters", payload);
                if (chapRes && chapRes.data) {
                    var decData = decryptAES(chapRes.data);
                    if (decData) {
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
                    }
                }
            } catch (err1) {}
        }

        // TẦNG 2: Lấy mục lục từ API công khai không mã hóa GET /api/stories/{id}/chapters
        if (storyId) {
            try {
                var apiRes = fetchJson(BASE_URL + "/api/stories/" + storyId + "/chapters?limit=1000");
                if (apiRes && apiRes.chapters && Array.isArray(apiRes.chapters) && apiRes.chapters.length > 0) {
                    var pubChapters = apiRes.chapters;
                    var pubList = [];

                    // Thử lấy slug mẫu từ firstChapter để ghép slug nếu có
                    var sampleSlug = (p && p.firstChapter && p.firstChapter[0]) ? p.firstChapter[0].slug : "";

                    for (var j = 0; j < pubChapters.length; j++) {
                        var item = pubChapters[j];
                        var itemTitle = (item.title || ("Chương " + (item.chapter_order || (j + 1)))).trim();
                        var itemSlug = item.slug || "";

                        var chapUrl = "";
                        if (itemSlug) {
                            chapUrl = BASE_URL + "/chapter/" + itemSlug;
                        } else {
                            chapUrl = BASE_URL + "/chapter/story-" + storyId + "-chap-" + (item.chapter_order || (j + 1)) + "?id=" + item.id;
                        }

                        pubList.push({
                            name: itemTitle,
                            url: chapUrl,
                            host: BASE_URL
                        });
                    }

                    if (pubList.length > 0) {
                        return Response.success(pubList);
                    }
                }
            } catch (err2) {}
        }

        // TẦNG 3: Trích xuất các chương có sẵn từ Next.js SSR Props
        if (p) {
            var fbList = [];
            var seen = {};

            if (p.firstChapter && Array.isArray(p.firstChapter)) {
                p.firstChapter.forEach(function (c) {
                    if (c.slug && !seen[c.slug]) {
                        seen[c.slug] = true;
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
                    if (c.slug && !seen[c.slug]) {
                        seen[c.slug] = true;
                        fbList.push({
                            name: (c.title || ("Chương " + (c.chapter_order || ""))).trim(),
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

        // TẦNG 4: Quét toàn bộ liên kết HTML DOM
        var doc = Html.parse(html);
        var domList = [];
        var seenDom = {};
        doc.select("a[href*='/chapter/']").forEach(function (el) {
            var href = (el.attr("href") || "").trim();
            var title = (el.text() || el.attr("title") || "").trim();
            if (href && title && !seenDom[href]) {
                seenDom[href] = true;
                var fullUrl = href.indexOf("http") === 0 ? href : BASE_URL + (href.indexOf("/") === 0 ? "" : "/") + href;
                domList.push({
                    name: title,
                    url: fullUrl,
                    host: BASE_URL
                });
            }
        });

        if (domList.length > 0) {
            return Response.success(domList);
        }

        return Response.error("Không tìm thấy danh sách chương cho truyện này");
    } catch (globalErr) {
        return Response.error("Lỗi khi nạp mục lục: " + (globalErr.message || globalErr));
    }
}
