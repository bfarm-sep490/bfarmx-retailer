import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tài liệu Kiểm Định | BFarmX Retailer',
  description: 'Chi tiết về quy trình kiểm định nông sản và tiêu chuẩn đánh giá',
};

export default function GuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Kiểm Định Nông Sản</h1>
          <p className="text-muted-foreground text-lg">
            Tài liệu chi tiết về quy trình và tiêu chuẩn kiểm định
          </p>
        </div>

        {/* Overview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Tổng Quan</h2>
          <div className="p-6 rounded-lg border bg-card">
            <p className="text-muted-foreground">
              Hệ thống kiểm định được sử dụng để đánh giá chất lượng nông sản dựa trên các chỉ số kiểm nghiệm như hàm lượng kim loại nặng, vi sinh vật, dư lượng thuốc bảo vệ thực vật, v.v... Mỗi kết quả kiểm định sẽ được hệ thống phân loại thành một trong ba cấp độ chất lượng: Grade 1, Grade 2, Grade 3.
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Quy Trình Kiểm Định</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">1. Kiểm Tra Biểu Mẫu</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Kiểm tra biểu mẫu đã có kết quả</li>
                <li>Từ chối thêm mới nếu đã có kết quả</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">2. Thu Thập Thông Tin</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Lấy thông tin cây trồng</li>
                <li>Tra cứu bảng giới hạn</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">3. Phân Tích Kết Quả</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Kim loại nặng</li>
                <li>Vi sinh vật</li>
                <li>Dư lượng thuốc BVTV</li>
                <li>Phụ gia hóa học</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">4. Đánh Giá & Phân Loại</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Phân loại Grade 1-3</li>
                <li>Lưu kết quả</li>
                <li>Gửi thông báo</li>
                <li>Cập nhật blockchain</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Standards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Tiêu Chuẩn Đánh Giá</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">Grade 1</h3>
              <p className="text-sm text-muted-foreground">
                Không vi phạm - Sản phẩm đạt chất lượng cao
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">Grade 2</h3>
              <p className="text-sm text-muted-foreground">
                Vi phạm nhẹ (≤3 lỗi) - Cần cải thiện quy trình
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">Grade 3</h3>
              <p className="text-sm text-muted-foreground">
                Vi phạm lớn hoặc
                {' '}
                {'>'}
                3 lỗi - Cần xử lý hoặc tiêu hủy
              </p>
            </div>
          </div>
        </section>

        {/* Limits Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Bảng Giới Hạn Chất Lượng</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">Chỉ Tiêu</th>
                  <th className="p-4 text-left">Ý Nghĩa</th>
                  <th className="p-4 text-left">Giới Hạn</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Cadmi (Cd)</td>
                  <td className="p-4">Kim loại nặng, độc nếu tích tụ</td>
                  <td className="p-4">0.2 mg/kg (rau ăn lá)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Plumbum (Pb)</td>
                  <td className="p-4">Kim loại nặng chì</td>
                  <td className="p-4">0.1 – 0.3 mg/kg</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Hydrargyrum (Hg)</td>
                  <td className="p-4">Thủy ngân</td>
                  <td className="p-4">0.02 mg/kg</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Arsen (As)</td>
                  <td className="p-4">Asen độc</td>
                  <td className="p-4">1.0 mg/kg (rau khô)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Salmonella</td>
                  <td className="p-4">Vi khuẩn gây bệnh đường ruột</td>
                  <td className="p-4">0 (phát hiện = vi phạm)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Coliforms</td>
                  <td className="p-4">Chỉ báo vệ sinh</td>
                  <td className="p-4">Dưới 10</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">E.Coli</td>
                  <td className="p-4">Vi khuẩn gây tiêu chảy</td>
                  <td className="p-4">Dưới 100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Plant Types Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Danh Sách Loại Cây và Ngưỡng Kiểm Định</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">Loại Cây</th>
                  <th className="p-4 text-left">Cadmi (mg/kg)</th>
                  <th className="p-4 text-left">Plumbum (mg/kg)</th>
                  <th className="p-4 text-left">Thủy Ngân (mg/kg)</th>
                  <th className="p-4 text-left">Asen (mg/kg)</th>
                  <th className="p-4 text-left">Ghi Chú</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Rau họ thập tự</td>
                  <td className="p-4">0.05</td>
                  <td className="p-4">0.3</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4">Bắp cải, cải thảo,...</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Hành</td>
                  <td className="p-4">0.05</td>
                  <td className="p-4">0.1</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Rau ăn lá</td>
                  <td className="p-4">0.2</td>
                  <td className="p-4">0.3</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4">Xà lách, cải xanh...</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Rau ăn quả</td>
                  <td className="p-4">0.05</td>
                  <td className="p-4">0.1</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4">Cà chua, dưa leo...</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Rau ăn củ</td>
                  <td className="p-4">0.1</td>
                  <td className="p-4">0.1</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4">Cà rốt, củ cải...</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Rau ăn thân</td>
                  <td className="p-4">0.1</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4">Cần tây, rau muống...</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Nấm</td>
                  <td className="p-4">0.2</td>
                  <td className="p-4">0.3</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4">Nấm rơm, nấm bào ngư...</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Rau củ quả</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4">0.02</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Rau khô</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4">1.0</td>
                  <td className="p-4">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Rau họ đậu</td>
                  <td className="p-4">0.1</td>
                  <td className="p-4">0.2</td>
                  <td className="p-4">-</td>
                  <td className="p-4">-</td>
                  <td className="p-4">Đậu que, đậu cô ve...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Common Limits */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Giới Hạn Áp Dụng Chung</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">Chất Gây Hại</th>
                  <th className="p-4 text-left">Giới Hạn Tối Đa</th>
                  <th className="p-4 text-left">Mức Độ Vi Phạm</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Nitrat</td>
                  <td className="p-4">5000 mg/kg</td>
                  <td className="p-4">Vi phạm nghiêm trọng</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Glyphosate/Glufosinate</td>
                  <td className="p-4">0.1 mg/kg</td>
                  <td className="p-4">Vi phạm nghiêm trọng</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">MethylBromide</td>
                  <td className="p-4">0.01 mg/kg</td>
                  <td className="p-4">Vi phạm nghiêm trọng</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Dithiocarbamate</td>
                  <td className="p-4">0.01 mg/kg</td>
                  <td className="p-4">Vi phạm nghiêm trọng</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Chlorate</td>
                  <td className="p-4">0.01 mg/kg</td>
                  <td className="p-4">Vi phạm nghiêm trọng</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Perchlorate</td>
                  <td className="p-4">0.05 mg/kg</td>
                  <td className="p-4">Vi phạm nghiêm trọng</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Sulfur Dioxide</td>
                  <td className="p-4">0 mg/kg</td>
                  <td className="p-4">Vi phạm nghiêm trọng</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Hydrogen Phosphide</td>
                  <td className="p-4">0 mg/kg</td>
                  <td className="p-4">Vi phạm nghiêm trọng</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Salmonella</td>
                  <td className="p-4">0 CFU/g</td>
                  <td className="p-4">Vi phạm nghiêm trọng</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Coliforms</td>
                  <td className="p-4">10 CFU/g</td>
                  <td className="p-4">Vi phạm nhẹ/nghiêm trọng</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">E. coli</td>
                  <td className="p-4">
                    {'>'}
                    {' '}
                    10³ CFU/g
                  </td>
                  <td className="p-4">Vi phạm nghiêm trọng</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">E. coli</td>
                  <td className="p-4">10² – 10³ CFU/g</td>
                  <td className="p-4">Vi phạm nhẹ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Ví Dụ Minh Họa</h2>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-medium mb-4">Kiểm Định Rau Ăn Lá</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground">• Cadmi: 0.1 mg/kg ✅ (Giới hạn: 0.2)</p>
              <p className="text-muted-foreground">• Plumbum: 0.4 mg/kg ❌ (Giới hạn: 0.3)</p>
              <p className="text-muted-foreground">• E.coli: 900 CFU/g ⚠️ (Vi phạm nhẹ)</p>
              <p className="font-medium mt-4">Kết quả: Grade 3 (Vi phạm nghiêm trọng)</p>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Kết Luận</h2>
          <div className="p-6 rounded-lg border bg-card">
            <p className="text-muted-foreground">
              Quy trình kiểm định giúp đảm bảo an toàn thực phẩm, minh bạch nguồn gốc, và nâng cao giá trị nông sản. Việc tự động hóa phân loại giúp các bên liên quan (nông dân, kiểm định viên, người tiêu dùng) dễ dàng hiểu được chất lượng sản phẩm một cách trực quan và minh bạch.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
