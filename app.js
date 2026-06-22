document.addEventListener("DOMContentLoaded", () => {
    fetchNews();
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchNews() {
    const loadingIndicator = document.getElementById('loading');
    const newsContainer = document.getElementById('news-container');

    // Bật hiệu ứng loading
    loadingIndicator.style.display = 'block';
    newsContainer.innerHTML = '';

    try {
        const [_, response] = await Promise.all([
            sleep(1200),
            fetch('https://jsonplaceholder.typicode.com/posts')
        ]);

        if (!response.ok) {
            throw new Error(`Mạng lỗi hoặc Server từ chối: ${response.status}`);
        }

        const posts = await response.json();
        const displayPosts = posts.slice(0, 10);
        const fragment = document.createDocumentFragment();

        displayPosts.forEach(post => {
            const card = document.createElement('div');
            // ĐIỂM QUAN TRỌNG: Đổi class thành 'news-card' để nhận form giao diện mới
            card.className = 'news-card'; 

            const titleEl = document.createElement('h3');
            titleEl.textContent = `[#${post.id}] ${post.title}`;

            const bodyEl = document.createElement('p');
            bodyEl.textContent = post.body;

            const readMoreBtn = document.createElement('a');
            readMoreBtn.className = 'read-more';
            readMoreBtn.href = '#';
            readMoreBtn.textContent = 'Read More';

            card.appendChild(titleEl);
            card.appendChild(bodyEl);
            card.appendChild(readMoreBtn);
            
            fragment.appendChild(card);
        });

        newsContainer.appendChild(fragment);

    } catch (error) {
        console.error("Sự cố:", error);
        const errorPara = document.createElement('div');
        errorPara.className = 'error-msg';
        errorPara.textContent = `⚠️ LỖI HỆ THỐNG: ${error.message}`;
        newsContainer.appendChild(errorPara);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}
