# T3: RESEARCH STACK (TÙY VIÊN CHỨNG CỨ)

**Mục đích:** Tiến hành thu thập số liệu, bằng chứng chứng minh kèo và đánh giá mức độ uy tín của nguồn tin. Không research bừa phứa, phải nhóm dữ liệu theo từng bucket.
🤖 **Model khuyên dùng:** **Gemini 3.1 Pro** cho thu thập (T3a) nhờ Web search ngon bổ rẻ. **Claude Sonnet 4.6** (Chính ở T3b & Force Map) để chấm điểm Matrix Signal và vạch Chuỗi phụ thuộc. GPT-5.4 phụ trách check báo cáo tài chính/giá.
🔄 **Session Routing:** Chạy độc lập hoàn toàn trong **Session 2 (Gather evidence)**. Bắt đầu bằng việc DÁN lại Resolution sheet ở Session 1 sang. Kết thúc khi đã score hết Signal Matrix và vẽ xong các lực cản. Nhớ yêu cầu tóm tắt, copy kết quả rồi mới sang Session mới.

---
## PHẦN 1: HƯỚNG DẪN THỰC HIỆN (SOP)
1. **Kiểm tra chỉ định của T1:** Nếu T1 báo `Light Track`, bạn KHÔNG CẦN làm bảng Deep Research. Lướt web chừng 20-30 phút để điền mục 3.1. Nếu `Standard` hoặc `Deep`, bạn phải lập ma trận tín hiệu ở 3.2.
2. **Six-Bucket Scan (Quét diện rộng):** Bắt buộc làm. Mở 6 tab tìm kiếm, mỗi tab tập trung khảo sát 1 khía cạnh (Trang Official đối chiếu Github/Nội bộ đối chiếu Đối thủ cạnh tranh...). Điền 1 dòng thông tin đắt giá nhất vào mục tương ứng.
3. **Phân Tầng Nguồn (Source Tiering - Dành cho Deep):** Khi gặp 1 tín hiệu (Signal), CẤM tự tin thái quá. Phải ép nó vào 1 cấp bậc:
   - *Tier 1:* Thông báo/API chính thức cty, SEC Filings (Uy tín nhất).
   - *Tier 2:* Đối tác cloud, báo chí uy tín Major (Reuters, BBG).
   - *Tier 3:* Nguồn cộng đồng có log (Reddit, HN kèm link gốc).
   - *Tier 4:* Tin đồn X, Telegram (Không tin được nếu chỉ đứng 1 mình).
4. **Phản biện bắt buộc (Counter-view):** Tại 3.2, TỨC KHẮC viết 1 câu chống lại thông tin vừa tìm được. Phân tích xem tin đó có khả năng ngụy tạo / hiểu nhầm (Real Counter) tới mức nào.

---
## PHẦN 2: TEMPLATE ĐIỀN

### 3.1 LIGHT SCAN (Quét 6 Lăng Kính)
1. **Official Source (Nguồn chính quy báo sao?):** `[...]`
2. **Internal Execution (Có hint nào trên Github codebase/Jobs không?):** `[...]`
3. **External Systems (Hạ tầng, cloud liên quan chạy ổn không?):** `[...]`
4. **Competitors (Đối thủ có phả hơi thở/deadline sau gáy không?):** `[...]`
5. **Narrative/Social (Đám đông Reddit/X đang bàn tán thuyết âm mưu gì?):** `[...]`
6. **Related Markets (Các kèo liên kết trên Poly đang price thế nào?):** `[...]`

*(DỪNG LẠI NẾU BẠN CHỈ THUỘC TRACK `LIGHT`. Đi tiếp xuống dưới nếu là `STANDARD/DEEP`)*

### 3.2 DEEP RESEARCH MATRIX
*(Điền tín hiệu trọng tâm làm thay đổi cuộc chơi).*

