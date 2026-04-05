# T5: RISK & SIZING (ĐỊNH LƯỢNG KÝ QUỸ TỒN VONG)

**Mục đích:** Không sập tiệm. Ngay cả khi bạn trade bằng $P_2$ đúng đắn, tỷ lệ phá sản vẫn là 100% nếu bạn "ăn rùa đánh to, thua đâm thêm" hoặc nhồi All-in vào 1 hệ sinh thái.
🤖 **Model khuyên dùng:** **GPT-5.4 Thinking** (Chính) để chạy toán Sizing/Kelly/Position Matrix.
🔄 **Session Routing:** Dùng chung thead với T4 và T6 trong **Session 3 (Price and decide)**. Đoạn thiết kế Nút Tử Thần Kill Switch có thể nhờ Claude ở T6 gõ giùm cho chặt.

---
## PHẦN 1: HƯỚNG DẪN THỰC HIỆN (SOP)
1. **Lắp Tham Số (Matrix):** Tham chiếu vào Edge (từ T4) và Độ tự tin Rule (từ T2) để quyết định số Units nên đánh. (Edge >20% & Rule Rõ High $\rightarrow$ Tối đa 3 Units).
2. **Chiết Khấu "RESTRICTED":** Bạn phải xem lại T0. Nếu cửa ải T0 báo `RESTRICTED` (thiếu 1 điều kiện tâm lý), bạn CẮN RĂNG BẮT BUỘC cưa rưỡi tổng số Unit vừa tính ra trên Matrix, không được cự cãi.
3. **Sát hạch Hard Caps (Đại Cấm Kỵ):**
   - Rà soát vị thế cá nhân có $>3$ Units / $3\%$ quỹ tổng lực không.
   - Quét qua danh mục, nhặt những kèo "Chung rọ" (Chung công ty, chung cơ sở hạ tầng, chung biến vĩ mô). Gộp chúng lại xem Tổng Units trong "Rọ" có vượt quá 8% Cấm Kỵ chưa. Lố $\rightarrow$ Giảm size kèo chuẩn bị đánh.
4. **Cắm chốt Kill Switch (Công tắc tử thần):** Tự viết ra 2 tình thế (Trigger) TỒI TỆ phải cắt bỏ 50% hoặc 100% hàng mà không cần ngẫm lại.

---
## PHẦN 2: TEMPLATE ĐIỀN

**5.1 THAM SỐ CƠ BẢN TÀI KHOẢN:**
- Định nghĩa 1 Unit hiện tại = `$ [ ]`
- Chiều cược (Bet Side): `[ BUY YES / BUY NO ]`

**5.2 SIZE MATRIX MATCHING:**
- Edge thật (`[ ] %`) + Res Confi (`[ High/Med/Low ]`) $\rightarrow$ Size thô đề xuất: `[ ]` Units.
- Kiểm duyệt Cổng T0 (`[ FULL / RESTRICTED ]`) $\rightarrow$ Size qua Trạm: `[ ]` Units.
- Bị hạn chế Solo-mode (chưa qua đập Peer-challenge với ai)? Nếu có, MAX = 2 Units.
- **SIZE KẾT CỤC DẠI DIỆN VÀO LỆNH:** `[   ] UNITS = $ [   ]`

**5.3 HARD CAPS LIMIT REVIEW (Bắt buộc Tick đủ):**
- [ ] 1. Kèo này bé hơn $\leq$ 3 Units (và $\leq 3\%$ Bankroll chung)?
- [ ] 2. Tổng khối lượng Lệnh Đang Mở chung toàn TK vẫn đang $\leq 15\%$?
- [ ] 3. Bucket tương quan (Rọ: `[...]`). Cả mâm Rọ này gộp kèo mới vào vẫn $\leq 8\%$?

**5.4 CÁC NÚT TỬ THẦN (KILL SWITCHES):**
> *Nếu những sự kiện này vả vào mặt tôi ra ngoài dự kiến, tôi cam kết THOÁT NGAY LÀ THOÁT, không được nấn ná:*

| # | Trigger Giật Chốt (Sự kiện gì) | Hành động (Cắt 100% / Cắt 50%) | Thời hạn phản xạ |
|---|---|---|---|
| 1 | `[Sàn update đính chính lại Rule đi ngược lợi thế]` | `[Thoát 100%]` | `[Khi vừa thấy]` |
| 2 | `[...]` | `[...]` | `[...]` |
| 3 | `[...]` | `[...]` | `[...]` |
