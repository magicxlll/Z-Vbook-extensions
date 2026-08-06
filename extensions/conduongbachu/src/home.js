load("config.js");

function execute() {
    return Response.success([
        {
            title: "Tất Cả Bộ Truyện",
            input: BASE_URL + "/all-stories/",
            script: "gen.js"
        },
        {
            title: "Truyện Chính (3752+ Chương)",
            input: BASE_URL + "/chuong-3752-ket-thuc-se-la-noi-bat-dau/",
            script: "gen.js"
        },
        {
            title: "Ngoại Truyện",
            input: BASE_URL + "/all-ngoai-truyen/",
            script: "gen.js"
        }
    ]);
}
