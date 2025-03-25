# Ghi chú để tối ưu hóa hệ thống

- Redux-persist hoặc localStorage để giữ data khi guest Page Reload (F5). Nhưng thông tin quan trọng như auth cần phải lưu trên Http Cookie

- ở prisma backend. Thay vì manual gán id trong quan hệ ta sử dụng connect

VD: <!-- prettier-ignore -->
data: {
      check_in_date: body.checkInDate,
      check_out_date: body.checkOutDate,
      room: {
        connect: {
          id: body.roomId,
        },
      },
      status: body.status,
    }

- Khi sử dụng useSWR phụ thuộc giá trị khác ta nên truyền hàm vào. (https://swr.vercel.app/docs/conditional-fetching#dependent)

(Đã xong) - Xóa bỏ các isLoading và isValidating không cần thiết của useSWR để tối ưu hiệu suất giảm lượng render đáng kể (https://swr.vercel.app/docs/advanced/understanding#dependency-collection-for-performance)

- Sử dụng loading.js của Nextjs <Suspense> và <ErrorBoundary> của React
  -& loading.js, khi người dùng chuyển trang thì trong thời gian render page lên thì loading.js sẽ hiển thị thay
  -& Khác biệt của loading.js và <Suspense> là <Suspense> cho khả năng kiểm soát những phần nào cần hiện loading state và những phàn nào hiển thị trước. (https://nextjs.org/docs/app/getting-started/fetching-data#with-suspense).

- Tạo error.ts và bắt lỗi 404

- Sử dụng useSWRInfinity để query pagination ở bảng và card hotel... (https://swr.vercel.app/docs/pagination#example-1-index-based-paginated-api)

- Sử dụng Prefetching của swr (https://swr.vercel.app/docs/prefetching#programmatically-prefetch) và router.prefetch() (https://nextjs.org/docs/app/api-reference/functions/use-router#userouter)
  để chuyển trang client-side nhanh hơn (Cân nhắc về Suspense mode)

- Sử dụng use hook của React để streaming data từ Server đến Client Component
  Link: https://react.dev/reference/react/use#streaming-data-from-server-to-client

- Chuyển
  return NextResponse.json(
  { success: false, message: errorMessage },
  { status: errorStatus }
  );

- Query trực tiếp Database ở Server Component thay vì thông qua API
- Sử dụng useActionState để quản lý Server Action

- Khai báo Error retry ở SWR Global Config (https://swr.vercel.app/docs/error-handling#error-retry)

- Sử dụng Next/font và subset của nó

- SWR: Để giảm lượng gọi API - Lưu giữ cache với localStorage để load cache data thay vì gọi API lại sau khi guest Page Reload (F5) (https://swr.vercel.app/docs/advanced/cache#localstorage-based-persistent-cache)

- SWR: Khi Modify cache nên sử dụng mutate thay vì cache.delete or cache.set (https://swr.vercel.app/docs/advanced/cache#modify-the-cache-data)

* Khi clear cache ví dụ như logout thì nên sử dụng const { mutate } = useSWRConfig() global mutate, nhưng nếu chỉ cập nhật một thông tin thôi thì nên sử dụng key-based cache.

Nên xem xét tạo hook riêng để fetch address API

- Redis : DÙng Redis để Cache Total room, booking hay staff để sử dụng Pagination cho table.
