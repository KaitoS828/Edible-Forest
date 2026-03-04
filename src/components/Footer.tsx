import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer id="contact" className="bg-[#F6F2ED] border-t border-[#EEEEEE] pt-12 pb-8">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
          <Logo size="lg" />
          <div className="text-sm text-[#595757] space-y-2">
            <p>
              <span className="text-[#333333] font-medium">運営者</span>　有限会社〇〇〇
            </p>
            <p>
              <span className="text-[#333333] font-medium">所在地</span>：熊本県球磨郡五木村〇〇〇
            </p>
            <p>
              <span className="text-[#333333] font-medium">お問い合わせ</span>：
              <a href="mailto:info.itsukimiraikenyu@gmail.com" className="text-[#E58251] hover:underline">
                info.itsukimiraikenyu@gmail.com
              </a>
            </p>
          </div>
        </div>
        <p className="text-xs text-[#595757] border-t border-[#EEEEEE] pt-6 text-center">
          本サイトは、一般社団法人五木村過疎未来研究会が運営しています。記事の無断転載を禁じます。
        </p>
      </div>
    </footer>
  );
}
