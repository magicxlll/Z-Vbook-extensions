load("config.js");

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

    // 1. Kiểm tra menu thả xuống <select class="chapter-selector"> (chứa toàn bộ 3,750+ chương truyện chính)
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
                host: BASE_URL
            });
        });
    }

    // 2. Kiểm tra danh sách bài viết <article class="post"> (cho các phần Ngoại Truyện)
    if (chapters.length === 0) {
        doc.select("article.post").forEach(function (el) {
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
                host: BASE_URL
            });
        });

        // Đảo ngược mảng để chương nhỏ lên trước (Chương 1 -> Chương N)
        chapters.reverse();
    }

    if (chapters.length === 0) return Response.error("Không tìm thấy chương nào");
    return Response.success(chapters);
}
