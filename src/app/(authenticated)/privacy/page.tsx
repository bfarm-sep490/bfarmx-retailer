import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật | BFarmX Retailer',
  description: 'Chính sách bảo mật và điều khoản dịch vụ cho nền tảng BFarmX Retailer',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Chính Sách Bảo Mật</h1>
          <p className="text-muted-foreground text-lg">
            Cập nhật lần cuối:
            {' '}
            {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Giới Thiệu</h2>
          <p className="text-muted-foreground">
            Chào mừng bạn đến với BFarmX Retailer. Chúng tôi cam kết bảo vệ quyền riêng tư và đảm bảo an toàn thông tin cá nhân của bạn. Chính sách Bảo mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin của bạn khi sử dụng nền tảng của chúng tôi.
          </p>
        </section>

        {/* Information Collection */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Thông Tin Chúng Tôi Thu Thập</h2>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">Thông Tin Cá Nhân</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Tên và thông tin liên hệ</li>
              <li>Thông tin đăng nhập</li>
              <li>Thông tin doanh nghiệp</li>
              <li>Lịch sử giao dịch</li>
              <li>Thông tin nông sản và kết quả kiểm định</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">Thông Tin Sử Dụng</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Thông tin thiết bị</li>
              <li>Địa chỉ IP</li>
              <li>Loại trình duyệt</li>
              <li>Mẫu sử dụng</li>
            </ul>
          </div>
        </section>

        {/* Data Usage */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Cách Chúng Tôi Sử Dụng Thông Tin</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">Cung Cấp Dịch Vụ</h3>
              <p className="text-sm text-muted-foreground">
                Để cung cấp và duy trì dịch vụ, xử lý giao dịch, và quản lý tài khoản của bạn.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">Truyền Thông</h3>
              <p className="text-sm text-muted-foreground">
                Để gửi thông báo quan trọng và phản hồi các yêu cầu của bạn.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">Bảo Mật</h3>
              <p className="text-sm text-muted-foreground">
                Để bảo vệ chống gian lận và truy cập trái phép vào tài khoản của bạn.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">Cải Thiện</h3>
              <p className="text-sm text-muted-foreground">
                Để phân tích mẫu sử dụng và cải thiện chức năng của nền tảng.
              </p>
            </div>
          </div>
        </section>

        {/* Data Protection */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Bảo Vệ Dữ Liệu</h2>
          <div className="space-y-4">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-medium mb-4">Biện Pháp Bảo Mật</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Mã hóa dữ liệu nhạy cảm</li>
                <li>• Kiểm tra bảo mật định kỳ</li>
                <li>• Kiểm soát truy cập và xác thực</li>
                <li>• Lưu trữ và truyền tải dữ liệu an toàn</li>
                <li>• Bảo vệ thông tin kiểm định nông sản</li>
              </ul>
            </div>
          </div>
        </section>

        {/* User Rights */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Quyền Của Bạn</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">Truy Cập & Kiểm Soát</h3>
              <p className="text-sm text-muted-foreground">
                Bạn có quyền truy cập, sửa đổi hoặc xóa thông tin cá nhân của mình.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-medium mb-2">Tính Di Động Dữ Liệu</h3>
              <p className="text-sm text-muted-foreground">
                Bạn có thể yêu cầu một bản sao dữ liệu của mình ở định dạng có cấu trúc.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Liên Hệ</h2>
          <div className="p-6 rounded-lg border bg-card">
            <p className="text-muted-foreground">
              Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này, vui lòng liên hệ với chúng tôi qua:
            </p>
            <div className="mt-4 space-y-2">
              <p className="font-medium">Email: support@bfarmx.com</p>
              <p className="font-medium">Điện thoại: +84 XXX XXX XXX</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
