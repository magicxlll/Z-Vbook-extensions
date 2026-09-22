function execute() {
    return Response.success([
        {
            title: "Truyện Hay",
            input: "https://hachoangdaide.online/truyen-hot",
            script: "gen.js"
        },
        {
            title: "Mới Cập Nhật",
            input: "https://hachoangdaide.online/truyen-moi-cap-nhat",
            script: "gen.js"
        },
        {
            title: "Hoàn Thành",
            input: "https://hachoangdaide.online/truyen-full",
            script: "gen.js"
        },
        {
            title: "Xem Nhiều",
            input: "https://hachoangdaide.online/truyen-xem-nhieu/day",
            script: "gen.js"
        },
        {
            title: "Bán Chạy",
            input: "https://hachoangdaide.online/truyen-mua-nhieu",
            script: "gen.js"
        }
    ]);
}
