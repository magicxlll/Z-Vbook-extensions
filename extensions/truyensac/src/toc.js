load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res || !res.ok) return Response.error("Không thể tải mục lục truyện");

    var html = res.text() || "";
    var slugMatch = url.match(/\/truyen\/([^\/\?]+)/);
    var slug = slugMatch ? slugMatch[1] : "";

    // 1. Tìm chapter ID đầu tiên để lấy novelId từ API
    var firstChapMatch = html.match(/href="\/doc-truyen\/[^"]*-(\d+)"/);
    if (firstChapMatch) {
        var firstChapId = firstChapMatch[1];
        var chapInfo = fetchJson(API_URL + "/chapters/" + firstChapId);
        if (chapInfo && chapInfo.novelId) {
            var novelId = chapInfo.novelId;
            var chapters = [];
            var page = 1;
            var hasMore = true;

            while (hasMore && page <= 200) {
                var apiRes = fetchJson(API_URL + "/novels/" + novelId + "/chapters?page=" + page + "&limit=50&sort=asc");
                if (!apiRes || !apiRes.chapters || apiRes.chapters.length === 0) break;

                var list = apiRes.chapters;
                for (var i = 0; i < list.length; i++) {
                    var c = list[i];
                    var cUrl = BASE_URL + "/doc-truyen/" + slug + "-" + c.slug + "-" + c.id;
                    chapters.push({
                        name: c.name,
                        url: cUrl,
                        host: BASE_URL
                    });
                }

                var total = apiRes.total || 0;
                if (chapters.length >= total || list.length < 50) {
                    hasMore = false;
                } else {
                    page++;
                }
            }

            if (chapters.length > 0) {
                return Response.success(chapters);
            }
        }
    }

    // 2. Dự phòng: Quét danh sách chương trực tiếp từ HTML SSR
    var doc = res.html();
    var fallbackChapters = [];
    var seen = {};

    doc.select("li[itemtype*='Chapter'] a, a[href*='/doc-truyen/']").forEach(function (el) {
        var href = (el.attr("href") || "") + "";
        if (href.indexOf("/doc-truyen/") === -1) return;
        var chapUrl = href.indexOf("http") === 0 ? href : BASE_URL + href;
        if (seen[chapUrl]) return;
        seen[chapUrl] = true;

        var name = (el.select("span[itemprop='name']").text() || el.attr("title") || el.text() || "").replace(/^Đọc\s+/i, "").trim();
        if (name) {
            fallbackChapters.push({
                name: name,
                url: chapUrl,
                host: BASE_URL
            });
        }
    });

    if (fallbackChapters.length === 0) return Response.error("Không tìm thấy chương nào");
    return Response.success(fallbackChapters);
}
