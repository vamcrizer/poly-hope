# T7: EXECUTION (DUYỆT BINH XUỐNG TIỀN)

**Mục đích:** Nghi thức ký nháy lần cuối. Đảm bảo bạn không phiêu lưu bằng cách click bừa hoặc đánh lệnh ẩu do quên kiểm duyệt. Spread (khoảng cách bid-ask) trên Poly có thể giết bạn ngay giây đầu tiên nếu đánh Market order bừa bãi.
🤖 **Model khuyên dùng:** Không cần Model. Execution là lúc Tự bạn nhúng tay vào sàn. Mở bảng tính Excel hoặc tick checkbox.

---
## PHẦN 1: HƯỚNG DẪN THỰC HIỆN (SOP)
1. **Duyệt qua 12 Đầu Danh Mục Bắt Buộc (Pre-flight Checklist):** Hãy đọc lại file template của bạn, đánh dấu tick cho đến hết 12 mảng lưới. KHÔNG tick lụi, bạn phải tự kiểm. CHỈ CẦN 1 Ô CHƯA TICK $\rightarrow$ NHẤT QUYẾT BỎ, ĐÓNG MÁY!
2. **Setup Cảnh báo (Alerts):** Cắm sẵn notification cho URL Event, Keyword trên trang web, Email từ Nguồn.
3. **Phân rã đơn hàng lớn (Chunking):** Nếu Size của bạn béo $ \geq 2 $ Units (Thanh khoản mỏng), đừng ném cục xúc một cục Market Order. Hãy xé nhỏ vào $\frac{1}{2}$ Unit, cài báo thức 2h sau check chart, vào tiếp Limit order để cắn Spread được êm ái hơn và giữ quyền "hủy đổ bộ" nếu tin bay ập đến.
4. **Điền Biên lai xuất trận:** Điền nốt phần 7.2 dưới đây để gieo hạt giống Review cho T8 và T9.

---
## PHẦN 2: TEMPLATE ĐIỀN

**7.1 PRE-FLIGHT CHECKLIST (TRƯỚC KHI ENTER ORDER):**
| # | Tác vụ | Xác nhận (Tick \checkmark) |
|---|---|---|
| 1 | Cổng T0 báo bình thường (Full/Restricted)? | `[ ]` |
| 2 | Kèo đã lọc T1 đạt $\ge 45$ điểm? | `[ ]` |
| 3 | T2 (Sát hạch hợp đồng) hoàn chỉnh bẫy lỗi? | `[ ]` |
| 4 | $P_2$ đã cập nhật đong đếm toán học? | `[ ]` |
| 5 | Biên chênh lệch (Cửa ăn - Edge) $\ge 3\%$ sau Phí? | `[ ]` |
| 6 | Size chuẩn ko vi phạm Hard cap? | `[ ]` |
| 7 | Túi Rủi Ro Tương quan (Bucket) còn Slot trống? | `[ ]` |
| 8 | Bệ Phóng Nút Tử Thần (Kill Switch) lập xong? | `[ ]` |
| 9 | Lời nguyền Quỷ Dữ (Devil's Advocate) gõ văn bản xong? | `[ ]` |
| 10| Câu Thề Thoát Hàng (Commitment) đã thề và chốt? | `[ ]` |
| 11| Nhật Ký (Journal) này đang được mở ra gõ? | `[ ]` |
| 12| Chuông báo Alert keywords đã cài lên máy chưa? | `[ ]` |

*(Note mỏng: NẾU BẠN CHƯA TICK XONG, ĐỪNG QUAN TÂM ĐẾN NÚT MUA CỦA POLYMARKET!)*

**7.2 BIÊN BẢN VÀO LỆNH (ENTRY RECEIPT):**
- **Ngày/Giờ xuất kho:** `[ ... : ... ]`
- **Sàn/Kèo ID (Mã Vạch):** `[ ... ]`
- **Kiểu đạn (Order Type):** `[ Limit / Market ]`
- **Vol thực ăn (Actual Size Out):** `$ [ ... ] / [ ... ] Units `
- **Chênh lệch Bid-Ask chịu đựng (Spread):** `[ ... ] % `
- **Vị trí Cắt dây đứt phanh (Kill Switch nháy lại):** `[ ... ]`
