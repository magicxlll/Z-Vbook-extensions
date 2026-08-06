// home.js — Trang chủ khám phá
// Contract: execute() → [{ title, input, script }]
load("config.js");

function execute() {
    return Response.success([
    {
        "title": "Mới cập nhật",
        "input": "https://conduongbachu.com",
        "script": "gen.js"
    },
    {
        "title": "Hoàn thành",
        "input": "https://conduongbachu.com/hoan-thanh/",
        "script": "gen.js"
    }
]);
}
