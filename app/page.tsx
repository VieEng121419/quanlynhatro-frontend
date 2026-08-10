import {
  ArrowRight,
  Github,
  Star,
  Users,
  Zap,
  Shield,
  Code,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/nhatrotuanviet-logo.png"
                alt="Nhà trọ Tuấn Việt"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className="text-xl font-bold text-white">
                Nhà trọ Tuấn Việt
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Tính năng
              </a>
              <a
                href="#demo"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Demo
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Giới thiệu
              </a>
              <Button
                variant="outline"
                className="border-purple-500 hover:text-white hover:bg-purple-500 bg-purple-500 text-white"
                asChild
              >
                <Link href="https://github.com/VieEng121419/quanlynhatro-frontend">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Star className="w-3 h-3 mr-1" />
            Mã nguồn mở & Miễn phí
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Quản lý
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Nhà trọ
            </span>
            Tuấn Việt
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Hệ thống quản lý nhà trọ Tuấn Việt, giúp quản lý phòng trọ, hợp
            đồng, hóa đơn và khách thuê một cách dễ dàng và hiệu quả.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-6 text-lg"
              asChild
            >
              <Link href="/dashboard">
                Xem Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="" asChild>
              <a href="https://github.com/VieEng121419/quanlynhatro-frontend">
                <Github className="w-5 h-5 mr-2" />
                Xem trên GitHub
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=VieEng121419&repo=quanlynhatro-frontend&type=star&count=true&size=large"
                  frameBorder="0"
                  scrolling="0"
                  width="170"
                  height="30"
                  title="GitHub"
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=VieEng121419&repo=quanlynhatro-frontend&type=fork&count=true&size=large"
                  frameBorder="0"
                  scrolling="0"
                  width="170"
                  height="30"
                  title="GitHub"
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=VieEng121419&repo=quanlynhatro-frontend&type=watch&count=true&size=large&v=2"
                  frameBorder="0"
                  scrolling="0"
                  width="170"
                  height="30"
                  title="GitHub"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Mọi thứ bạn cần để quản lý
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Các tính năng mạnh mẽ giúp việc quản lý nhà trọ trở nên dễ dàng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nhanh chóng
                </h3>
                <p className="text-gray-400">
                  Xây dựng với Next.js 15 và tối ưu hiệu suất. Tải trang nhanh
                  chóng ngay từ đầu.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Sẵn sàng sản xuất
                </h3>
                <p className="text-gray-400">
                  Sẵn sàng cho production với xác thực, quản lý vai trò và các
                  biện pháp bảo mật tốt nhất.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Ưu tiên nhà phát triển
                </h3>
                <p className="text-gray-400">
                  API sạch, hỗ trợ TypeScript và tài liệu đầy đủ. Được xây dựng
                  bởi nhà phát triển, cho nhà phát triển.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Quản lý đầy đủ
                </h3>
                <p className="text-gray-400">
                  Quản lý phòng trọ, hợp đồng, hóa đơn và khách thuê một cách
                  dễ dàng và hiệu quả.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Thiết kế hiện đại
                </h3>
                <p className="text-gray-400">
                  Giao diện đẹp mắt xây dựng với shadcn/ui và Tailwind CSS.
                  Responsive và dễ tiếp cận.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/10 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Mã nguồn mở
                </h3>
                <p className="text-gray-400">
                  Hoàn toàn miễn phí và mã nguồn mở. Không bị ràng buộc, không
                  phí ẩn. Sử dụng theo cách bạn muốn.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Bắt đầu trong vài giây
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Cài đặt và chạy hệ thống quản lý nhà trọ chỉ với vài lệnh
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    Terminal
                  </Badge>
                </div>
                <div className="font-mono text-sm space-y-2">
                  <div className="text-gray-400"># Clone the repository</div>
                  <div className="text-green-400">
                    git clone
                    https://github.com/VieEng121419/quanlynhatro-frontend.git
                  </div>
                  <div className="text-gray-400"># Install dependencies</div>
                  <div className="text-green-400">npm install</div>
                  <div className="text-gray-400">
                    # Start development server
                  </div>
                  <div className="text-green-400">npm run dev</div>
                  <div className="text-purple-400">
                    🚀 Hệ thống sẵn sàng tại http://localhost:3000
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng quản lý nhà trọ của bạn?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Bắt đầu quản lý phòng trọ, hợp đồng, hóa đơn và khách thuê một cách
            dễ dàng với Nhà trọ Tuấn Việt.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-6 text-lg"
              asChild
            >
              <Link href="/dashboard">
                Xem Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600  hover:bg-black px-8 py-6 text-lg text-black hover:text-white hover:border-black "
              asChild
            >
              <Link href="https://github.com/VieEng121419/quanlynhatro-frontend">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="border-t border-gray-800 bg-black/30 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/nhatrotuanviet-logo.png"
                  alt="Nhà trọ Tuấn Việt"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-lg object-contain"
                />
                <span className="text-xl font-bold text-white">
                  Nhà trọ Tuấn Việt
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Hệ thống quản lý nhà trọ Tuấn Việt, giúp quản lý phòng trọ, hợp
                đồng, hóa đơn và khách thuê một cách dễ dàng và hiệu quả.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-black"
                  asChild
                >
                  <Link href="https://github.com/VieEng121419/quanlynhatro-frontend">
                    <Github className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-black"
                  asChild
                >
                  <Link href="https://github.com/VieEng121419/quanlynhatro-frontend">
                    <Star className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2026 Nhà trọ Tuấn Việt. Mã nguồn mở theo giấy phép MIT.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
