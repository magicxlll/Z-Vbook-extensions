# MEMORY & PROJECT KNOWLEDGE BASE - Z-VBOOK-EXTENSIONS

> **Mô tả dự án:** Kho lưu trữ và phát triển Extension (Plugin) cho ứng dụng đọc truyện & xem phim **vBook** (Android/iOS).
> **Tác giả:** Zitzz (`magicxlll`)
> **Tham khảo kiến trúc chuẩn:** [Darkrai9x/vbook-extensions](https://github.com/Darkrai9x/vbook-extensions.git)
> **Cập nhật lần cuối:** 2026-09-21 (Sửa lỗi lấy ảnh bìa / cover cho extension Truyện Sắc v2)

---

## 1. Tổng quan Kiến trúc vBook Extensions

vBook sử dụng môi trường thực thi JavaScript (QuickJS / Duktape / Android V8) trên ứng dụng di động để cào dữ liệu (scraping) từ các trang web truyện, truyện tranh (comic/manga), và phim/video (donghua/anime/series).

### 1.1. Cấu trúc Thư mục Chuẩn của 1 Extension

```
extensions/<extension_id>/
├── plugin.json       # Metadata & Khai báo script routing của extension
├── icon.png          # Logo/Icon đại diện của nguồn
├── plugin.zip        # Gói zip nén chứa plugin.json, icon.png và thư mục src/
└── src/              # Toàn bộ mã nguồn Javascript
    ├── config.js     # BASE_URL, User-Agent, helper functions dùng chung
    ├── home.js       # Danh mục các tab khám phá trang chủ
    ├── gen.js        # Parser phân trang danh sách truyện/phim
    ├── genre.js      # Danh mục thể loại (nếu có)
    ├── detail.js     # Chi tiết thông tin truyện (tên, tác giả, mô tả, ảnh bìa, trạng thái)
    ├── search.js     # Tìm kiếm truyện theo từ khóa
    ├── toc.js        # Danh sách mục lục chương (Table of Contents)
    ├── chap.js       # Nội dung đọc chương (HTML cho novel, list ảnh cho comic, list video cho video)
    ├── page.js       # (Tùy chọn) Danh sách trang mục lục nếu web phân trang TOC
    ├── track.js      # (Extension video) Lấy link stream video (m3u8, mp4...)
    └── explore.js    # (Extension video/comic tùy biến)
```

### 1.2. Hợp đồng Script & API Runtime (vBook JS Runtime Contracts)

#### Đối tượng Toàn cục (Globals):
- `fetch(url, options)`: Thực hiện HTTP request. Trả về object có `.ok`, `.status`, `.text()`, `.json()`, `.html()`.
- `Html.parse(htmlString)`: Parse chuỗi HTML thành DOM Document hỗ trợ CSS Selectors (Jsoup-like).
- `Response.success(data, nextPage)`: Trả về kết quả thành công cho ứng dụng vBook.
- `Response.error(message)`: Báo lỗi cho ứng dụng.
- `load(scriptName)`: Nạp file JS khác trong cùng thư mục `src/` (thường nạp `load("config.js")`).
- `Engine.newBrowser()`: Mở headless WebView để vượt cloudflare/render JS nếu cần (`browser.launch(url, timeoutMs)`).
- `CONFIG_URL`: Biến cấu hình URL do người dùng tùy chỉnh trong cài đặt vBook.

#### Chi tiết Hợp đồng từng Script:
| Script | Tham số đầu vào | Định dạng trả về `Response.success(...)` | Ghi chú |
| :--- | :--- | :--- | :--- |
| `home.js` | `()` | `[{ title: string, input: string, script: string }]` | Trả về danh sách tab trên Home |
| `genre.js` | `()` | `[{ title: string, input: string, script: string }]` | Danh sách thể loại |
| `gen.js` | `(url, page)` | `([{ name, link, cover, host, description }], nextPage)` | Danh sách truyện theo phân trang |
| `search.js` | `(key, page)` | `([{ name, link, cover, host }], nextPage)` | Tìm kiếm truyện |
| `detail.js` | `(url)` | `{ name, cover, host, author, description, ongoing, genres?, suggests? }` | Chi tiết truyện |
| `page.js` | `(url)` | `[url1, url2, ...]` | Mảng URL phân trang TOC (nếu dùng) |
| `toc.js` | `(url)` | `[{ name: string, url: string, host: string, pay?: boolean }]` | Danh sách chương |
| `chap.js` | `(url)` | Chuỗi HTML `"<p>Nội dung...</p>"` (Novel) hoặc `[imgUrl1, ...]` (Comic) | Nội dung chương |
| `track.js` | `(url)` | Stream info / link video | Chỉ dùng cho `video` extension |

---

## 2. Danh mục & Tình trạng Extensions Hiện tại trong Repo (12 Extensions)

| Tên Extension | Thư mục | Loại | Phiên bản | Nguồn (Host) | Đăng ký ở `plugin.json` gốc | Tình trạng & Đánh giá |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **AkayTruyen** | `akaytruyen` | Novel | v1 | `https://akaytruyen.com` | ✅ Có | Hoạt động tốt. Đã xử lý đảo thứ tự chương chuẩn. |
| **Bàn Long** | `banlong` | Novel | v22 | `https://blhvip.vn` | ✅ Có | Có fallback WebView. |
| **Con Đường Bá Chủ** | `conduongbachu` | Novel | v4 | `https://conduongbachu.com` | ✅ Có | Chuyên biệt 3752+ chương, sort số học, lọc audio player TTS và quảng cáo tốt. |
| **HHTQ Vietsub** | `hhtqvietsub` | Video | v9 | `https://hhtq.hair` | ✅ Có | Mã hóa vBook (`encrypt: true`). Xem Donghua Trung Quốc. |
| **Motchill** | `motchill` | Video | v2 | `https://motchille.tv` | ✅ Có | Mã hóa vBook (`encrypt: true`). Phim vietsub/thuyết minh. |
| **Storya** | `storya` | Novel | v22 | `https://storya.click` | ✅ Có | Dùng REST API JSON trực tiếp tốc độ cao. |
| **Thư viện Online** | `vietnamthuquan` | Novel | v1 | `http://vietnamthuquan.eu` | ✅ Có | Cào dữ liệu thư quán qua ASPX POST. Đã đăng ký kệ. |
| **Truyện Full** | `truyenfull` | Novel | v2 | `https://truyenfull.vision` | ✅ Có | Hoạt động tốt. |
| **Truyện Sắc** | `truyensac` | Novel | **v2** | `https://truyensac.buzz` | ✅ Có | Fix triệt để lấy cover truyện thực từ CDN / fallback slug, loại bỏ logo mặc định. |
| **Vireal** | `vireal` | Novel | v4 | `https://vireal.vn` | ✅ Có | Parse dữ liệu SSR Json block. Đã đăng ký kệ. |
| **XTruyen Test** | `xtruyen` | Novel | v2 | `https://xtruyen.vn` | ✅ Có | Theme Madara (WP), lấy TOC qua `admin-ajax.php`. |
| **YanHH3D** | `yanhh3d` | Video | v2 | `https://yanhh3d.ee` | ✅ Có | Mã hóa vBook (`encrypt: true`). Hoạt hình 3D. |

---

## 3. Chi tiết Kỹ thuật Sửa lỗi Cover Truyện Sắc (`truyensac.buzz` v2)

### Nguyên nhân lỗi:
1. `truyensac.buzz` đặt thẻ `<meta property="og:image" content="https://truyensac.buzz/imgs/logo.webp">` trên hầu hết các trang chi tiết, dẫn đến việc `detail.js` trước đây luôn trích xuất logo trang web thay vì ảnh bìa truyện.
2. Thẻ `<img>` đầu tiên trên trang HTML luôn là logo menu đầu trang.
3. Trong API danh sách, nhiều truyện trả về `coverUrl: ""` hoặc `null`.

### Giải pháp khắc phục (v2):
1. **Trích xuất chính xác ảnh truyện:** Ưu tiên selector `img[itemprop='image']`, lọc bỏ hoàn toàn `logo.webp` và `no-image.webp`.
2. **Chuẩn hóa CDN URL:** Tự động sửa lỗi double-slash (`files//covers/` -> `files/covers/`).
3. **Auto CDN Slug Resolution:** Khi API hoặc HTML không có cover sẵn, `resolveCover(cover, slug)` tự động ánh xạ đến `https://file.truyensac.buzz/files/covers/{slug}.webp` để tải ảnh bìa gốc từ máy chủ CDN.

---

## 4. Nhật ký Chuyển phiên (Session Logs & State Tracking)

### [2026-09-21] Phiên 1: Khởi tạo & Đánh giá Toàn diện
- Đọc và phân tích toàn bộ repository, tham chiếu [Darkrai9x/vbook-extensions](https://github.com/Darkrai9x/vbook-extensions.git).
- Khởi tạo file quản lý trạng thái `Memory.md`.

### [2026-09-21] Phiên 2: Tích hợp nguồn Truyện Sắc (`truyensac.buzz`)
- Phân tích kiến trúc Next.js và bóc tách REST API ngầm `https://api.truyensac.buzz`.
- Phát triển hoàn chỉnh 7 scripts cho extension `truyensac`.

### [2026-09-21] Phiên 3: Fix lỗi lấy Cover Truyện Sắc (v2)
- Sửa lỗi `resolveCover` và `detail.js` loại bỏ triệt để việc nhầm lẫn với `logo.webp` và `no-image.webp`.
- Bổ sung cơ chế auto resolve cover CDN qua `covers/{slug}.webp`.
- Bump version lên `v2`, build lại `plugin.zip`, cập nhật `plugin.json` gốc, commit & push lên `origin/main`.
