// Logika untuk Navigasi Hamburger
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('nav-icon');
    
    icon.classList.toggle('open');

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.style.maxHeight = '0px';
        setTimeout(() => {
            menu.style.maxHeight = '300px';
        }, 10);
    } else {
        menu.style.maxHeight = '0px';
        setTimeout(() => {
            menu.classList.add('hidden');
        }, 500);
    }
}

let allProducts = [];
let currentPage = 1;
const itemsPerPage = 3; // Jumlah produk per halaman

// 1. Ambil data dari API/JSON
async function loadProducts() {
    try {
        const response = await fetch('dataan.json');
        allProducts = await response.json();
        renderPage(currentPage);
    } catch (error) {
        console.error("Gagal memuat produk:", error);
    }
}

// 2. Fungsi untuk memotong data & menampilkan ke grid
function renderPage(page) {
    const grid = document.getElementById('product-grid');
    grid.style.opacity = '0'; // Efek animasi keluar

    setTimeout(() => {
        grid.innerHTML = '';
        
        // Logika memotong array produk
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = allProducts.slice(start, end);

        paginatedItems.forEach(item => {
            grid.innerHTML += `
                <div class="product-card bento-card group cursor-pointer">
                    <div class="bg-[#F3F4F6] rounded-[32px] p-2 overflow-hidden border border-transparent hover:border-gray-200 hover:shadow-2xl transition-all duration-500">
                        <div class="aspect-[4/3] rounded-[24px] overflow-hidden">
                            <img src="${item.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        </div>
                        <div class="p-6 flex justify-between items-end">
                            <div>
                                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">${item.category}</p>
                                <h3 class="text-xl font-bold tracking-tight">${item.name}</h3>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-bold mb-2">${item.price}</p>
                                <a href="data.html?id=${item.id}" class="inline-block bg-black text-white p-3 rounded-2xl hover:bg-gray-800 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        grid.style.opacity = '1'; // Efek animasi masuk
        updatePaginationButtons();
    }, 300);
}

// 3. Update tampilan tombol angka
function updatePaginationButtons() {
    const container = document.getElementById('pagination-numbers');
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    container.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage;
        container.innerHTML += `
            <button onclick="goToPage(${i})" 
                class="w-10 h-10 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-500'}">
                ${i}
            </button>
        `;
    }
}

// 4. Fungsi navigasi
function goToPage(page) {
    currentPage = page;
    renderPage(currentPage);
}

function changePage(direction) {
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    }
    renderPage(currentPage);
}

// Fungsi Filter Kategori (Nanti akan terhubung ke API)
function filterCategory(category) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.classList.remove('hidden-item');
        } else {
            card.classList.add('hidden-item');
        }
    });
}

// Jalankan saat pertama kali dimuat
loadProducts();
