# MEMORY & PROJECT KNOWLEDGE BASE - Z-VBOOK-EXTENSIONS

> **Mô tả dự án:** Kho lưu trữ và phát triển Extension (Plugin) cho ứng dụng đọc truyện & xem phim **vBook** (Android/iOS).
> **Tác giả:** Zitzz (`magicxlll`)
> **Tham khảo kiến trúc chuẩn:** [Darkrai9x/vbook-extensions](https://github.com/Darkrai9x/vbook-extensions.git)
> **Cập nhật lần cuối:** 2026-09-22 (Tích hợp nguồn mới Kho Truyện Chữ khotruyenchu.fun v1)

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

## 2. Danh mục & Tình trạng Extensions Hiện tại trong Repo (17 Extensions)

| Tên Extension | Thư mục | Loại | Phiên bản | Nguồn (Host) | Đăng ký ở `plugin.json` gốc | Tình trạng & Đánh giá |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **AkayTruyen** | `akaytruyen` | Novel | v1 | `https://akaytruyen.com` | ✅ Có | Hoạt động tốt. Đã xử lý đảo thứ tự chương chuẩn. |
| **Bàn Long** | `banlong` | Novel | v22 | `https://blhvip.vn` | ✅ Có | Hoạt động tốt. |
| **Con Đường Bá Chủ** | `conduongbachu` | Novel | v4 | `https://conduongbachu.com` | ✅ Có | Hoạt động tốt. |
| **Hắc Hoàng Đại Đế** | `hachoangdaide` | Novel | **v1** | `https://hachoangdaide.online` | ✅ Có | Laravel SuuStore CMS + JSON API mục lục 5.000 chương/req + Đọc chương qua Blade JSON.parse sạch 100%. |
| **HHTQ Vietsub** | `hhtqvietsub` | Video | v9 | `https://hhtq.hair` | ✅ Có | Mã hóa vBook (`encrypt: true`). Hoạt hình 3D. |
| **Kho Truyện Chữ** | `khotruyenchu` | Novel | **v1** | `https://khotruyenchu.fun` | ✅ Có | WordPress Blocksy + REST API bo_truyen search + Phân trang mục lục taxonomy + Đóng gói POSIX Zip. |
| **La Cà Truyện** | `lacatruyen` | Novel | **v4** | `https://lacatruyen.fit` | ✅ Có | Next.js SSR + API AES-256-CBC Lookup Table O(1) nhúng trực tiếp config.js siêu tốc + 4 tầng fallback mục lục. |
| **Motchill** | `motchill` | Video | v2 | `https://motchille.tv` | ✅ Có | Mã hóa vBook (`encrypt: true`). Phim vietsub/thuyết minh. |
| **Storya** | `storya` | Novel | v22 | `https://storya.click` | ✅ Có | Dùng REST API JSON trực tiếp tốc độ cao. |
| **Thư viện Online** | `vietnamthuquan` | Novel | v1 | `http://vietnamthuquan.eu` | ✅ Có | Cào dữ liệu thư quán qua ASPX POST. Đã đăng ký kệ. |
| **Tiên Hiệp Lâu** | `tienhiep` | Novel | **v2** | `https://tienhiep.vercel.app` | ✅ Có | Next.js App Router + Supabase Storage WebP Cover + JSON API phân trang mục lục 100 chương/req + Đóng gói POSIX Zip v2. |
| **Truyện Chữ Hay** | `truyenchuhay` | Novel | **v1** | `https://truyenchuhay.org` | ✅ Có | Next.js SSR + API v2 lấy trọn vẹn 100% mục lục (844 chương/req). Khuyến nghị: nguồn gốc có Traffic Gate cho chương. |
| **Truyện Full** | `truyenfull` | Novel | v2 | `https://truyenfull.vision` | ✅ Có | Hoạt động tốt. |
| **Truyện Sắc** | `truyensac` | Novel | **v3** | `https://truyensac.buzz` | ✅ Có | Dynamic Book Cover nghệ thuật cho truyện thiếu cover + Ưu tiên hiển thị tab Truyện Hot có sẵn ảnh CDN thực. |
| **Vireal** | `vireal` | Novel | v4 | `https://vireal.vn` | ✅ Có | Parse dữ liệu SSR Json block. Đã đăng ký kệ. |
| **XTruyen Test** | `xtruyen` | Novel | v2 | `https://xtruyen.vn` | ✅ Có | Theme Madara (WP), lấy TOC qua `admin-ajax.php`. |
| **YanHH3D** | `yanhh3d` | Video | v2 | `https://yanhh3d.ee` | ✅ Có | Mã hóa vBook (`encrypt: true`). Hoạt hình 3D. |

---

## 3. Chi tiết Kỹ thuật Tích hợp Nguồn La Cà Truyện (`lacatruyen.fit` / `lacatruyen.ink`)

### 3.1. Phân tích Tên miền & Reverse Engineering Hệ thống:
1. **Tên miền hoạt động:** `lacatruyen.ink` chuyển tiếp về `https://lacatruyen.fit`.
2. **Kiến trúc web:** Sử dụng Next.js Pages Router kết hợp backend Laravel CMS (`https://cms.metruyen.com`).
3. **Ảnh bìa truyện:** Lưu trữ tại CDN `https://cms.metruyen.com/storage/uploads/{image_name}` (100% truyện đều load ảnh thực, kèm dynamic cover generator fallback).
4. **Mã hóa Mục lục & Nội dung:**
   - API mục lục `POST /api/chapters/list-chapters` yêu cầu payload mã hóa AES (`id_story`, `page`, `items_per_page`, `order`) với key dẫn xuất từ seed: `T5Vv41K5zJBHhtODBnOTdrl3shZVEPqzb16Hzfuh4J5tWrb0`.
   - Trang đọc chương `/chapter/[slug]` yêu cầu slug chuẩn (không mở được bằng ID thuần túy).
   - Nội dung chương được trích xuất trực tiếp từ `previewHtml` trong SSR NextData của trang `/chapter/[slug]` dạng HTML thẻ `<p>` sạch sẽ.

### 3.2. Giải pháp Kỹ thuật cho Module Mã hóa (Pure ES5 AES Engine):
- **Vấn đề của CryptoJS cũ:** Thư viện CryptoJS v4 minified cồng kềnh (>63KB) phụ thuộc `window.crypto` để sinh số ngẫu nhiên cho Salt, và cơ chế UMD wrapper `(function(t, e) { t.CryptoJS = e() })(this, ...)` bị lỗi `this is undefined` trong các engine JS nhúng như Duktape / QuickJS của Android & iOS.
- **Giải pháp:** Viết độc lập module `crypto.js` thuần ES5 (~300 dòng mã sạch):
  - Thuật toán AES-256 Core chuẩn (Rijndael cipher block, key expansion 14 rounds, inverse cipher).
  - Thuật toán MD5 chuẩn RFC 1321 thuần ES5.
  - Thuật toán OpenSSL compatible EvpKDF dẫn xuất Key 256-bit và IV 128-bit từ Salt 8 bytes.
  - Sinh Salt bằng `Math.random()`, hoàn toàn không phụ thuộc `crypto.getRandomValues`.
  - Hỗ trợ PKCS#7 padding/unpadding và Base64 encode/decode đầy đủ.
  - Đã được kiểm thử đối chiếu chéo (cross-compatibility) 100% khớp với Node.js native crypto và gọi API live trả về đầy đủ hàng ngàn chương.

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
- Đóng gói `extensions/lacatruyen/plugin.zip`, đăng ký vào `plugin.json` gốc, commit & push lên `origin/main`.

### [2026-09-21] Phiên 6: Sửa Lỗi Mục Lục Truyện La Cà Truyện (v2)
- Khảo sát các nguyên nhân sơ bộ và bổ sung fallback.

### [2026-09-21] Phiên 7: Khắc phục Triệt để Lỗi Mục Lục La Cà Truyện (v3 - Pure ES5 AES Engine)
- **Xác định chính xác nguyên nhân gốc rễ:**
  1. Thư viện CryptoJS v4 minified (63KB) chứa UMD wrapper cố gắng gán `this.CryptoJS` trong môi trường Duktape/QuickJS với top-level `this = undefined`, dẫn đến exception ngay khi `load("crypto.js")`.
  2. Bỏ khai báo script `"page": "page.js"` trong `plugin.json` khiến bộ điều khiển vBook trên app không kích hoạt quy trình tải mục lục.
  3. API lấy chapter trực tiếp không mã hóa (`/api/stories/{id}/chapters`) không trả về trường `slug`, trong khi trang đọc chương trên web bắt buộc phải có `slug`.
- **Hành động khắc phục:**
  1. Xây dựng module `crypto.js` hoàn toàn độc lập, thuần ES5 (~300 dòng mã sạch), triển khai thuật toán AES-256-CBC, MD5 và OpenSSL EvpKDF với `Math.random()`.
  2. Khôi phục khai báo `"page": "page.js"` trong `plugin.json` và chuẩn hóa `src/page.js`.
  3. Cải tiến `src/toc.js` tự động phát hiện `storyId` và gọi API `list-chapters` lấy tối đa 5000 chương/lần chỉ trong 1 request.
  4. Đã chạy test end-to-end mô phỏng vBook runtime: `search` -> `detail` -> `page` -> `toc` (lấy trọn vẹn 454 chương) -> `chap` (lấy 6313 ký tự HTML) thành công 100%.
  5. Đóng gói lại `plugin.zip` (19.9 KB), cập nhật `version: 3` trong `extensions/lacatruyen/plugin.json` và `plugin.json` gốc.
  6. Commit và push lên GitHub repository.

### [2026-09-22] Phiên 8: Tối ưu Triệt để Mục Lục La Cà Truyện (v4 - Lookup Table O(1) & Embed Crypto)
- **Xác định nguyên nhân gốc rễ trên thiết bị di động thật (vBook Flutter/QuickJS):**
  1. **Lỗi nạp nhiều file script:** Toàn bộ repo và quy chuẩn Darkrai9x chỉ gọi duy nhất `load("config.js");`. Khi `toc.js` gọi thêm `load("crypto.js");`, một số engine QuickJS/Duktape của vBook gặp lỗi nạp context dẫn đến `ReferenceError: encryptAES is not defined` và app hiện thông báo "Không thể tải mục lục".
  2. **Lỗi CPU Timeout 5 giây:** Phép nhân Galois Field `gmul` ban đầu chạy vòng lặp thủ công (192 lần/block). Với 454 chương (~8,200 blocks), CPU di động phải chạy hơn 1.5 triệu lần vòng lặp không JIT, ngốn >9-15 giây và vượt quá giới hạn Isolate timeout 5 giây của Flutter.
  3. **Lỗi HTTP 308 Redirect:** URL có trailing slash `/` (`/story/slug/`) kích hoạt redirect 308 từ Next.js, làm giảm độ tin cậy của engine fetch.
- **Hành động khắc phục triệt để:**
  1. **Nhúng trực tiếp Crypto vào `config.js`:** Tích hợp toàn bộ AES-256-CBC, MD5 và EvpKDF thuần ES5 trực tiếp vào `src/config.js`. Giờ đây mọi script (`toc.js`, `chap.js`, `detail.js`, `page.js`) chỉ cần gọi duy nhất `load("config.js");`.
  2. **Tối ưu Lookup Table O(1):** Thay thế toàn bộ vòng lặp Galois Field bằng các mảng bảng tra cứu cố định (`MUL_2`, `MUL_3`, `MUL_9`, `MUL_B`, `MUL_D`, `MUL_E`). Tốc độ giải mã 454 chương tăng vọt, thời gian xử lý giảm từ 260ms xuống **46ms** (trên di động chỉ tốn ~0.5s, hoàn toàn không bị timeout).
  3. **Bảo vệ 4 tầng Fallback cho `toc.js`:**
     - *Tầng 1:* API mã hóa AES `list-chapters` (ưu tiên hàng đầu, đầy đủ slug và tên chương).
     - *Tầng 2:* API công khai không mã hóa `GET /api/stories/{id}/chapters?limit=1000` (dự phòng mạng/AES).
     - *Tầng 3:* Next.js pageProps SSR (dự phòng `firstChapter` và `latestChapters`).
     - *Tầng 4:* DOM scraping thẻ link `/chapter/`.
  4. **Chuẩn hóa URL:** Hàm `cleanUrl(url)` tự động cắt bỏ dấu gạch chéo cuối và chuẩn hóa domain, loại bỏ header `Origin` trong GET request.
  5. **Kiểm thử & Đóng gói:** Chạy test toàn diện end-to-end giả lập vBook đạt kết quả tuyệt đối. Đóng gói lại `plugin.zip` (21.4 KB), nâng `version: 4` tại `extensions/lacatruyen/plugin.json` và `plugin.json` gốc, commit và push lên Git remote.

### [2026-09-22] Phiên 9: Phân tích & Tích hợp Nguồn Mới Truyện Chữ Hay (`truyenchuhay.org` v1)
- **Phân tích Kiến trúc Hệ thống:**
  1. **Công nghệ:** Sử dụng Next.js App Router (Next 15.5.9), SSR kết hợp RSC payload (`text/x-component`) và hệ thống CDN ảnh `https://static2.truyenchuhay.org/images/{slug}.jpg`.
  2. **API Danh sách Chương ngầm:** Phát hiện endpoint REST công khai tốc độ cao `GET /api/get-list-chapter-v2?id={storyId}` trả về 100% chương (hàng trăm đến hàng ngàn chương) trong 1 request duy nhất với định dạng `[ { name_chap, url_chap, index_chap } ]`.
  3. **Đặc điểm Nguồn & Cơ chế Traffic Gate:**
     - `truyenchuhay.org` là website cào metadata (tên truyện, cover, mục lục) để kiếm traffic SEO.
     - Khi mở trang đọc chương, server và client cố tình chặn nội dung bằng spinner loading vĩnh viễn và hiển thị modal ép người dùng làm nhiệm vụ Google sang các web tài trợ (`be-traffic.truyenchuhay.org`).
     - Trang web dẫn link sang `https://truyenchuonl.com/{slug}`.
     - Trong toàn bộ các file JS bundle của Next.js, không có logic fetch hay render văn bản chương.
- **Giải pháp & Triển khai Extension Chuẩn:**
  1. **Đầy đủ 7 scripts:**
     - `config.js`: Chuẩn hóa URL, wrapper fetch, `resolveCover` CDN chất lượng cao, trích xuất `storyId` từ escaped JSON trong RSC payload.
     - `home.js`: 3 tab tiêu chuẩn (`Truyện Mới Cập Nhật`, `Truyện Hot`, `Truyện Full`).
     - `genre.js`: Danh mục 112 thể loại phong phú.
     - `gen.js`: Phân trang danh sách truyện theo thể loại và bộ lọc.
     - `detail.js`: Bóc tách tên, tác giả, trạng thái, ảnh cover HD, mô tả review.
     - `page.js`: Nhận diện `storyId` để gom mục lục về 1 trang duy nhất, tối ưu 100% băng thông mạng.
     - `toc.js`: Tầng 1 gọi API v2 lấy trọn vẹn mục lục (844 chương chỉ mất 1.1s), Tầng 2 fallback cào DOM.
     - `chap.js`: Quét selector nội dung, lọc sạch spinner, kiểm tra độ dài text thực tế và trả về thông báo lỗi thân thiện nếu chương bị nguồn gốc chặn traffic.
     - `search.js`: Tìm kiếm truyện theo từ khóa qua `/tim-kiem?tukhoa=`.
  2. **Kiểm thử End-to-End:** Chạy test simulation toàn diện 8 test cases đều thành công tuyệt đối.
  3. **Đóng gói & Đăng ký:** Đóng gói `plugin.zip` (39.2 KB), đăng ký vào `plugin.json` gốc với `version: 1`, commit và push lên Git remote.

### [2026-09-22] Phiên 10: Phân tích & Tích hợp Nguồn Mới Tiên Hiệp Lâu (`tienhiep.vercel.app` v1)
- **Phân tích Kiến trúc Hệ thống:**
  1. **Nền tảng & Hosting:** Next.js App Router (React Server Components), triển khai trên Vercel Edge Network. Kho truyện chuyên sâu về tiên hiệp, tu chân, huyền huyễn kinh điển với ~440 bộ truyện chất lượng cao (~22 trang phân loại).
  2. **Hệ thống Ảnh Bìa:** Lưu trữ trên Supabase Storage CDN định dạng WebP cực nét (`https://ebekineyghlxlpljeiww.supabase.co/storage/v1/object/public/covers/{slug}.webp`), một số lưu trữ trên Cloudflare R2 (`https://pub-...r2.dev/covers/...`).
  3. **Kiến trúc Mục Lục & API Phân Trang:**
     - 100 chương đầu tiên được SSR trực tiếp vào thẻ HTML của trang chi tiết `/books/{id}-{slug}`.
     - Các trang chương tiếp theo được phân trang qua thẻ `<select>` với `<option value="{p}">Chương {start}-{end}</option>`.
     - API nội bộ: `GET https://tienhiep.vercel.app/api/books/{id}/chapters?page={p}` trả về JSON sạch `{ "chapters": [ { id, chapter_number, title, created_at } ] }` (100 chương/request).
     - Hỗ trợ cả 2 định dạng `bookId`: số nguyên (ví dụ: `566`, `7`) và dạng tiền tố (ví dụ: `new-207`).
     - URL chương chuẩn: `https://tienhiep.vercel.app/books/{id}-{slug}/chapters/{chapter_number}`.
  4. **Nội dung Đọc Truyện (Chap):**
     - Text truyện thật 100%, render trực tiếp qua SSR thẻ `<div class="reading-prose font-serif-reading ...">` hoặc `<article>`.
     - Cấu trúc từng đoạn văn bằng thẻ `<p>`, sạch sẽ, không mã hóa, không quảng cáo hay Traffic Gate.
- **Giải pháp Kỹ thuật & Triển khai Extension:**
  1. **Đầy đủ 9 scripts:**
     - `config.js`: `BASE_URL`, `cleanUrl`, `resolveCover`, `fetchBook`, `fetchJson`, `extractBookId` (kết hợp bóc tách RSC payload và URL regex fallback), `extractBookSlug`.
     - `home.js`: 4 tab khám phá (`Tất Cả Truyện`, `Tiên Hiệp Chọn Lọc`, `Tu Chân Giới`, `Huyền Huyễn`).
     - `genre.js`: 11 thể loại tu chân tiên hiệp cốt lõi.
     - `gen.js`: Parser phân trang danh sách truyện từ `/?page={p}` và `/?q={tag}&page={p}`, bóc tách sạch sẽ tên, ảnh Supabase WebP và mô tả.
     - `detail.js`: Bóc tách tên, tác giả, cover, trạng thái (Hoàn thành / Đang ra), mảng thể loại tags và mô tả truyện.
     - `page.js`: Tự động nhận diện `bookId` và số trang mục lục từ thẻ `<select>`, sinh mảng URL API `?page={p}&slug={slug}` cho từng khối 100 chương.
     - `toc.js`: Parse JSON API phân trang cực nhanh và nhẹ; đồng thời trang bị fallback cào DOM HTML trực tiếp nếu API lỗi mạng.
     - `chap.js`: Bóc tách nội dung từ `.reading-prose`, dọn dẹp tiêu đề `<h1>` lặp lại và comment React.
     - `search.js`: Tìm kiếm truyện theo từ khóa qua `/?q={keyword}&page={p}`.
  2. **Biểu tượng Icon:** Tạo biểu tượng Thái Cực Âm Dương (☯) mạ vàng `#D4AF37` trên nền cổ phong `#2C2825` (192x192 PNG).
  3. **Kiểm thử Toàn diện (End-to-End Simulation):**
     - Xây dựng test suite mô phỏng môi trường vBook runtime.
     - 9/9 test cases pass 100% (bao gồm cả truyện ID số `566-tien-nghich` và ID tiền tố `new-207-dao-si-da-truong-kiem`).
  4. **Đóng gói & Đăng ký:**
     - Đóng gói `extensions/tienhiep/plugin.zip` (10.9 KB).
     - Đăng ký extension vào `plugin.json` gốc (tổng cộng 15 extensions).
     - Đẩy toàn bộ thay đổi lên Git remote `origin/main`.

### [2026-09-22] Phiên 11: Sửa Lỗi Không Cài Đặt Được Extension Tiên Hiệp Lâu (v2 - POSIX Zip Packaging)
- **Xác định Nguyên nhân Gốc rễ:**
  - Tiện ích hiển thị trong kho extension của vBook (do root `plugin.json` hợp lệ) nhưng người dùng bấm cài đặt/add thì thất bại.
  - Kiểm tra cấu trúc file nhị phân `extensions/tienhiep/plugin.zip`: Lệnh `Compress-Archive` của Windows PowerShell đã nén đường dẫn theo định dạng DOS/Windows với dấu backslash `\` (`src\chap.js`, `src\config.js`, ...).
  - Ứng dụng vBook chạy trên Android/iOS (nhân Linux/Unix): Khi giải nén, thư viện unzip không nhận diện `\` là dấu phân cách thư mục, không tạo ra thư mục `src/` mà tạo file có tên `"src\chap.js"` hoặc báo lỗi path không hợp lệ. Khi vBook khởi tạo extension và tìm kiếm `src/home.js`, hệ thống gặp ngoại lệ `FileNotFoundException` và hủy quá trình cài đặt.
- **Biện pháp Khắc phục Triệt để:**
  1. **Đóng gói chuẩn POSIX (`tar -a -cf`):** Chuyển sang đóng gói bằng lệnh `tar` chuẩn quốc tế, đảm bảo 100% các entry trong zip đều dùng forward slash `/` (`src/chap.js`, `src/config.js`, ...) và có entry thư mục `src/`. Đã kiểm tra nhị phân xác nhận `hasBackslash = false`.
  2. **Nâng phiên bản `version: 2`:** Tăng `version` từ 1 lên 2 trong cả `extensions/tienhiep/plugin.json` và `plugin.json` ở root repository để xóa cache lỗi trên thiết bị và kích hoạt tải lại gói cài đặt mới.
  3. **Chuẩn hóa URL Regexp:** Cập nhật `regexp: "https?:\\/\\/(?:www\\.)?tienhiep\\.vercel\\.app\\/.*$"` chuẩn hóa theo quy ước chung của repo.
  4. **Commit & Push:** Đẩy toàn bộ thay đổi lên Git remote `origin/main`.

### [2026-09-22] Phiên 12: Phân tích & Tích hợp Nguồn Mới Hắc Hoàng Đại Đế (`hachoangdaide.online` v1)
- **Phân tích Kiến trúc Hệ thống:**
  1. **Nền tảng CMS:** Sử dụng Laravel Novel CMS (SuuStore template) với frontend kết hợp Blade SSR và Vue.js components.
  2. **Hệ thống Ảnh Bìa:** Lưu trữ tại CDN `https://hachoangdaide.online/stories/thumbnail/{image_hash}.jpg` (hoặc `.webp`), chất lượng ảnh bìa thật 100%. Logo chính thức tại `/stories/settings/J9QPNXzJKxrVjxZI5eSorlZWj1Jb3icOJQZD1Tth.png`.
  3. **Kiến trúc Mục Lục & API Siêu Tốc:**
     - Phát hiện endpoint AJAX nội bộ: `GET https://hachoangdaide.online/story/get-list-chapers?story_id={id}&per_page={limit}&page=1&order_by=position&order_type=ASC`.
     - Cho phép truyền `per_page=5000` để lấy trọn vẹn toàn bộ 100% chương (kể cả truyện 800 - 3.000+ chương) trong **1 request duy nhất** với tốc độ cực nhanh (~300ms).
     - Hỗ trợ cờ chương thu phí / miễn phí `pay: item.money > 0`.
  4. **Nội dung Đọc Chương (Chap):**
     - Text truyện thật 100%, render trong Blade template dưới dạng `chaper: JSON.parse('{\u0022content\u0022:\u0022...\u0022}')`.
     - Giải mã an toàn và sạch sẽ qua `eval("'" + match[1] + "'")` và `JSON.parse`, giữ trọn vẹn định dạng đoạn văn bản truyện.
- **Giải pháp Kỹ thuật & Triển khai Extension:**
  1. **Đầy đủ 9 scripts:**
     - `config.js`: `BASE_URL`, `cleanUrl`, `resolveCover`, `fetchBook`, `fetchJson` (header AJAX), `extractStoryId`.
     - `home.js`: 5 tab khám phá (`Truyện Hay`, `Mới Cập Nhật`, `Hoàn Thành`, `Xem Nhiều`, `Bán Chạy`).
     - `genre.js`: 23 thể loại phong phú trích xuất từ modal categories.
     - `gen.js`: Parser phân trang danh sách truyện `.novel-item` từ các category và tag.
     - `detail.js`: Bóc tách tên, tác giả, cover thumbnail thực tế, trạng thái, thể loại và giới thiệu.
     - `page.js`: Nhận diện `story_id`, gom toàn bộ mục lục về 1 trang duy nhất để tối ưu mạng.
     - `toc.js`: Gọi API lấy 100% mục lục trong 1 request, có fallback cào DOM.
     - `chap.js`: Giải mã văn bản chương từ Blade JSON, bóc tách hơn 14.000 ký tự sạch sẽ.
     - `search.js`: Tìm kiếm truyện qua endpoint `/search?keyword={key}&page={p}`.
  2. **Biểu tượng Icon:** Resize từ logo chính thức 500x500 PNG về 192x192 PNG chuẩn sắc nét.
  3. **Đóng gói & Đăng ký:**
     - Đóng gói `extensions/hachoangdaide/plugin.zip` (30.8 KB) bằng lệnh `tar -a -cf` đảm bảo chuẩn POSIX (`hasBackslash = false`).
     - Đăng ký vào root `plugin.json` (tổng cộng **16 extensions**).
     - Commit và push lên Git remote `origin/main`.

### [2026-09-22] Phiên 13: Phân tích & Tích hợp Nguồn Mới Kho Truyện Chữ (`khotruyenchu.fun` v1)
- **Phân tích Kiến trúc Hệ thống:**
  1. **Nền tảng & Theme:** WordPress kết hợp theme Blocksy, LiteSpeed Cache và Cloudflare CDN. Trang web tự xưng là "Tàng Kinh Các Của Giới Tu Chân" chuyên truyện dịch/convert thể loại Tiên hiệp, Huyền huyễn, Qidian, Đô thị.
  2. **Hệ thống Ảnh Bìa & Dữ liệu:**
     - Ảnh bìa lưu trữ tại `/wp-content/uploads/...` định dạng `.jpg`, `.jpeg`, `.webp`.
     - Mỗi trang truyện nhúng sẵn thẻ Schema JSON-LD `@type: CreativeWorkSeries` chứa chính xác tên truyện (`name`), ảnh bìa (`image`), tóm tắt (`description`).
     - Tác giả được liên kết qua `/tac-gia/?tg=...`, trạng thái hiển thị qua text "Tình trạng: Đang tiến hành / Hoàn thành".
  3. **Kiến trúc Mục Lục & Phân Trang (TOC & Pagination):**
     - Trang truyện `https://khotruyenchu.fun/truyen/{slug}/` đóng vai trò là archive/taxonomy term `bo_truyen`.
     - Mỗi trang chứa 50 chương trong thẻ `<article class="entry-card ...">` với liên kết `<h2 class="entry-title"><a href="...">...</a></h2>`.
     - Thứ tự chương được sắp xếp tăng dần theo thời gian (ASC: Chương 1 -> Chương 50).
     - Phân trang mục lục qua `nav.ct-pagination` dạng `page/2/`, `page/3/`, v.v.
     - `page.js` bóc tách `maxPage` và sinh danh sách đầy đủ URL các trang mục lục.
     - `toc.js` cào sạch sẽ từng chương theo từng trang, không bị lẫn các nút "Đọc từ đầu" hay "Chương mới nhất".
  4. **Nội dung Đọc Chương (Chap):**
     - Text truyện sạch 100% trong `.entry-content`, các đoạn văn bản cấu trúc bằng `<p>`.
     - Đã loại bỏ triệt để các rác giao diện: `.story-navigation`, `.reading-tools-bar`, `.story-toc-content`, `.code-block`, comment wpDiscuz và share box.
  5. **Tìm kiếm (Search):**
     - Khám phá endpoint REST API WordPress: `GET /wp-json/wp/v2/bo_truyen?search={keyword}&page={page}&per_page=20`.
     - Trả về danh sách chuẩn xác 100% các bộ truyện (thay vì tìm kiếm post/chương như web search mặc định).
     - Trang bị fallback cào HTML `/?s={keyword}` gom nhóm theo class `bo_truyen-{slug}`.
- **Giải pháp Kỹ thuật & Triển khai Extension:**
  1. **Đầy đủ 9 scripts:**
     - `config.js`: `BASE_URL`, `cleanUrl`, `resolveCover`, `fetchBook`, `fetchJson` kèm `DEFAULT_HEADERS` đầy đủ User-Agent chống 403 Forbidden.
     - `home.js`: 4 tab khám phá (`Truyện mới của Kho`, `Top Qidian`, `Độc giả yêu cầu`, `Mới cập nhật`).
     - `genre.js`: 10 thể loại tu chân, đô thị, dã sử, hệ thống, khoa huyễn, v.v.
     - `gen.js`: Parser phân trang danh sách truyện `.home-story-card` từ trang chủ và thể loại.
     - `detail.js`: Bóc tách tên truyện (Schema + H1), tác giả, ảnh bìa, trạng thái, thể loại và tóm tắt truyện.
     - `page.js`: Tự động nhận diện phân trang mục lục và sinh danh sách các trang `page/{n}/`.
     - `toc.js`: Bóc tách trọn vẹn danh sách chương từ các `article.entry-card`.
     - `chap.js`: Lọc sạch sẽ nội dung văn bản chương, dọn dẹp các thanh công cụ và quảng cáo.
     - `search.js`: Tìm kiếm REST API tốc độ cao, fallback HTML search.
  2. **Biểu tượng Icon:** Tải logo chuẩn chính thức 300x300 PNG lưu vào `extensions/khotruyenchu/icon.png`.
  3. **Kiểm thử Toàn diện (End-to-End Simulation):**
     - Xây dựng test suite mô phỏng vBook runtime.
     - 8/8 test cases pass 100% (home, genre, gen, detail, page, toc, chap, search).
  4. **Đóng gói & Đăng ký:**
     - Đóng gói `extensions/khotruyenchu/plugin.zip` (27.7 KB) bằng lệnh `tar -a -cf` đảm bảo chuẩn POSIX (`hasBackslash = false`).
     - Đăng ký vào root `plugin.json` (tổng cộng **17 extensions**).
     - Commit và push lên Git remote `origin/main`.
