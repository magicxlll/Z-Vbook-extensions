load("config.js");

function execute() {
    return Response.success([
        { title: "Truyện Mới", input: "/stories?sort=newest", script: "homecontent.js" },
        { title: "Truyện Hot", input: "/stories?sort=popular", script: "homecontent.js" },
        { title: "Hoàn Thành", input: "/stories?status=COMPLETED", script: "homecontent.js" }
    ]);
}