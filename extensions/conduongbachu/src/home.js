load("config.js");

function execute() {
    return Response.success([
        {
            title: "Con Đường Bá Chủ",
            input: BASE_URL + "/chuong-3752-ket-thuc-se-la-noi-bat-dau/",
            script: "gen.js"
        },
        {
            title: "Tất cả Chapter",
            input: BASE_URL + "/chapter-truyen/",
            script: "gen.js"
        },
        {
            title: "Bất Hủ Thần Chiến",
            input: BASE_URL + "/ngoai-truyen/",
            script: "gen.js"
        },
        {
            title: "Vạn Đạo Thần Chủ",
            input: BASE_URL + "/ngoai-truyen-van-dao-than-chu/",
            script: "gen.js"
        },
        {
            title: "Chúa Tể Chi Lộ",
            input: BASE_URL + "/ngoai-truyen-chua-te-chi-lo/",
            script: "gen.js"
        }
    ]);
}
