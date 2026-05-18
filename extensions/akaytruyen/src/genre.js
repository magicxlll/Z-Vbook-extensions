// genre.js — Phân loại truyện theo thể loại cho AkayTruyen
// Contract: execute() → [{ title, input, script }]
load("config.js");

function execute() {
    return Response.success([
        {
            "title": "Cổ Đại",
            "input": "https://akaytruyen.com/the-loai/co-dai",
            "script": "gen.js"
        },
        {
            "title": "Tiên Hiệp",
            "input": "https://akaytruyen.com/the-loai/tien-hiep",
            "script": "gen.js"
        },
        {
            "title": "Huyền Huyễn",
            "input": "https://akaytruyen.com/the-loai/huyen-huyen",
            "script": "gen.js"
        },
        {
            "title": "Góc cầm kỳ thi họa",
            "input": "https://akaytruyen.com/the-loai/goc-cam-ky-thi-hoa",
            "script": "gen.js"
        },
        {
            "title": "Giả tưởng",
            "input": "https://akaytruyen.com/the-loai/gia-tuong",
            "script": "gen.js"
        },
        {
            "title": "Hài Hước",
            "input": "https://akaytruyen.com/the-loai/hai-huoc",
            "script": "gen.js"
        },
        {
            "title": "Hiện Đại",
            "input": "https://akaytruyen.com/the-loai/hien-dai",
            "script": "gen.js"
        },
        {
            "title": "Nội Tâm",
            "input": "https://akaytruyen.com/the-loai/noi-tam",
            "script": "gen.js"
        },
        {
            "title": "Ngôn Tình",
            "input": "https://akaytruyen.com/the-loai/ngon-tinh",
            "script": "gen.js"
        },
        {
            "title": "Học Đường",
            "input": "https://akaytruyen.com/the-loai/hoc-duong",
            "script": "gen.js"
        },
        {
            "title": "Xuyên Không",
            "input": "https://akaytruyen.com/the-loai/xuyen-khong",
            "script": "gen.js"
        },
        {
            "title": "Nữ Cường",
            "input": "https://akaytruyen.com/the-loai/nu-cuong",
            "script": "gen.js"
        },
        {
            "title": "Trùng Sinh",
            "input": "https://akaytruyen.com/the-loai/trung-sinh",
            "script": "gen.js"
        }
    ]);
}
