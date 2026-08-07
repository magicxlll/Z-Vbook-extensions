load("config.js");

function execute() {
    return Response.success([
        { title: "Truyện Hot", input: BASE_URL + "/truyen-hot", script: "search.js" },
        { title: "Truyện Mới", input: BASE_URL + "/truyen-moi", script: "search.js" },
        { title: "Truyện Full", input: BASE_URL + "/truyen-full", script: "search.js" }
    ]);
}