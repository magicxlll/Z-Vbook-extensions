load("config.js");

function execute() {
    return Response.success([
        { title: "Mới Cập Nhật", input: "?sort=updatedAt", script: "homecontent.js" },
        { title: "Truyện Mới", input: "?sort=newest", script: "homecontent.js" },
        { title: "Truyện Hot", input: "?sort=popular", script: "homecontent.js" },
        { title: "Hoàn Thành", input: "?status=COMPLETED", script: "homecontent.js" }
    ]);
}
