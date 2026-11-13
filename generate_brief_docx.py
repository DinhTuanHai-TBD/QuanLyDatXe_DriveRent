import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()
    
    # Page setup - Normal margins 1 inch
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
        
        # Header / Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("TÀI LIỆU TÓM TẮT DỰ ÁN | DRIVERENT")
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Hệ thống Quản lý Dịch vụ Cho thuê Xe máy & Ô tô Tự lái Thông minh • 2026")
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(148, 163, 184)

    # Document Title
    p_title_sub = doc.add_paragraph()
    p_title_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_title_sub.add_run("TÀI LIỆU TÓM TẮT DỰ ÁN (PROJECT BRIEF)")
    r_sub.font.size = Pt(11)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(0, 194, 111) # Emerald
    
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("HỆ THỐNG QUẢN LÝ DỊCH VỤ CHO THUÊ XE MÁY & Ô TÔ TỰ LÁI DRIVERENT")
    r_title.font.size = Pt(16)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(15, 23, 42) # Slate-900

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_meta = p_meta.add_run("Mã dự án: DRV-RENT-2026  •  Phiên bản: 2.5 (Cập nhật Mới nhất)  •  Ngành: Du lịch & Vận tải / OTA")
    r_meta.font.size = Pt(9.5)
    r_meta.font.italic = True
    r_meta.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # Quick summary box
    table_box = doc.add_table(rows=1, cols=1)
    table_box.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table_box.rows[0].cells[0]
    set_cell_background(cell, "F0FDF4") # Light emerald
    set_cell_margins(cell, top=160, bottom=160, left=220, right=220)
    cp = cell.paragraphs[0]
    c_run = cp.add_run("★ Bản tóm tắt dự án định hình bài toán theo chuẩn 8 câu hỏi cốt lõi, tích hợp toàn bộ các nâng cấp mới nhất: Giao diện kính mờ Liquid Glass, Dàn 16 mẫu xe thực tế (VinFast VF3-VF9, Vios, Xpander...), Hỗ trợ gói Thuê Ngày & Thuê Tháng, Quy định pháp lý Việt Nam & Quốc tế (Mỹ, Nga, Hàn, Trung), Trải nghiệm Popup chi tiết chuẩn Mioto và Hệ thống Đa ngôn ngữ (Việt - Anh - Nga - Hàn).")
    c_run.font.size = Pt(9.5)
    c_run.font.color.rgb = RGBColor(6, 95, 70)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    def add_section_header(num_str, title_str):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(14)
        h.paragraph_format.space_after = Pt(5)
        h.paragraph_format.keep_with_next = True
        r = h.add_run(f"{num_str}. {title_str}")
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.color.rgb = RGBColor(15, 23, 42)
        return h

    # 1. Dự án này là gì?
    add_section_header("1", "Dự án này là gì?")
    p = doc.add_paragraph()
    p.add_run("DriveRent là ").bold = False
    p.add_run("Website Đặt Xe Tự Lái Trực Tuyến kết hợp Hệ Thống Quản Trị Nghiệp Vụ Doanh Nghiệp Toàn Diện").bold = True
    p.add_run(" (thuộc nhóm ngành Du lịch & Vận tải / OTA). Dự án được xây dựng theo mô hình nền tảng lai (Hybrid Platform) giải quyết trọn vẹn cả 2 mặt của một doanh nghiệp vận tải du lịch:")
    
    bullet1 = doc.add_paragraph(style='List Bullet')
    r1 = bullet1.add_run("Cổng Khách hàng (Online Booking Portal): ")
    r1.bold = True
    bullet1.add_run("Website thương mại điện tử hiện đại thiết kế theo phong cách kính mờ Liquid Glass (Glassmorphism), giao diện lấy cảm hứng từ Green Future và Mioto. Cung cấp bộ lọc thông minh cho phép khách chọn thuê linh hoạt theo Ngày (24h) hoặc theo Tháng (chiết khấu tới 30-40%), tự động hiển thị 16 mẫu xe thực tế chất lượng cao, tích hợp hệ thống đa ngôn ngữ (Tiếng Việt, Anh, Nga, Hàn) và cổng đặt cọc giữ chỗ trực tuyến trong 10 phút qua mã QR.")

    bullet2 = doc.add_paragraph(style='List Bullet')
    r2 = bullet2.add_run("Hệ thống Quản trị Doanh nghiệp (Back-office ERP/CRM/FMS): ")
    r2.bold = True
    bullet2.add_run("Hệ thống điều hành gara chuyên sâu gồm: FMS (Quản lý đội xe, đăng kiểm, bảo hiểm), RMS (Quản lý hợp đồng 4 bước, kiểm tra trùng lịch tự động, biên bản bàn giao - thu hồi 6 hạng mục có ảnh chụp hiện trạng, quyết toán trừ cọc), CRM (Quản lý hồ sơ CCCD/GPLX, lịch sử thuê, điểm uy tín khách hàng), và Mini ERP (Quản lý xưởng bảo dưỡng, nhắc thay nhớt theo km và báo cáo tài chính doanh thu).")

    # 2. Khách hàng là ai?
    add_section_header("2", "Khách hàng là ai?")
    p = doc.add_paragraph()
    p.add_run("Khách hàng trực tiếp của hệ thống là ")
    p.add_run("các cơ sở, doanh nghiệp và chuỗi cửa hàng kinh doanh dịch vụ cho thuê xe tự lái").bold = True
    p.add_run(" (quy mô từ 15 đến hơn 100 đầu xe) tại các thành phố du lịch biển và trung tâm kinh tế lớn như Nha Trang, Cam Ranh, Đà Nẵng, Phú Quốc, TP. Hồ Chí Minh, Hà Nội. Trong nội bộ doanh nghiệp, hệ thống phục vụ 3 nhóm vai trò chính:")
    
    b = doc.add_paragraph(style='List Bullet')
    b.add_run("Chủ cơ sở, Giám đốc điều hành: ").bold = True
    b.add_run("Theo dõi tức thì tỷ lệ lấp đầy xe, doanh thu, lợi nhuận, tiền cọc đang nắm giữ và các rủi ro vận hành.")

    b = doc.add_paragraph(style='List Bullet')
    b.add_run("Nhân viên Kinh doanh, Lễ tân: ").bold = True
    b.add_run("Kiểm tra lịch xe trống tức thời, tạo hợp đồng nhanh trong 2 phút, lập biên bản bàn giao xe và thanh lý quyết toán hợp đồng chính xác tuyệt đối.")

    b = doc.add_paragraph(style='List Bullet')
    b.add_run("Kỹ thuật viên, Quản lý xưởng: ").bold = True
    b.add_run("Theo dõi ODO km lăn bánh thực tế để bảo dưỡng thay nhớt đúng định mức, quản lý hạn đăng kiểm và chi phí phụ tùng sửa chữa.")

    # 3. Đối tượng khách hàng của họ là ai?
    add_section_header("3", "Đối tượng khách hàng của họ là ai?")
    p = doc.add_paragraph()
    p.add_run("Người thuê xe của nhà xe bao gồm 4 nhóm đối tượng đa dạng cả trong nước và quốc tế:")
    
    b = doc.add_paragraph(style='List Bullet')
    b.add_run("Du khách trong nước (Cá nhân, gia đình, giới trẻ): ").bold = True
    b.add_run("Thuê xe máy (Vision, Air Blade, SH) hoặc ô tô 5-7 chỗ (VF 3, Vios, Xpander, Everest) du lịch khám phá từ 1 đến 5 ngày. Yêu cầu đặt xe nhanh, nhận xe tại sân bay/khách sạn qua CCCD hoặc VNeID mức 2.")

    b = doc.add_paragraph(style='List Bullet')
    b.add_run("Du khách quốc tế hợp lệ tự lái (Hàn Quốc, Nga, Châu Âu, ASEAN): ").bold = True
    b.add_run("Sở hữu bằng lái quốc tế IDP theo Công ước Viên 1968 (đặc biệt khách Hàn Quốc theo Hiệp định song phương 2023 và khách Nga chiếm tỷ trọng rất cao tại Nha Trang). Yêu cầu đọc hiểu quy định và thao tác bằng ngôn ngữ mẹ đẻ (Tiếng Nga, Tiếng Hàn, Tiếng Anh).")

    b = doc.add_paragraph(style='List Bullet')
    b.add_run("Khách quốc tế không được tự lái theo luật VN (Mỹ, Úc, Canada, Nhật, Trung Quốc): ").bold = True
    b.add_run("Do các quốc gia này chưa tham gia Công ước Viên 1968, hệ thống định tuyến hướng dẫn nhóm khách này sử dụng dịch vụ thuê xe kèm tài xế riêng (Chauffeur) hoặc thuê xe máy điện/dưới 50cc hợp pháp.")

    b = doc.add_paragraph(style='List Bullet')
    b.add_run("Doanh nghiệp & Chuyên gia thuê xe theo tháng: ").bold = True
    b.add_run("Các công ty FDI, chuyên gia công tác dài ngày cần gói thuê tháng ổn định (VF 8, VF 9, Kia Carnival, Mazda 3) có hóa đơn, bảo dưỡng định kỳ trọn gói và xe thay thế khi bảo dưỡng.")

    # 4. Mục tiêu của dự án là gì?
    add_section_header("4", "Mục tiêu của dự án là gì?")
    p = doc.add_paragraph()
    p.add_run("Dự án DriveRent hướng tới 5 mục tiêu chiến lược:")
    
    goals = [
        ("Số hóa toàn diện vòng đời thuê xe: ", "Loại bỏ 100% việc ghi chép sổ tay, bảng tính rời rạc; kết nối liền mạch từ lúc khách duyệt web chọn xe đến khi hoàn tất trả xe và quyết toán cọc."),
        ("Đa dạng hóa gói thuê Ngày & Tháng: ", "Cung cấp bảng giá linh hoạt tự động chuyển đổi theo ngày và theo tháng, giúp tăng doanh thu bình quân từ các hợp đồng thuê dài hạn."),
        ("Quốc tế hóa dịch vụ với Đa ngôn ngữ & Tuân thủ pháp lý: ", "Hỗ trợ 4 ngôn ngữ (Việt, Anh, Nga, Hàn) và minh bạch hóa điều kiện bằng lái theo Luật Giao thông Việt Nam & Công ước Viên 1968, ngăn ngừa rắc rối pháp lý khi khách nước ngoài tham gia giao thông."),
        ("Minh bạch tài chính & Bảo vệ tài sản: ", "Tách biệt tài khoản tiền cọc khỏi doanh thu dịch vụ, chuẩn hóa biên bản giao nhận 6 hạng mục kèm ảnh chụp hiện trạng để xóa bỏ hoàn toàn tranh chấp trầy xước lúc trả xe."),
        ("Tối ưu hóa năng suất vận hành: ", "Rút ngắn thời gian làm thủ tục nhận/trả xe tại quầy từ 15-20 phút xuống chỉ còn 2-3 phút mỗi lượt khách.")
    ]
    for idx, (title, desc) in enumerate(goals, 1):
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(f"Mục tiêu {idx} - {title}").bold = True
        bp.add_run(desc)

    # 5. Website cần giải quyết vấn đề gì?
    add_section_header("5", "Website cần giải quyết vấn đề gì?")
    p = doc.add_paragraph()
    p.add_run("Hệ thống giải quyết triệt để 5 nút thắt lớn nhất của ngành cho thuê xe tự lái:")

    problems = [
        ("Xung đột trùng lịch xe & Không biết xe nào đang rảnh: ", "Hệ thống cung cấp thuật toán kiểm tra khả dụng tự động (checkVehicleAvailability) kết hợp sơ đồ trạng thái trực quan (Available, Rented, Maintenance), đảm bảo không bao giờ xảy ra tình trạng trùng xe giữa khách đặt online và khách thuê tại quầy."),
        ("Rào cản ngôn ngữ & Rủi ro pháp lý bằng lái đối với khách nước ngoài: ", "Tích hợp đa ngôn ngữ (Anh, Nga, Hàn) cùng chuyên trang Quy định bằng lái chuẩn Thông tư 29/2015/TT-BGTVT; phân loại rõ ràng nhóm nước được tự lái (Hàn, Nga, EU) và nhóm nước chưa được tự lái (Mỹ, Úc, Trung Quốc) kèm giải pháp xe có tài xế."),
        ("Tranh chấp trầy xước, hư hại và thiếu chứng cứ lúc nhận trả xe: ", "Biên bản bàn giao và thu hồi số hóa có checklist 6 hạng mục (thân vỏ, lốp, đèn, gương, xăng/pin, phụ kiện) kèm ảnh chụp thực tế 4 góc và chốt số km ODO, làm căn cứ pháp lý minh bạch khi quyết toán."),
        ("Nhầm lẫn tiền cọc vào doanh thu & Tính phụ phí thủ công sai lệch: ", "Bộ máy tính tiền tự động hóa 100%: tính chuẩn xác phụ phí quá giờ, xăng/pin thiếu hụt, đền bù trầy xước; tự động khấu trừ vào cọc và in phiếu hoàn trả cọc rõ ràng."),
        ("Xe bỏ quên bảo dưỡng định kỳ gây mất an toàn: ", "Hệ thống cảnh báo kép: tự động đối chiếu số km ODO lăn bánh sau mỗi hợp đồng và mốc ngày định kỳ để phát thông báo thay nhớt, bảo dưỡng phanh kịp thời.")
    ]
    for title, desc in problems:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(title).bold = True
        bp.add_run(desc)

    # 6. Những yêu cầu chính là gì?
    add_section_header("6", "Những yêu cầu chính là gì?")
    
    p = doc.add_paragraph()
    p.add_run("6.1. Yêu cầu Cổng Khách hàng (Customer Front-end):").bold = True
    reqs_cust = [
        ("Phong cách Liquid Glass hiện đại: ", "Toàn bộ card xe, form tìm kiếm, thanh taskbar đều sử dụng hiệu ứng kính mờ trong suốt, viền phản quang và phông nền gara studio sang trọng."),
        ("Dàn 16 mẫu xe thực tế chất lượng cao: ", "Chia làm 3 phân khúc rõ ràng: 6 Xe điện VinFast (VF 3, VF 5, VF 6, VF 7, VF 8, VF 9), 6 Ô tô xăng (Vios, Xpander, Mazda 3, Carnival, Everest, Accent), 4 Xe máy (Vision, Air Blade, SH Mode, Wave Alpha). Tất cả đều sử dụng ảnh studio sắc nét tải độc lập."),
        ("Chuyển đổi linh hoạt Thuê ngày & Thuê tháng: ", "Hỗ trợ nút chọn Thuê ngày / Thuê tháng được đóng khung nổi bật, tự động đổi giá tiền tương ứng trên toàn bộ 16 thẻ xe."),
        ("Popup Chi tiết xe chuẩn phong cách Mioto: ", "Bấm vào ảnh hoặc nút thuê xe sẽ mở modal chi tiết: Gallery ảnh lớn, thông số kỹ thuật, tiện nghi xe, điều kiện bằng lái và bảng tính giá tạm tính."),
        ("Hệ thống Đa ngôn ngữ (i18n): ", "Hỗ trợ chuyển đổi nhanh giữa 4 ngôn ngữ (Việt, Anh, Nga, Hàn) trên thanh Header."),
        ("Quy định pháp lý Việt Nam & Quốc tế chuyên sâu: ", "Trang chuyên biệt nêu rõ điều kiện bằng lái cho khách VN, khách quốc tế hợp lệ (IDP Công ước Viên 1968) và danh sách nước không được tự lái."),
        ("Đặt xe giữ chỗ 10 phút & Quét mã QR cọc: ", "Cơ chế đếm ngược giữ xe 10 phút tránh trùng xe, tích hợp thanh toán cọc QR Code tiện lợi.")
    ]
    for title, desc in reqs_cust:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(title).bold = True
        bp.add_run(desc)

    p = doc.add_paragraph()
    p.add_run("6.2. Yêu cầu Hệ thống Quản trị Nội bộ (Admin Back-office):").bold = True
    reqs_adm = [
        ("Dashboard điều hành thời gian thực: ", "Biểu đồ xe sẵn sàng, xe đang chạy, xe bảo dưỡng, doanh thu và cảnh báo xe sắp trả trong ngày."),
        ("FMS Quản lý Đội xe: ", "Thêm, sửa xe, theo dõi ODO km, hạn đăng kiểm và hạn bảo hiểm thân vỏ/TNDS."),
        ("CRM Quản lý Khách hàng: ", "Lưu trữ CCCD/Passport, bằng lái, lịch sử giao dịch và điểm đánh giá uy tín."),
        ("RMS Quản lý Hợp đồng & Quyết toán: ", "Tạo hợp đồng 4 bước tại quầy, biên bản giao nhận 6 hạng mục kèm ảnh, quyết toán trừ cọc tự động."),
        ("In Hợp đồng chuẩn pháp lý A4: ", "Xuất mẫu in hợp đồng cho thuê xe song ngữ có Quốc hiệu Tiêu ngữ, điều khoản bảo vệ tài sản và chỗ ký tên."),
        ("Lịch trình điều phối Gantt Timeline: ", "Theo dõi dòng thời gian bận/rảnh của từng xe để bố trí giao nhận xe chuẩn xác.")
    ]
    for title, desc in reqs_adm:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(title).bold = True
        bp.add_run(desc)

    # 7. Phạm vi công việc đến đâu?
    add_section_header("7", "Phạm vi công việc đến đâu?")
    
    p = doc.add_paragraph()
    p.add_run("7.1. Trong phạm vi thực hiện (Đã hoàn thành 100%):").bold = True
    scope_in = [
        "Hoàn thiện 21 tính năng chính trên cả 2 phân hệ Khách hàng và Quản trị viên.",
        "Thiết kế Responsive 100% tương thích tối ưu trên Mobile, Tablet và Desktop.",
        "Bộ dữ liệu mẫu thực tế gồm 16 mẫu xe chất lượng cao với đầy đủ thông số kỹ thuật, hình ảnh studio và hợp đồng mẫu.",
        "Xây dựng hoàn chỉnh luồng nghiệp vụ: Đặt xe online giữ chỗ 10 phút -> Bàn giao xe -> Thu hồi kiểm tra 6 hạng mục -> Quyết toán cọc -> Bảo dưỡng xe.",
        "Kiểm thử đóng gói (npm run build) thành công 100% không lỗi linter và đồng bộ lên kho lưu trữ GitHub."
    ]
    for s in scope_in:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(s)

    p = doc.add_paragraph()
    p.add_run("7.2. Ngoài phạm vi hiện tại (Định hướng nâng cấp giai đoạn 2):").bold = True
    scope_out = [
        "Tích hợp cổng thanh toán trực tiếp qua ngân hàng (VietQR / VNPay Webhook tự động khớp giao dịch).",
        "Gắn thiết bị IoT định vị GPS trên xe để tự động đồng bộ số km ODO về hệ thống thời gian thực.",
        "Tích hợp AI OCR quét và tự động trích xuất thông tin từ CCCD và Bằng lái xe vào hợp đồng."
    ]
    for s in scope_out:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(s)

    # 8. Kết quả cần đạt được là gì?
    add_section_header("8", "Kết quả cần đạt được là gì?")
    
    p = doc.add_paragraph()
    p.add_run("8.1. Sản phẩm bàn giao cụ thể:").bold = True
    deliverables = [
        ("Kho mã nguồn hoàn chỉnh trên GitHub: ", "https://github.com/DinhTuanHai-TBD/QuanLyDatXe_DriveRent, mã nguồn sạch đẹp, cấu trúc TypeScript chuẩn hóa."),
        ("Hệ sinh thái ứng dụng hoạt động thực tế: ", "Website đặt xe cho khách hàng và Hệ thống quản trị nội bộ chạy mượt mà, phản hồi tức thì."),
        ("Tài liệu đặc tả dự án chuẩn mực: ", "File văn bản Word (.docx) và Markdown (.md) đặc tả trọn vẹn 8 câu hỏi cốt lõi phục vụ báo cáo và bàn giao.")
    ]
    for title, desc in deliverables:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(title).bold = True
        bp.add_run(desc)

    p = doc.add_paragraph()
    p.add_run("8.2. Chỉ số hiệu quả kinh doanh & Vận hành (KPIs):").bold = True
    
    # Summary Table of KPIs
    kpi_table = doc.add_table(rows=5, cols=3)
    kpi_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    headers = ["Chỉ số đo lường", "Trước khi áp dụng DriveRent", "Sau khi áp dụng DriveRent"]
    for i, h_text in enumerate(headers):
        c = kpi_table.rows[0].cells[i]
        set_cell_background(c, "0F172A")
        set_cell_margins(c, top=140, bottom=140, left=180, right=180)
        p_c = c.paragraphs[0]
        r_c = p_c.add_run(h_text)
        r_c.font.bold = True
        r_c.font.color.rgb = RGBColor(255, 255, 255)
        r_c.font.size = Pt(9.5)

    data = [
        ("Thời gian làm thủ tục nhận/trả xe", "15 - 20 phút / lượt khách", "Chỉ còn 2 - 3 phút (Giảm 85%)"),
        ("Tỷ lệ sai lệch & Nhầm lẫn tiền cọc", "Thường xuyên nhầm lẫn vào doanh thu", "Độ chính xác 100% (Tách biệt tiền cọc)"),
        ("Tỷ lệ tranh chấp hư hại xe lúc trả", "30% - 40% hợp đồng có cự cãi", "Giảm về 0% (Nhờ ảnh chụp & checklist 6 mục)"),
        ("Khả năng phục vụ khách quốc tế", "Khó khăn do bất đồng ngôn ngữ & luật", "Tối ưu vượt bậc (Đa ngôn ngữ & Chuẩn Công ước Viên)")
    ]
    
    for row_idx, row_data in enumerate(data, 1):
        for col_idx, text in enumerate(row_data):
            c = kpi_table.rows[row_idx].cells[col_idx]
            bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
            set_cell_background(c, bg)
            set_cell_margins(c, top=100, bottom=100, left=140, right=140)
            p_c = c.paragraphs[0]
            r_c = p_c.add_run(text)
            r_c.font.size = Pt(9)
            if col_idx == 2:
                r_c.font.bold = True
                r_c.font.color.rgb = RGBColor(0, 194, 111)

    doc.save("DriveRent_Project_Brief.docx")
    doc.save(r"C:\Users\ASUS\.gemini\antigravity\brain\37f94990-488b-45d0-9dad-48873c22a8d3\DriveRent_Project_Brief.docx")
    print("SUCCESS: DriveRent_Project_Brief.docx created in workspace and artifact dir")

if __name__ == "__main__":
    create_document()
