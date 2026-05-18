// home.js — Trang chủ khám phá
// Contract: execute() → [{ title, input, script }]
load("config.js");

function execute() {
    return Response.success([
    {
        "title": "Mới cập nhật",
        "input": "http://vietnamthuquan.eu",
        "script": "gen.js"
    },
    {
        "title": "Hoàn thành",
        "input": "http://vietnamthuquan.eu/hoan-thanh/",
        "script": "gen.js"
    }
]);
}
