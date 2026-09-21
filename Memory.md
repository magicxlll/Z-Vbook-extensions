# MEMORY & PROJECT KNOWLEDGE BASE - Z-VBOOK-EXTENSIONS

> **Mô tả dự án:** Kho lưu trữ và phát triển Extension (Plugin) cho ứng dụng đọc truyện & xem phim **vBook** (Android/iOS).
> **Tác giả:** Zitzz (`magicxlll`)
> **Tham khảo kiến trúc chuẩn:** [Darkrai9x/vbook-extensions](https://github.com/Darkrai9x/vbook-extensions.git)
> **Cập nhật lần cuối:** 2026-09-21 (Tích hợp thành công extension La Cà Truyện lacatruyen.fit / lacatruyen.ink v1)

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

## 2. Danh mục & Tình trạng Extensions Hiện tại trong Repo (13 Extensions)

| Tên Extension | Thư mục | Loại | Phiên bản | Nguồn (Host) | Đăng ký ở `plugin.json` gốc | Tình trạng & Đánh giá |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **AkayTruyen** | `akaytruyen` | Novel | v1 | `https://akaytruyen.com` | ✅ Có | Hoạt động tốt. Đã xử lý đảo thứ tự chương chuẩn. |
| **Bàn Long** | `banlong` | Novel | v22 | `https://blhvip.vn` | ✅ Có | Có fallback WebView. |
| **Con Đường Bá Chủ** | `conduongbachu` | Novel | v4 | `https://conduongbachu.com` | ✅ Có | Chuyên biệt 3752+ chương, sort số học, lọc audio player TTS và quảng cáo tốt. |
| **HHTQ Vietsub** | `hhtqvietsub` | Video | v9 | `https://hhtq.hair` | ✅ Có | Mã hóa vBook (`encrypt: true`). Xem Donghua Trung Quốc. |
| **La Cà Truyện** | `lacatruyen` | Novel | **v2** | `https://lacatruyen.fit` | ✅ Có | Fix lỗi mục lục: Khắc phục lỗi PRNG `window.crypto` trong QuickJS bằng Math.random fallback, bỏ qua `page.js` đi thẳng vào `toc.js`. |
| **Motchill** | `motchill` | Video | v2 | `https://motchille.tv` | ✅ Có | Mã hóa vBook (`encrypt: true`). Phim vietsub/thuyết minh. |
| **Storya** | `storya` | Novel | v22 | `https://storya.click` | ✅ Có | Dùng REST API JSON trực tiếp tốc độ cao. |
| **Thư viện Online** | `vietnamthuquan` | Novel | v1 | `http://vietnamthuquan.eu` | ✅ Có | Cào dữ liệu thư quán qua ASPX POST. Đã đăng ký kệ. |
| **Truyện Full** | `truyenfull` | Novel | v2 | `https://truyenfull.vision` | ✅ Có | Hoạt động tốt. |
| **Truyện Sắc** | `truyensac` | Novel | **v3** | `https://truyensac.buzz` | ✅ Có | Dynamic Book Cover nghệ thuật cho truyện thiếu cover + Ưu tiên hiển thị tab Truyện Hot có sẵn ảnh CDN thực. |
| **Vireal** | `vireal` | Novel | v4 | `https://vireal.vn` | ✅ Có | Parse dữ liệu SSR Json block. Đã đăng ký kệ. |
| **XTruyen Test** | `xtruyen` | Novel | v2 | `https://xtruyen.vn` | ✅ Có | Theme Madara (WP), lấy TOC qua `admin-ajax.php`. |
| **YanHH3D** | `yanhh3d` | Video | v2 | `https://yanhh3d.ee` | ✅ Có | Mã hóa vBook (`encrypt: true`). Hoạt hình 3D. |

---

## 3. Chi tiết Kỹ thuật Tích hợp Nguồn La Cà Truyện (`lacatruyen.fit` / `lacatruyen.ink`)

### 3.1. Phân tích Tên miền & Reverse Engineering Hệ thống:
1. **Tên miền hoạt động:** `lacatruyen.ink` là tên miền trước đó (hiện DNS không trỏ hoặc redirect). Hệ thống chính thức đang hoạt động tại `https://lacatruyen.fit`.
2. **Kiến trúc web:** Sử dụng Next.js Pages Router kết hợp backend Laravel CMS (`https://cms.metruyen.com`).
3. **Ảnh bìa truyện:** Lưu trữ tại CDN `https://cms.metruyen.com/storage/uploads/{image_name}` (100% truyện đều load ảnh thực, kèm dynamic cover generator fallback).
4. **Mã hóa Mục lục & Nội dung:**
   - API mục lục `POST /api/chapters/list-chapters` yêu cầu payload mã hóa AES (`id_story`, `page`, `items_per_page`, `order`) với key sinh động từ seed `T5Hr41U5jKTTrtUOXdYZnyx3wjZEKUoxv16Clwwu4D5zIbd0-q9sdfh`.
   - Extension tích hợp module `crypto.js` đóng gói gọn gàng CryptoJS AES để thực hiện mã hóa request và giải mã danh sách toàn bộ chương chuẩn xác kèm `slug`.
   - Nội dung chương được trích xuất trực tiếp từ `previewHtml` trong SSR NextData của trang `/chapter/[slug]` dạng HTML thẻ `<p>` sạch sẽ.

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

### [2026-09-21] Phiên 4: Triển khai Dynamic Book Cover & Tối ưu Tab Hot (v3)
- Phân tích sâu nguyên nhân CDN 404 cho truyện mới và cơ chế fallback parchment của vBook.
- Triển khai bộ sinh ảnh bìa bìa sách nghệ thuật (dynamic styled placeholder) theo tên truyện và mã màu phân loại.
- Sắp xếp lại thứ tự tab trên trang chủ (`Truyện Hot` lên đầu).
- Đóng gói `plugin.zip`, cập nhật metadata `v3` trong `plugin.json` extension và root, commit & push lên Git remote.

### [2026-09-21] Phiên 5: Tích hợp Nguồn Mới La Cà Truyện (`lacatruyen.fit` / `lacatruyen.ink` v1)
- Rà quét DNS và phát hiện domain đích hoạt động `lacatruyen.fit`.
- Bóc tách toàn bộ API Next.js SSR, CMS storage image URL và cơ chế mã hóa AES của La Cà Truyện.
- Tích hợp module `crypto.js` giải mã mục lục `list-chapters`, bóc tách nội dung chương qua `previewHtml`.
- Xây dựng đầy đủ 9 scripts (`home.js`, `genre.js` với 24 thể loại, `gen.js`, `detail.js`, `toc.js`, `chap.js`, `search.js`, `page.js`, `crypto.js`).
- Kiểm thử toàn diện 7 luồng hoạt động 100% thành công.
- Đóng gói `extensions/lacatruyen/plugin.zip`, đăng ký vào `plugin.json` gốc, commit & push lên `origin/main`.

### [2026-09-21] Phiên 6: Sửa Lỗi Mục Lục Truyện La Cà Truyện (v2)
- Phát hiện nguyên nhân gốc rễ: `CryptoJS.lib.WordArray.random` cố gắng truy cập `window.crypto` (vốn không tồn tại trong môi trường nhúng QuickJS / Duktape của vBook), dẫn đến ném ngoại lệ khi mã hóa payload `list-chapters`.
- Khắc phục bằng cách override `CryptoJS.lib.WordArray.random` sử dụng `Math.random` an toàn và tương thích 100% với engine JS di động.
- Bỏ qua routing trung gian `page.js`, chuyển thẳng router `plugin.json` vào `toc.js` để vBook nạp toàn bộ mục lục ngay lập tức.
- Bổ sung cơ chế fallback bóc tách danh sách chương từ props SSR `firstChapter` và `latestChapters`.
- Nâng version lên `v2`, đóng gói lại `plugin.zip`, cập nhật `plugin.json` gốc, commit & push lên `origin/main`.
