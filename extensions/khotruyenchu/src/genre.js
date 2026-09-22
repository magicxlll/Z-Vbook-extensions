load("config.js");

function execute() {
    return Response.success([
        { title: "Huyền huyễn - Tiên hiệp", input: BASE_URL + "/the-loai/huyen-huyen-tien-hiep/", script: "gen.js" },
        { title: "Đô thị", input: BASE_URL + "/the-loai/do-thi/", script: "gen.js" },
        { title: "Hệ thống", input: BASE_URL + "/the-loai/he-thong/", script: "gen.js" },
        { title: "Dã sử", input: BASE_URL + "/the-loai/da-su/", script: "gen.js" },
        { title: "Khoa học viễn tưởng", input: BASE_URL + "/the-loai/khoa-hoc-vien-tuong/", script: "gen.js" },
        { title: "Kì ảo", input: BASE_URL + "/the-loai/ki-ao/", script: "gen.js" },
        { title: "Kinh dị", input: BASE_URL + "/the-loai/kinh-di/", script: "gen.js" },
        { title: "Ngôn tình", input: BASE_URL + "/the-loai/ngon-tinh/", script: "gen.js" },
        { title: "Võng du", input: BASE_URL + "/the-loai/vong-du/", script: "gen.js" },
        { title: "Xuyên không - Trùng sinh", input: BASE_URL + "/the-loai/xuyen-khong-trung-sinh/", script: "gen.js" }
    ]);
}
