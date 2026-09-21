load("config.js");

function execute() {
    return Response.success([
        { title: "Tiên Hiệp", input: BASE_URL + "/category/tien-hiep", script: "gen.js" },
        { title: "Huyền Huyễn", input: BASE_URL + "/category/huyen-huyen", script: "gen.js" },
        { title: "Đô Thị", input: BASE_URL + "/category/do-thi", script: "gen.js" },
        { title: "Khoa Huyễn", input: BASE_URL + "/category/khoa-huyen", script: "gen.js" },
        { title: "Hệ Thống", input: BASE_URL + "/category/he-thong", script: "gen.js" },
        { title: "Xuyên Không", input: BASE_URL + "/category/xuyen-khong", script: "gen.js" },
        { title: "Cổ Đại", input: BASE_URL + "/category/co-dai", script: "gen.js" },
        { title: "Võng Du", input: BASE_URL + "/category/vong-du", script: "gen.js" },
        { title: "Đồng Nhân", input: BASE_URL + "/category/dong-nhan", script: "gen.js" },
        { title: "Dã Sử", input: BASE_URL + "/category/da-su", script: "gen.js" },
        { title: "Linh Dị", input: BASE_URL + "/category/linh-di", script: "gen.js" },
        { title: "Mạt Thế", input: BASE_URL + "/category/mat-the", script: "gen.js" },
        { title: "Quân Sự", input: BASE_URL + "/category/quan-su", script: "gen.js" },
        { title: "Võ Hiệp", input: BASE_URL + "/category/vo-hiep", script: "gen.js" }
    ]);
}
