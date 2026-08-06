load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();

    var name = "Con Đường Bá Chủ";
    var h1 = doc.select("h1.entry-title, h1").first();
    if (h1 && h1.text()) {
        var t = h1.text().trim() + "";
        if (t.indexOf("Chương") === -1 && t.length > 2 && t.length < 100) {
            name = t;
        }
    }

    var cover = "https://conduongbachu.com/wp-content/uploads/2024/12/20355-con-duong-ba-chu_cover_large.webp";
    var coverEl = doc.select(".entry-image-float img, meta[property='og:image']").first();
    if (coverEl) {
        var cSrc = (coverEl.attr("data-src") || coverEl.attr("src") || coverEl.attr("content") || "") + "";
        if (cSrc && cSrc.indexOf("http") === 0) cover = cSrc;
    }

    var author = "Akay Hậu";
    var description = "Truyện Con Đường Bá Chủ của tác giả Akay Hậu thuộc thể loại tiên hiệp, kiếm hiệp đặc sắc cập nhật mới nhất tại conduongbachu.com.";

    var genres = [
        { title: "Chapter truyện", input: BASE_URL + "/chapter-truyen/", script: "gen.js" },
        { title: "Bất Hủ Thần Chiến", input: BASE_URL + "/ngoai-truyen/", script: "gen.js" },
        { title: "Vạn Đạo Thần Chủ", input: BASE_URL + "/ngoai-truyen-van-dao-than-chu/", script: "gen.js" },
        { title: "Chúa Tể Chi Lộ", input: BASE_URL + "/ngoai-truyen-chua-te-chi-lo/", script: "gen.js" }
    ];

    return Response.success({
        name: name,
        cover: cover,
        host: BASE_URL,
        author: author,
        description: description,
        ongoing: true,
        genres: genres
    });
}
