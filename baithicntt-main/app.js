document.addEventListener("DOMContentLoaded", () => {
    fetchNews();
});

// Hàm tạo delay ảo giúp loading nhấp nháy vài giây xem cho nghệ thuật
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchNews() {
    const loadingIndicator = document.getElementById('loading');
    const newsContainer = document.getElementById('news-container');

    // 1. Bật hiệu ứng Đang tải dữ liệu và làm trống danh sách cũ
    loadingIndicator.style.display = 'block';
    newsContainer.innerHTML = '';

    try {
        // Cố tình chờ 1.2 giây để khoe chữ Loading nhấp nháy (muốn siêu tốc độ thì xóa dòng này nhé)
        await sleep(1200);

        // 2. Viết hàm async/await gọi dữ liệu từ API công khai theo đề bài
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');

        // Check nếu server chết hoặc lỗi kết nối mạng
        if (!response.ok) {
            throw new Error(`Lỗi kết nối Server: ${response.status}`);
        }

        const posts = await response.json();

        // 3. Render dữ liệu thành các khối Card (Lấy 10 bài cho đẹp giao diện)
        const displayPosts = posts.slice(0, 10);

        displayPosts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <h3>[#${post.id}] ${post.title}</h3>
                <p>${post.body}</p>
            `;
            newsContainer.appendChild(card);
        });

    } catch (error) {
        // 4. Xử lý bắt lỗi bằng khối try...catch phòng trường hợp mất mạng
        console.error("Hệ thống phát hiện sự cố:", error);
        newsContainer.innerHTML = `<p class="error-msg">LỖI HỆ THỐNG: ${error.message}</p>`;
    } finally {
        // Tắt loading indicator dù thành công hay thất bại
        loadingIndicator.style.display = 'none';
    }
}
