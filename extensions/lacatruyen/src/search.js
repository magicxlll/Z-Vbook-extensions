load("config.js");

function execute(key, page) {
    page = page || "1";
    var payload = {
        search: key,
        page: parseInt(page, 10) || 1,
        limit: 20
    };

    var res = postJson(BASE_URL + "/api/stories/search", payload);
    if (!res || !res.data) {
        return Response.error("Không tìm thấy truyện phù hợp");
    }

    var items = [];
    var data = res.data;
    if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var name = (item.title || item.story_title || "").trim();
            var slug = (item.slug || item.story_slug || "").trim();
            if (!name || !slug) continue;

            var cover = resolveCover(item.image || item.story_image, name, slug);
            var desc = item.author || item.pen_name_user || item.description || "";
            if (desc) desc = desc.slice(0, 150);

            items.push({
                name: name,
                link: BASE_URL + "/story/" + slug,
                cover: cover,
                description: desc,
                host: BASE_URL
            });
        }
    }

    var nextPage = items.length >= 20 ? (parseInt(page, 10) + 1) + "" : null;
    return Response.success(items, nextPage);
}
