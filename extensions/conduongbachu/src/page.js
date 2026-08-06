load("config.js");

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    if (url.slice(-1) === "/") url = url.slice(0, -1);

    if (url.indexOf("/ngoai-truyen") > -1) {
        var res = fetchBook(url + "/");
        if (res.ok) {
            var doc = res.html();
            var pages = [url + "/"];
            doc.select(".nav-pagination a.page-number").forEach(function (el) {
                var href = (el.attr("href") || "") + "";
                if (href && href.indexOf("http") === 0 && pages.indexOf(href) === -1) {
                    pages.push(href);
                }
            });
            return Response.success(pages);
        }
    }

    return Response.success([url]);
}
