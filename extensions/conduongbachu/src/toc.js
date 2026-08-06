load("config.js");

function extractChapterNumber(name) {
    var m = (name + "").match(/(?:chương|chap|chapter|\b)\s*(\d+)/i);
    if (m) {
        return parseInt(m[1], 10);
    }
    return 0;
}

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) {
        res = fetchBook(BASE_URL + "/chuong-3752-ket-thuc-se-la-noi-bat-dau/");
    }
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();
    var chapters = [];
    var seen = {};

    // 1. Kiểm tra menu select dropdown (chứa toàn bộ 3,750+ chương truyện chính)
    var options = doc.select("select.chapter-selector option, select option");
    if (options.length > 0) {
        options.forEach(function (el) {
            var name = el.text().trim() + "";
            var chapUrl = (el.attr("value") || el.attr("href") || "") + "";

            if (!name || !chapUrl || chapUrl.indexOf("http") !== 0 || name.indexOf("--") === 0) return;
            if (seen[chapUrl]) return;
            seen[chapUrl] = true;

            chapters.push({
                name: name,
                url: chapUrl,
                host: BASE_URL,
                num: extractChapterNumber(name)
            });
        });
    }

    // 2. Kiểm tra danh sách bài viết <article class="post"> (cho các phần Ngoại Truyện)
    if (chapters.length === 0) {
        var currentUrl = url;
        var pageNum = 1;
        var maxPages = 50;

        while (pageNum <= maxPages) {
            var pageFetchUrl = currentUrl;
            if (pageNum > 1) {
                var cleanBase = currentUrl.replace(/\/$/, "");
                pageFetchUrl = cleanBase + "/page/" + pageNum + "/";
            }

            var pRes = fetchBook(pageFetchUrl);
            if (!pRes.ok) break;

            var pDoc = pRes.html();
            var articles = pDoc.select("article.post");
            if (articles.length === 0) break;

            var addedOnPage = 0;
            articles.forEach(function (el) {
                var a = el.select("h2.entry-title a").first();
                if (!a) return;
                var name = a.text().trim() + "";
                var chapUrl = (a.attr("href") || "") + "";

                if (!name || !chapUrl) return;
                if (chapUrl.indexOf("http") !== 0) {
                    chapUrl = chapUrl.indexOf("/") === 0 ? BASE_URL + chapUrl : BASE_URL + "/" + chapUrl;
                }
                if (seen[chapUrl]) return;
                seen[chapUrl] = true;

                chapters.push({
                    name: name,
                    url: chapUrl,
                    host: BASE_URL,
                    num: extractChapterNumber(name)
                });
                addedOnPage++;
            });

            var nextEl = pDoc.select(".nav-pagination a.next").first();
            if (!nextEl || addedOnPage === 0) break;

            pageNum++;
        }
    }

    if (chapters.length === 0) return Response.error("Không tìm thấy chương nào");

    // Sắp xếp thứ tự chương theo số tự nhiên chuẩn: 1, 2, ..., 9, 10, 11, ..., N
    chapters.sort(function (a, b) {
        if (a.num !== 0 && b.num !== 0) {
            return a.num - b.num;
        }
        return 0;
    });

    var cleanChapters = [];
    chapters.forEach(function (c) {
        cleanChapters.push({
            name: c.name,
            url: c.url,
            host: c.host
        });
    });

    return Response.success(cleanChapters);
}
