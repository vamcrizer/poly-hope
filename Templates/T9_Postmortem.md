# T9: POSTMORTEM (GIẢI PHẪU & RÈN HỆ THỐNG XUNG)

**Mục đích:** Ván cược xong rồi, Market đã đóng sổ, UMA phán định kết quả định mệnh. P&L có thể Lãi hoặc Lỗ cháy ngập. Mặc kệ tiền nong! Đây là Bước Nuôi Dưỡng "Nhà Cái Trong Bạn" (Calibration Feedback Loop). Một kèo thắng vì rùa mù là kèo 0 điểm. Một kèo lỗ cháy đen nhưng Sizing khét lẹt và biết cắt đúng Rule là kèo Mười Điểm.
🤖 **Model khuyên dùng:** **Claude Sonnet 4.6** cho gạch đầu dòng mổ xẻ Review Taxonomy. **GPT-5.4 Thinking** tính Brier Score và calibration stats.
🔄 **Session Routing:** Mở **Session mới hoàn toàn** để thẩm định ván cờ, chốt sổ kinh nghiệm. Tránh dính dấp quá khứ trade để có góc nhìn khách quan của người phán xử.

---
## PHẦN 1: HƯỚNG DẪN THỰC HIỆN (SOP)
1. **Khám Nghiệm Tính Chất Chết Chóc:** Nhận kết quả từ Sàn. Chia nó thành 2 mảng: FACT ngoài đời đúng ko? VÀ SÀN TRẢ ĐÚNG THEO RULE T2 MÌNH ĐẾM KO?
2. **Cân Đo Vạch Brier:** Áp thẳng máy dò **Brier Score = $(P_{\text{Dự Đoán Quả Cuối Cùng}} - Outcome)^{2}$**. $Outcome$ là (1) nếu Yes, (0) nếu No. Vài điểm Brier sẽ vạch trần bạn là thằng Chó Ngáp Phải Ruồi (hay Underconfident / Overconfident).
3. **Phân Xưởng Lỗi Gốc (Failure Taxonomy):** Nếu rạch bụng mình nôn ra máu, chết ở đâu? Dán ngay cái Max Họa vào:
   - Lỗi Khờ (Fact): Đoán ngu hiện thực.
   - Lỗi Đui (Rule): T2 đọc hợp đồng ko thủng, bị úp sọt pháp lý UMA ngu ngục.
   - Lỗi Lệch Nhịp (Timing): Sự đúng nhưng sai rớt đĩa Deadlines hạn chót.
   - Lỗi Găm Gộp (Sizing): Nhồi Volume to hơn não trong 1 Rọ Bucket.
   - Lỗi Ham Hố (Discipline): Nuốt lưỡi ở Kill Switch T5, hoặc tự đái vào chân ở T0 và T6.
   - Lỗi Chiếu Trì (Manipulation): Đáng tiếc do MMs wash.
4. **Viết Bia Mộ Truyền Kếp (Meta-Review Tịnh Tiến):** Gút thắt cuối. Tổng hòa bài học này nhổ neo thay đổi Rule nào cho Bản Kế Hoạch 50 Kèo tới?

---
## PHẦN 2: TEMPLATE ĐIỀN

**9.1 BỘ CHỨNG NHẬN ĐÓNG SỔ NẰM GIƯỜNG :**
- Lịch Trình Rút Quân / Bị Tiêu Vong: `[  /  / 202... ]`
- Price Thoát Cuối Cùng $\rightarrow$ P&L Cục Hàng: `[ Lời/Thua $ ... ]`
- Dấu Bùa Phán Xét của Polymarket: `[ Cửa YES / Cửa NO vinh quang ]`

**9.2 KHÁM BỆNH BÓC MẺ DỰ BÁO:**
- Thesis Dự Báo CHUẨN MÔ TẢ ĐỜI THỰC không? `[ Y / N ]`
- Thesis Dự Báo ĐỌC CHUẨN XÁC LUẬT T2 CỦA THỊ TRƯỜNG không? `[ Y / N ]`
- Đỉnh $P_2$ Cuối Cùng Đoán Trúng Đích Trước Giờ Phán Sét: `[ ... ] % `
- **Điểm Chỉ Số Brier Score Nhận Về Thân:** `[ (P - Hậu Cục)^2 ] = [ ... / Max 1.0 ]`

**9.3 VẠCH LỖI ÔNG TÂY (CHỌN MAIN ERROR):**
> *(Gạch bỏ các Lỗi không liên quan, khoăn vùng ĐIỂM CHẾT nếu LỖ.)*
> ( ) LỖI SỰ THẬT (Fact) | ( ) LỖI MÙ LUẬT (Rule) | ( ) LỖI ĐÁO HẠN (Timing)
> ( ) LỖI VẢ BỤNG VỐN (Sizing) | ( ) LỖI ĐẠP KỶ LUẬT (Discipline) | ( ) THA MẠNG MMs

**9.4 LỜI THỀ NHÌN LẠI VÀ CHỈNH HỆ THỐNG:**
- **Nhát Dao Rút Tim:** "Nếu Chúa cho tao quay ngược lại đống tã này 2 tuần trước, tao sẽ gạch mặt và uốn cái gì KHÁC ĐI?"
  $\rightarrow$ `[ Trả lời trung thực vào mặt mình: ... ]`
- **Bơm Rule Mới Vào Khung Meta-Review Tiếp Theo:** "Từ đây về sau, ta cấm Tiệt lặp lại bằng Rule mới ghi rõ là: ..."
  $\rightarrow$ `[ Viết lệnh cấm vệ binh mới: ... ]`

---
> ***KẾT THÚC VÒNG ĐỜI 1 KÈO TRADING THEO PRO-SYSTEM. BẠN CÒN SỐNG, TỨC LÀ BẠN MẠNH LÊN.***
