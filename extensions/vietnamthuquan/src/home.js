// home.js — Trang chủ khám phá
// Contract: execute() → [{ title, input, script }]
load("config.js");

function execute() {
    return Response.success([
        {
            "title": "Tất cả Sách",
            "input": BASE_URL + "/truyen/default.aspx",
            "script": "gen.js"
        },
        {
            "title": "Kiếm Hiệp",
            "input": BASE_URL + "/truyen/theloai.aspx?theloaiid=6",
            "script": "gen.js"
        },
        {
            "title": "Tiên Hiệp, Tu Chân",
            "input": BASE_URL + "/truyen/theloai.aspx?theloaiid=32",
            "script": "gen.js"
        },
        {
            "title": "Tiểu Thuyết",
            "input": BASE_URL + "/truyen/theloai.aspx?theloaiid=23",
            "script": "gen.js"
        },
        {
            "title": "Trinh Thám, Hình Sự",
            "input": BASE_URL + "/truyen/theloai.aspx?theloaiid=12",
            "script": "gen.js"
        },
        {
            "title": "Khoa Huyễn, Giả Tưởng",
            "input": BASE_URL + "/truyen/theloai.aspx?theloaiid=31",
            "script": "gen.js"
        }
    ]);
}
