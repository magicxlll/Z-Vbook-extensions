function execute() {
    return Response.success([
        {
            title: "Truyện Mới Cập Nhật",
            input: "https://truyenchuhay.org/danh-sach/truyen-moi",
            script: "gen.js"
        },
        {
            title: "Truyện Hot",
            input: "https://truyenchuhay.org/danh-sach/truyen-hot",
            script: "gen.js"
        },
        {
            title: "Truyện Full",
            input: "https://truyenchuhay.org/danh-sach/truyen-full",
            script: "gen.js"
        }
    ]);
}
