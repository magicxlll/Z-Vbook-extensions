// home.js — Trang chủ khám phá
// Contract: execute() → [{ title, input, script }]
load("config.js");

function execute() {
    return Response.success([
    {
        "title": "Mới cập nhật",
        "input": BASE_URL,
        "script": "gen.js"
    },
    {
        "title": "Hoàn thành",
        "input": BASE_URL + "/hoan-thanh/",
        "script": "gen.js"
    }
]);
}
