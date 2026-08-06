load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    var name = "Con Đường Bá Chủ (Truyện Chính)";
    var cover = "https://conduongbachu.com/wp-content/uploads/2024/12/20355-con-duong-ba-chu_cover_large.webp";
    var author = "Akay Hậu";
    var description = "Truyện Con Đường Bá Chủ của tác giả Akay Hậu thuộc thể loại tiên hiệp, kiếm hiệp đặc sắc cập nhật mới nhất tại conduongbachu.com.";

    if (url.indexOf("/ngoai-truyen-chua-te-chi-lo") > -1) {
        name = "Ngoại Truyện: Chúa Tể Chi Lộ";
        cover = "https://audio.cognitus.store/wp-content/uploads/2026/07/conduongbachu-ngoai-truyen-chuatechilo.jpg";
        description = "Phần ngoại truyện Chúa Tể Chi Lộ của tác giả Akay Hậu.";
    } else if (url.indexOf("/ngoai-truyen-van-dao-than-chu") > -1) {
        name = "Ngoại Truyện: Vạn Đạo Thần Chủ";
        cover = "https://audio.cognitus.store/wp-content/uploads/2026/07/conduongbachu-ngoai-truyen-chuatechilo.jpg";
        description = "Phần ngoại truyện Vạn Đạo Thần Chủ của tác giả Akay Hậu.";
    } else if (url.indexOf("/ngoai-truyen") > -1) {
        name = "Ngoại Truyện: Bất Hủ Thần Chiến";
        cover = "https://conduongbachu.com/wp-content/uploads/2025/04/conduongbachu-ngoai-truyen.jpg";
        description = "Phần ngoại truyện Bất Hủ Thần Chiến của tác giả Akay Hậu.";
    }

    return Response.success({
        name: name,
        cover: cover,
        host: BASE_URL,
        author: author,
        description: description,
        ongoing: true
    });
}
