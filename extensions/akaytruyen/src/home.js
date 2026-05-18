// home.js — Trang chủ khám phá
// Contract: execute() → [{ title, input, script }]
load("config.js");

function execute() {
    return Response.success([
    {
        "title": "Mới cập nhật",
        "input": "https://akaytruyen.com",
        "script": "gen.js"
    },
    {
        "title": "Hoàn thành",
        "input": "https://akaytruyen.com/hoan-thanh/",
        "script": "gen.js"
    }
]);
}
