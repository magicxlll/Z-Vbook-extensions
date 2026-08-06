load("config.js");

function execute() {
    return Response.success([
        { title: "Top Thịnh Hành", input: BASE_URL + "/real/trending", script: "gen.js" },
        { title: "Mới Cập Nhật", input: BASE_URL + "/real/recent", script: "gen.js" }
    ]);
}