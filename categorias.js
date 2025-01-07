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
const filterButtons = document.querySelectorAll('.filter-btn');

async function loadAllBooks() {
    try {
        books = [];
        for (const genre of GENRES) {
            const response = await fetch(`${GOOGLE_BOOKS_API}?q=subject:${genre}&maxResults=8`);
            const data = await response.json();
            
            const genreBooks = data.items.map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'Autor Desconhecido',
                image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg',
                genre: genre
            }));
            
            books = [...books, ...genreBooks];
        }
        displayBooks('all');
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
    }
}

function displayBooks(selectedGenre) {
    booksList.innerHTML = '';
    const filteredBooks = selectedGenre === 'all' 
        ? books 
        : books.filter(book => book.genre === selectedGenre);

    filteredBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="genre-tag">${book.genre}</div>
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p class="author">${book.author}</p>
        `;
        booksList.appendChild(bookCard);
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        displayBooks(button.dataset.genre);
    });
});

window.onload = loadAllBooks;