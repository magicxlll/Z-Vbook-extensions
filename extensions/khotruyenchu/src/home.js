load("config.js");

function execute() {
    return Response.success([
        { title: "Truyện mới của Kho", input: BASE_URL + "/", script: "gen.js" },
        { title: "Top Qidian", input: BASE_URL + "/top-qidian/", script: "gen.js" },
        { title: "Độc giả yêu cầu", input: BASE_URL + "/yeu-cau-dich/", script: "gen.js" },
        { title: "Mới cập nhật", input: BASE_URL + "/#moi-cap-nhat", script: "gen.js" }
    ]);
}
