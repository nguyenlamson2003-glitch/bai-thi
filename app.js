document.addEventListener("DOMContentLoaded", () => {
    fetchNews();
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchNews() {
    const loadingIndicator = document.getElementById('loading');
    const newsContainer = document.getElementById('news-container');

    loadingIndicator.style.display = 'block';
    newsContainer.innerHTML = '';

    try {
        // TỐI ƯU: Chạy song song cả sleep và fetch để tiết kiệm thời gian
        const [_, response] = await Promise.all([
            sleep(1200), // Vẫn giữ 1.2s nghệ thuật của bạn
            fetch('https://jsonplaceholder.typicode.com/posts') // Chạy đồng thời luôn
        ]);

        if (!response.ok) {
            throw new Error(`Lỗi kết nối Server: ${response.status}`);
        }

        const posts = await response.json();
        const displayPosts = posts.slice(0, 10);

        // TỐI ƯU: Sử dụng DocumentFragment để tránh reflow giao diện nhiều lần
        const fragment = document.createDocumentFragment();

        displayPosts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card';

            // Tạo các element nhỏ bên trong để dùng textContent chống XSS
            const titleEl = document.createElement('h3');
            titleEl.textContent = `[#${post.id}] ${post.title}`;

            const bodyEl = document.createElement('p');
            bodyEl.textContent = post.body;

            card.appendChild(titleEl);
            card.appendChild(bodyEl);
            
            fragment.appendChild(card);
        });

        // Chỉ nạp vào DOM đúng 1 lần duy nhất
        newsContainer.appendChild(fragment);

    } catch (error) {
        console.error("Hệ thống phát hiện sự cố:", error);
        // Với tin nhắn lỗi, dùng textContent để an toàn
        const errorPara = document.createElement('p');
        errorPara.className = 'error-msg';
        errorPara.textContent = `LỖI HỆ THỐNG: ${error.message}`;
        newsContainer.appendChild(errorPara);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}
