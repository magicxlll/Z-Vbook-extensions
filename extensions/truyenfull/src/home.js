// home.js — Trang chủ khám phá
// Contract: execute() → [{ title, input, script }]
load("config.js");

function execute() {
    return Response.success([
    {
        "title": "Mới cập nhật",
        "input": "https://truyenfull.vision",
        "script": "gen.js"
    },
    {
        "title": "Hoàn thành",
        "input": "https://truyenfull.vision/hoan-thanh/",
        "script": "gen.js"
    }
]);
}
