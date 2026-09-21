load("config.js");

function execute() {
    return Response.success([
        { title: "Tiên Hiệp", input: BASE_URL + "/category/tien-hiep", script: "gen.js" },
        { title: "Huyền Huyễn", input: BASE_URL + "/category/huyen-huyen", script: "gen.js" },
        { title: "Đô Thị", input: BASE_URL + "/category/do-thi", script: "gen.js" },
        { title: "Khoa Huyễn", input: BASE_URL + "/category/khoa-huyen", script: "gen.js" },
        { title: "Võng Du", input: BASE_URL + "/category/vong-du", script: "gen.js" },
        { title: "Đồng Nhân", input: BASE_URL + "/category/dong-nhan", script: "gen.js" },
        { title: "Dã Sử", input: BASE_URL + "/category/da-su", script: "gen.js" },
        { title: "Cổ Đại", input: BASE_URL + "/category/co-dai", script: "gen.js" },
        { title: "Xuyên Không", input: BASE_URL + "/category/xuyen-khong", script: "gen.js" },
        { title: "Linh Dị", input: BASE_URL + "/category/linh-di", script: "gen.js" },
        { title: "Hệ Thống", input: BASE_URL + "/category/he-thong", script: "gen.js" },
        { title: "Mạt Thế", input: BASE_URL + "/category/mat-the", script: "gen.js" },
        { title: "Quân Sự", input: BASE_URL + "/category/quan-su", script: "gen.js" },
        { title: "Cung Đấu", input: BASE_URL + "/category/cung-dau", script: "gen.js" },
        { title: "Nữ Cường", input: BASE_URL + "/category/nu-cuong", script: "gen.js" },
        { title: "Gia Đấu", input: BASE_URL + "/category/gia-dau", script: "gen.js" },
        { title: "Bách Hợp", input: BASE_URL + "/category/bach-hop", script: "gen.js" },
        { title: "Đam Mỹ", input: BASE_URL + "/category/dam-my", script: "gen.js" },
        { title: "Điền Văn", input: BASE_URL + "/category/dien-van", script: "gen.js" },
        { title: "Cạnh Kỹ", input: BASE_URL + "/category/canh-ky", script: "gen.js" },
        { title: "Trinh Thám", input: BASE_URL + "/category/trinh-tham", script: "gen.js" },
        { title: "Dị Năng", input: BASE_URL + "/category/di-nang", script: "gen.js" },
        { title: "Xuyên Nhanh", input: BASE_URL + "/category/xuyen-nhanh", script: "gen.js" },
        { title: "Võ Hiệp", input: BASE_URL + "/category/vo-hiep", script: "gen.js" }
    ]);
}
