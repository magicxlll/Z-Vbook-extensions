load("config.js");

function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "https://xtruyen.vn/truyen/?m_orderby=latest", script: "gen.js" },
        { title: "Truyện mới", input: "https://xtruyen.vn/truyen/?m_orderby=new-manga", script: "gen.js" },
        { title: "Truyện Hot", input: "https://xtruyen.vn/truyen/?m_orderby=views", script: "gen.js" },
        { title: "Truyện Full", input: "https://xtruyen.vn/theloai/truyen-full/", script: "gen.js" }
    ]);
}