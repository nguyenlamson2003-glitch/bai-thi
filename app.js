document.addEventListener("DOMContentLoaded", () => {
    fetchNews();
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchNews() {
    const loadingIndicator = document.getElementById('loading');
    const newsContainer = document.getElementById('news-container');

    // Bật hiệu ứng loading xoay vòng 3D
    loadingIndicator.style.display = 'block';
    newsContainer.innerHTML = '';

    try {
        // Chạy song song cả delay ảo 1.2s và fetch API
        const [_, response] = await Promise.all([
            sleep(1200),
            fetch('https://jsonplaceholder.typicode.com/posts')
        ]);

        if (!response.ok) {
            throw new Error(`Mạng lỗi hoặc Server từ chối: ${response.status}`);
        }

        const posts = await response.json();
        const displayPosts = posts.slice(0, 10);

        // Dùng Fragment gom dữ liệu để render 1 lần duy nhất
        const fragment = document.createDocumentFragment();

        displayPosts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'news-card'; // Đã khớp với CSS

            // Tiêu đề
            const titleEl = document.createElement('h3');
            titleEl.textContent = `[#${post.id}] ${post.title}`;

            // Nội dung
            const bodyEl = document.createElement('p');
            bodyEl.textContent = post.body;

            // Nút Read More
            const readMoreBtn = document.createElement('a');
            readMoreBtn.className = 'read-more';
            readMoreBtn.href = '#';
            readMoreBtn.textContent = 'Read More';

            // Gắn vào thẻ card
            card.appendChild(titleEl);
            card.appendChild(bodyEl);
            card.appendChild(readMoreBtn);
            
            fragment.appendChild(card);
        });

        // Đẩy lên màn hình
        newsContainer.appendChild(fragment);

    } catch (error) {
        console.error("Hệ thống phát hiện sự cố:", error);
        
        // Hiển thị khung báo lỗi rung lắc
        const errorPara = document.createElement('div');
        errorPara.className = 'error-msg';
        errorPara.textContent = `⚠️ LỖI HỆ THỐNG: ${error.message}`;
        newsContainer.appendChild(errorPara);
    } finally {
        // Ẩn loading
        loadingIndicator.style.display = 'none';
    }
}
