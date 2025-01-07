let books = [];
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const GENRES = [
    'fiction',
    'fantasy', 
    'romance',
    'mystery',
    'thriller',
    'horror',
    'biography',
    'history',
    'science',
    'poetry',
    'drama',
    'adventure',
    'classics',
    'comics',
    'children'
];

const booksList = document.getElementById('booksList');
const addBookBtn = document.getElementById('addBookBtn');
const bookModal = document.getElementById('bookModal');
const closeModal = document.querySelector('.close');
const bookForm = document.getElementById('bookForm');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Sistema rating // 
function saveRatings(ratings) {
    localStorage.setItem('bookRatings', JSON.stringify(ratings));
}

function loadRatings() {
    const saved = localStorage.getItem('bookRatings');
    return saved ? JSON.parse(saved) : {};
}

function createRatingElement(bookId) {
    const ratings = loadRatings();
    const currentRating = ratings[bookId] || 0;

    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'rating-container';
    
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = `star ${i <= currentRating ? 'active' : ''}`;
        star.innerHTML = '★';
        star.setAttribute('data-rating', i);
        
        star.addEventListener('click', (e) => {
            const rating = parseInt(e.target.getAttribute('data-rating'));
            const ratings = loadRatings();
            ratings[bookId] = rating;
            saveRatings(ratings);
            

            const stars = e.target.parentElement.children;
            for (let j = 0; j < stars.length; j++) {
                stars[j].className = `star ${j < rating ? 'active' : ''}`;
            }
            

            const avgDisplay = ratingContainer.querySelector('.average-rating');
            if (avgDisplay) {
                avgDisplay.textContent = `Avaliação: ${rating}/5`;
            }
        });
        
        starsContainer.appendChild(star);
    }
    
    const averageRating = document.createElement('div');
    averageRating.className = 'average-rating';
    averageRating.textContent = `Avaliação: ${currentRating}/5`;
    
    ratingContainer.appendChild(starsContainer);
    ratingContainer.appendChild(averageRating);
    
    return ratingContainer;
}

async function loadInitialBooks() {
    try {
        books = [];
        for (const genre of GENRES) {
            const response = await fetch(`${GOOGLE_BOOKS_API}?q=subject:${genre}&maxResults=6`);
            const data = await response.json();
            
            const genreBooks = data.items.map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'Autor Desconhecido',
                description: book.volumeInfo.description || 'Sem descrição disponível',
                image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg',
                genre: genre
            }));
            
            books = [...books, ...genreBooks];
        }
        displayBooks();
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
    }
}

function displayBooks() {
    booksList.innerHTML = '';
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';


        const bookContent = `
            <div class="genre-tag">${book.genre}</div>
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p class="author">${book.author}</p>
            <p class="description">${book.description.substring(0, 100)}...</p>
        `;
        
        bookCard.innerHTML = bookContent;
        
        // Rating // 
        const ratingElement = createRatingElement(book.id);
        bookCard.appendChild(ratingElement);
        
        // Botão remover
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-btn';
        removeButton.textContent = 'Remover';
        removeButton.onclick = () => removeBook(book.id);
        bookCard.appendChild(removeButton);
        
        booksList.appendChild(bookCard);
    });
}

function removeBook(id) {
    if (confirm('Tem certeza que deseja remover este livro?')) {
        books = books.filter(book => book.id !== id);
        displayBooks();
    }
}

async function searchBooks() {
    const query = searchInput.value.trim();
    if (query) {
        try {
            const genre = document.getElementById('genreSelect').value;
            const searchQuery = genre === 'all' ? query : `subject:${genre} ${query}`;
            
            const response = await fetch(`${GOOGLE_BOOKS_API}?q=${searchQuery}&maxResults=16`);
            const data = await response.json();
            
            books = data.items.map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'Autor Desconhecido',
                description: book.volumeInfo.description || 'Sem descrição disponível',
                image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg',
                genre: genre === 'all' ? 'Diversos' : genre
            }));
            displayBooks();
        } catch (error) {
            console.error('Erro na pesquisa:', error);
        }
    }
}

// Event Listeners//
addBookBtn.addEventListener('click', () => bookModal.style.display = 'block');
closeModal.addEventListener('click', () => bookModal.style.display = 'none');
searchBtn.addEventListener('click', searchBooks);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBooks();
});

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newBook = {
        id: Date.now().toString(),
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        image: document.getElementById('bookImage').value || 'placeholder.jpg',
        description: document.getElementById('bookDescription').value,
        genre: document.getElementById('bookGenre').value
    };
    books.unshift(newBook);
    displayBooks();
    bookModal.style.display = 'none';
    bookForm.reset();
});

window.onload = loadInitialBooks;