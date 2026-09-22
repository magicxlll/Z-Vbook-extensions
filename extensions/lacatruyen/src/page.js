load("config.js");

function execute(url) {
    try {
        url = cleanUrl(url);
        return Response.success([url]);
    } catch (e) {
        return Response.success([url]);
    }
}
