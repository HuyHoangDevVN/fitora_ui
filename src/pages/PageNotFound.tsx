const PageNotFound = () => {
  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
            Trang không tồn tại.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500">
            Xin lỗi, chúng tôi không thể tìm thấy trang bạn yêu cầu. Hãy khám
            phá thêm nhiều nội dung thú vị tại trang chủ.
          </p>
          <a
            href="/"
            className="inline-flex text-white bg-primary hover:bg-purple-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
          >
            Quay lại Trang chủ
          </a>
        </div>
      </div>
    </section>
  );
};

export default PageNotFound;
