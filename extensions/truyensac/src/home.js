load("config.js");

function execute() {
    return Response.success([
        { title: "Truyện Hot", input: API_URL + "/novels/hot", script: "gen.js" },
        { title: "Mới Cập Nhật", input: API_URL + "/novels/latest", script: "gen.js" },
        { title: "Truyện Hoàn Thành", input: API_URL + "/novels?status=completed", script: "gen.js" },
        { title: "Truyện Đang Ra", input: API_URL + "/novels?status=ongoing", script: "gen.js" },
        { title: "Tất Cả Truyện", input: API_URL + "/novels", script: "gen.js" }
    ]);
}
