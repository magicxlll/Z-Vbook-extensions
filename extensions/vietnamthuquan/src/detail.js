// detail.js — Thông tin chi tiết truyện
// Contract: execute(url) → { name, cover, host, author, description, ongoing, genres?, suggests? }
load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var res = fetchBook(url);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var doc = res.html();

    // Tên truyện từ title của trang
    var name = doc.select("title").text().replace("Mời đọc tác phẩm:", "").split(",")[0].trim() + "";

    // Ảnh bìa - VietnamThuQuan không có ảnh bìa
    var cover = "";

    // Tác giả - Lấy thông qua AJAX chuonghoi_moi.aspx
    var author = "";
    var tuaIdMatch = doc.html().match(/tuaid=(\d+)/);
    var tuaId = tuaIdMatch ? tuaIdMatch[1] : "";
    
    if (tuaId) {
        var resAjax = fetchBook(BASE_URL + "/truyen/chuonghoi_moi.aspx", {
            method: "POST",
            body: "tuaid=" + tuaId + "&chuongid=",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        if (resAjax.ok) {
            var parts = (resAjax.text() + "").split("--!!tach_noi_dung!!--");
            if (parts.length > 1) {
                var docAuthor = Html.parse(parts[1]);
                author = (docAuthor.select(".tacgiaphaia a").text() || docAuthor.select(".tacgiaphaia").text() || "").trim() + "";
                author = author.replace("bộ phi yên", "Bộ Phi Yên"); // Đổi hoa chữ cái nếu thích hoặc giữ nguyên
            }
        }
    }

    if (!author) {
        author = "Việt Nam Thư Quán";
    }

    // Trạng thái - Mặc định hoàn thành vì đây là thư quán lưu trữ
    var ongoing = false;

    // Mô tả
    var description = "Đọc tác phẩm " + name + " của tác giả " + author + " trên Việt Nam Thư Quán.";

    return Response.success({
        name: name,
        cover: cover,
        host: BASE_URL,
        author: author,
        description: description,
        ongoing: ongoing
    });
}
