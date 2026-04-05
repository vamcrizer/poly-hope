# T2: RESOLUTION AUDIT (KIỂM TOÁN HỢP ĐỒNG TRẢ THƯỞNG)

**Mục đích:** Bước quan trọng nhất hệ thống! "Reality vs Resolution". Đảm bảo bạn hiểu chính xác TỪNG CHỮ của điều khoản đóng sổ, tìm ra các kẽ hở sàn có thể "lật lọng".
🤖 **Model khuyên dùng:** **Claude Sonnet 4.6** (Chính) để tuân thủ luật và bóc tách edge cases. **GPT-5.4 Thinking** (Phụ) để cross-check.
🔄 **Session Routing:** Nằm trong **Session 1 (Lock the rules)** cùng với T1. Hoàn thành thì COPY kết quả ra ngoài để sang Session 2. Tuyệt đối không dán báo chí Research vào đây để tránh thiên kiến.

---
## PHẦN 1: HƯỚNG DẪN THỰC HIỆN (SOP)
1. **Copy nguyên văn:** Vào mục "Rules" của Polymarket, copy tuyệt đối 100% nội dung (kể cả dấu chấm phẩy) dán vào 2.1.
2. **Liệt kê Metadata:** Click vào Source link (ví dụ link báo Reuters, link Twitter của dự án). Đảm bảo source này là khách quan. Viết ghi chú về cơ chế (Dispute DVM UMA).
3. **Phân rã nhị phân:** Ép nội dung Rule thành đúng 2 câu có cấu trúc NẾU... THÌ. Nếu bạn không gói rọn được thành 2 câu này, chứng tỏ Rule sàn đang quá mập mờ $\rightarrow$ Hạ level tự tin xuống Low rủi ro.
4. **Vẽ bảng Tình huống bẫy (Edge Cases):** Ngồi nghĩ xem: "Thị trường thực tế báo Yes rành rành đấy, nhưng chiếu theo luật của Sàn thì bị tính là No, đó là trường hợp nào?". (VD: Polymarket yêu cầu 'bản Release Official', mà dự án lại tung bản 'Beta Release' $\rightarrow$ Tưởng Yes nhưng ép luật thì No).
5. **Three Sentences Test:** Đóng vai một luật sư, đứng lên hùng biện tóm tắt lại kèo này qua 3 câu ngắn gọn (bước cuối phần 2). Không viết được 3 câu này, CẤM SANG TIẾP T3.

---
## PHẦN 2: TEMPLATE ĐIỀN

**2.1 TRÍCH NGUYÊN VĂN (Copy/Paste):**
> *(Dán Rule Polymarket vào đây)*

**2.2 METADATA:**
- Nguồn Settle (Primary): `[Link]`
- Nguồn Phụ (nếu Main sập): `[Link hoặc Không có]`
- Ngày giờ kết liễu dự kiến (Cutoff): `[Ví dụ: 11:59PM ET, Nov 3]`
- Rủi ro bị Challenge/Dispute: `[Cao/Thấp - Nguồn rõ hay dễ cãi nhau]`

**2.3 BINARY SETTLEMENT STATEMENT (Dịch ra ngôn ngữ cược):**
- **Sàn bắt buộc trả YES NẾU VÀ CHỈ NẾU:** `[...]`
- **Sàn sẽ trả NO trong mọi ca còn lại, ĐẶC BIỆT NẾU:** `[...]`

**2.4 EDGE CASES (Lập hồ sơ bẫy):**
| # | Tình huống xảy ra ngoài đời | Áp vào luật Sàn thì Yes hay No? | Lý do Sàn vin vào |
|---|---|---|---|
| 1 | `[Sự kiện A diễn ra nhưng muộn 1 giây]` | `[NO]` | `[Thỏa Time cutoff rule]` |
| 2 | `[...]` | `[...]` | `[...]` |
| 3 | `[...]` | `[...]` | `[...]` |

**2.5 THREE SENTENCES TEST (Tóm tắt luật sư):**
1. Market này đang CÂN ĐO biến số: `[...]`
2. Market này KHÔNG CÂN ĐO thông tin: `[...]`
3. Sự kiện có kịch bản dễ nhầm lẫn nhất sẽ là: `[...]`

**KẾT LUẬN T2:**
- Độ tự tin về Rule (Resolution Confidence): `[ High / Medium / Low ]`
*(Nếu rule mập mờ, bốc Low. Có Low thì auto giảm 1 cấp Size vào tiền ở T5).*
