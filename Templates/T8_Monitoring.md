# T8: MONITORING & MANIPULATION (TUẦN TRA VÀ CHỐNG THAO TÚNG)

**Mục đích:** Giữ nhịp đập trái tim của kèo không bị nguội. Nhưng quan trọng hơn, ngăn cản bạn "bay theo" khi các con buôn Market Maker bơm xả giá (Manipulation) mà không mang lại Tín hiệu gốc nào mới.
🤖 **Model khuyên dùng:** **Gemini 3.1 Pro** cho monitoring real-time + doc/chart. Khi gặp tin đột biến, quăng sang **Claude Sonnet 4.6** để thẩm định Update P2.
🔄 **Session Routing:** Mỗi ngày mở riêng lẻ 1 nhánh làm **Session 4 (Monitoring)** riêng. Dán P2 cũ và Kill Switches làm gốc mồi. Cấm xài chung luồng quá dài ngày.

---
## PHẦN 1: HƯỚNG DẪN THỰC HIỆN (SOP)
1. **Thiếp Lập Khung Phân Rã Bắt Bắt (Cadence):** Tuân thủ tuyệt đối khung dò báo động:
   - *Kèo gắt (Đáo < 3 ngày):* Đi dò 3-4 lần/ngày. Rà Main Source + Micro Market liên quan.
   - *Kèo dịu (Đáo 3-14 ngày):* 1-2 lần/ngày.
   - *Kèo ủ (Đáo > 14 ngày):* 1 lần/ngày vào cuối chiều + Giao mạng cho Alert Tool.
2. **Khoa Phân Tầng Tín Hiệu Nhận Về:** Khi đi tuần, đọc được 1 tin. Đừng vội tính $P_2$, hãy phân Nhãn nó trước:
   - **Thesis-confirming:** Báo hiệu Thơm $\rightarrow$ Update LR bình thường, nhưng TÌM MỎI MẮT XEM CÓ TỤI NÀO ĐÁNH ĐÍT PHẢN BÁC KO.
   - **Thesis-damaging:** NGUY CẤP $\rightarrow$ Update LR. Nếu ăn 2 Gậy Damaging liên kê, RÚT LẠI BOARD LÀM DEEP REVIEW TOÀN PHIÊN.
   - **Noise (Rác):** Bỏ qua mỉm cười.
   - **Unknown-important (Sặc mùi biến nhưng đéo hiểu):** DỪNG TOÀN BỘ. Đặt trạm chờ thông cống. Nghiêm cấm Update mông lung.
3. **Mệnh Lệnh "MANIPULATION PROTOCOL":**
   - Giá tự nhiên dội xả hoặc bơm láo thốc > 10 điểm mà KHÔNG CÓ TIN GÌ MỚI, Volume dội nhói lên rồi lịm tắt. Spread há hốc.
   - HÀNH ĐỘNG: Coi đây là trò Bịp của Market (Microstructure event). KHÔNG CHASE GIÁ THEO LŨ LỢN. NGỒI YÊN 60 PHÚT. 
   - Đánh giá lại $P_2$: Nếu source cũ không suy chuyển, mà giá nay lại THƠM hơn do lũ lừa chẻ mâm $\rightarrow$ Táng thêm Limit để ôm chênh lệch Margin.

---
## PHẦN 2: TEMPLATE ĐIỀN

**8.1 CADENCE TUẦN TRA & LƯỚI QUÉT DỮ LIỆU:**
- Tần suất ép bản thân theo: `[  x / ngày ]`
- Các luồng (Streams) Focus chính tả:
  1. `[ Nguồn chính Main Source ]`
  2. `[ ... ]`
  3. `[ ... ]`

- **SĂN "LEADING INDICATORS" (Dấu hiệu dẫn dắt từ Force Map T3):**
  *(Các dấu hiệu báo trước được phát hiện từ Chuỗi Phụ Thuộc Gate Force)*
  1. `[Chỉ báo 1: Theo dõi web TSMC capex / AWS instance avai...]`
  2. `[Chỉ báo 2: ... ]`

**8.2 SỔTẠP GHI BẾN DOANH DẠI (UPDATE LOG):**
*(Ghi từng dòng MỖI KHI CÓ TIN ĐÁNG GIÁ KHẤU TRỪ VÀ TRẢ THƯỞNG)*

| Ngày / Cột mốc | Sự kiện thọc mạch (Tín hiệu) | Phân tầng (Confirm / Damaging / Rác) | Hệ Số Cập Nhật (LR) | Lượng P2 Mới Đắp | Hành động Phím Enter |
|---|---|---|---|---|---|
| `[ 30/3 9AM ]` | `[ Twitter cty hé lộ Logo Beta ]` | `[ Confirm (yếu) ]` | `[ +0.22 ]` | `[ 65% \rightarrow 69% ]` | `[ Khệnh khạng xem kèo khác, ko đảo ]` |
| `[ ... ]` | `[ ... ]` | `[ ... ]` | `[ ... ]` | `[ ... ]` | `[ ... ]` |
| `[ ... ]` | `[ ... ]` | `[ ... ]` | `[ ... ]` | `[ ... ]` | `[ ... ]` |

*(Note Bút Đỏ: Nhớ luật Update Bắt Buộc - Đã dính vào Rule Sàn đổi giọng bẻ cong câu chữ $\rightarrow$ RESET LẶP TỪ BƯỚC T2 LẠI TỪ ĐẦU!)*
