function execute() {
    return Response.success([
        {
            title: "Tất Cả Truyện",
            input: "https://tienhiep.vercel.app/?page=1",
            script: "gen.js"
        },
        {
            title: "Tiên Hiệp Chọn Lọc",
            input: "https://tienhiep.vercel.app/?q=tiên+hiệp",
            script: "gen.js"
        },
        {
            title: "Tu Chân Giới",
            input: "https://tienhiep.vercel.app/?q=tu+tiên",
            script: "gen.js"
        },
        {
            title: "Huyền Huyễn",
            input: "https://tienhiep.vercel.app/?q=huyền+huyễn",
            script: "gen.js"
        }
    ]);
}