| Bằng chứng (Signal) | Nguồn (Link) | Xếp Bậc Nguồn | Uy Tín (Reliability 1-5)* | Bám Sát Luật Sàn? (Relevance 1-5)* | Phản Biện (Counter-view 1 câu) | Đánh Giá Phản Biện | Gán Nhãn LR (Log-Ratio) |
|---|---|---|---|---|---|---|---|
| `[Tin nội bộ dời lịch về 4/5]` | `[Repo Github]` | `[Tier 2]` | `[3]` | `[5]` | `[Có thể chỉ là test branch?]` | `[Weak]` | `[Moderate Bearish]` |
| `[...]` | `[...]` | `[...]` | `[...]` | `[...]` | `[...]` | `[...]` | `[...]` |
| `[...]` | `[...]` | `[...]` | `[...]` | `[...]` | `[...]` | `[...]` | `[...]` |

**Bảng tra cứu Reliability (Uy Tín):** 5(Chính thống tuyệt đối), 4(Báo chí khổng lồ), 3(Nguồn lặp lại hợp lý), 2(Chút đồn thổi có hình), 1(Tin rác nặc danh).
**Bảng tra cứu Relevance (Bám sát):** 5(Xảy ra là dàn xếp xong tỷ số), 4(Đổi Pê-thật), 3(Ảnh hưởng narrative, chưa dính luật), 1(Nhiễu).

**Chất lượng phản biện chặn nhãn LR:** 
- Counter là "Strong", chỉ được nhãn LR ở mức `Weak / Moderate`. Cấm gán nhãn `Very Strong`.

### 3.3 FORCE MAP ANALYSIS (Phân tích 3 vòng lực lượng - Dành cho Kèo Tech/AI)
**Mục đích:** Xác định chính xác "Ai / Cái gì" có khả năng bóp cổ chủ thể (thường là sản phẩm / model) khiến nó ko kịp Release hoặc bị fail.

**BƯỚC 1: XÁC ĐỊNH CHỦ THỂ**
> Chủ thể của market này là: `[ Ví dụ: Public availability của GPT-5 trên ChatGPT ]`

**BƯỚC 2: QUÉT 3 VÒNG LỰC TÁC ĐỘNG ACTIVE**
*(Chỉ điền những Lực ĐANG CÓ TIN TỨC / CHUYỂN ĐỘNG thực tế. Đừng vẽ rồng vẽ rắn)*

**VÒNG 1 — NỘI SINH (Sức cản từ chính Công ty)**
| Lực lượng (VD: R&D, Safety, Naming) | Signal thực tế quan sát được | Hướng | Trễ | Reliability |
|---|---|---|---|---|
| `[ Training completion ]` | `[ Leak logs... ]` | `[ Bull ]` | `[ Xong ]`| `[ 3 ]` |
| `[...]` | `[...]` | `[...]` | `[...]` | `[...]` |

**VÒNG 2 — TRUNG GIAN (Sức cản từ Đối tác, ĐTCT, Cloud)**
| Lực lượng (VD: GPU Supply, Competitor, Cloud capacity) | Signal thực tế quan sát được | Hướng | Trễ | Reliability |
|---|---|---|---|---|
| `[...]` | `[...]` | `[...]` | `[...]` | `[...]` |

**VÒNG 3 — NGOẠI SINH (Quy định Pháp lý, Geopolitics)**
| Lực lượng (VD: EU Act, Macro, Board pressure) | Signal thực tế quan sát được | Hướng | Trễ | Reliability |
|---|---|---|---|---|
| `[...]` | `[...]` | `[...]` | `[...]` | `[...]` |

**BƯỚC 3: RÚT GỌN LỜI GIẢI (GATE FORCE & DEPENDENCIES)**
1. **Gate Force (Lực Tử Thần - Chặn là chết):** 
   - `[ Lực 1: ... ]` $\leftarrow$ Nó phụ thuộc vào việc: `[ ... ]`
   -> **Leading Indicator (Theo dõi ở T8):** `[ Theo dõi tin từ đâu? ... ]`
2. **Interaction Effects (Tác dụng phụ chéo):**
   - Sự kết hợp của `[ Lực A ]` + `[ Lực B ]` có thể khiến Công ty bị hoảng và dẫn tới: `[ Rush ra mắt lỗi / Delay 3 tháng ]`.
   -> *Ghi chú cảnh báo chéo này sang phần Cập nhật LR của T4.*
