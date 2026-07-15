export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center custom-dark:bg-white/[0.03]`}
    >
      <a
        href="/"
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-primary text-theme-sm hover:bg-hover custom-dark:bg-brand-500 custom-dark:hover:bg-500/80"
      >
        Quay lại trang chủ
      </a>
    </div>
  );
}
