load("config.js");

function execute(url, page) {
    var stories = [
        {
            name: "Con Đường Bá Chủ (Truyện Chính - 3752+ Chương)",
            link: BASE_URL + "/chuong-3752-ket-thuc-se-la-noi-bat-dau/",
            cover: "https://conduongbachu.com/wp-content/uploads/2024/12/20355-con-duong-ba-chu_cover_large.webp",
            description: "Bộ truyện chính Con Đường Bá Chủ của tác giả Akay Hậu thuộc thể loại tiên hiệp, kiếm hiệp. Cập nhật đầy đủ 3,752+ chương.",
            host: BASE_URL
        },
        {
            name: "Ngoại Truyện: Bất Hủ Thần Chiến",
            link: BASE_URL + "/ngoai-truyen/",
            cover: "https://conduongbachu.com/wp-content/uploads/2025/04/conduongbachu-ngoai-truyen.jpg",
            description: "Phần Ngoại Truyện - Bất Hủ Thần Chiến của Con Đường Bá Chủ.",
            host: BASE_URL
        },
        {
            name: "Ngoại Truyện: Vạn Đạo Thần Chủ",
            link: BASE_URL + "/ngoai-truyen-van-dao-than-chu/",
            cover: "https://audio.cognitus.store/wp-content/uploads/2026/07/conduongbachu-ngoai-truyen-chuatechilo.jpg",
            description: "Phần Ngoại Truyện - Vạn Đạo Thần Chủ của Con Đường Bá Chủ.",
            host: BASE_URL
        },
        {
            name: "Ngoại Truyện: Chúa Tể Chi Lộ",
            link: BASE_URL + "/ngoai-truyen-chua-te-chi-lo/",
            cover: "https://audio.cognitus.store/wp-content/uploads/2026/07/conduongbachu-ngoai-truyen-chuatechilo.jpg",
            description: "Phần Ngoại Truyện - Chúa Tể Chi Lộ của Con Đường Bá Chủ.",
            host: BASE_URL
        }
    ];

    if (url.indexOf("/all-ngoai-truyen") > -1) {
        return Response.success(stories.slice(1));
    }

    if (url.indexOf("/chuong-3752") > -1) {
        return Response.success([stories[0]]);
    }

    return Response.success(stories);
}
