/* ============================================
   PREMIUM QUOTE GENERATOR - JAVASCRIPT
   ============================================ */

// Extended Quote Database
const quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        text: "Don't let yesterday take up too much of today.",
        author: "Will Rogers"
    },
    {
        text: "You learn more from failure than from success.",
        author: "Unknown"
    },
    {
        text: "It's not whether you get knocked down, it's whether you get up.",
        author: "Vince Lombardi"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb"
    },
    {
        text: "Everything you want is on the other side of fear.",
        author: "Jack Canfield"
    },
    {
        text: "Success is not final, failure is not fatal.",
        author: "Winston Churchill"
    },
    {
        text: "Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.",
        author: "Roy T. Bennett"
    },
    {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins"
    },
    {
        text: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
        author: "Martin Luther King Jr."
    },
    {
        text: "Do what you can, with what you have, where you are.",
        author: "Theodore Roosevelt"
    },
    {
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt"
    }
];

// DOM Elements
const quoteText = document.getElementById('quote');
const quoteAuthor = document.getElementById('author');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shareBtn = document.getElementById('shareBtn');
const copyBtn = document.getElementById('copyBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const quoteNumber = document.getElementById('quoteNumber');
const totalQuotes = document.getElementById('totalQuotes');

// State Management
let currentIndex = 0;
let favorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];

// Initialize
totalQuotes.textContent = quotes.length;
displayQuote(0);

// ============================================
// CORE FUNCTIONS
// ============================================

function displayQuote(index) {
    const quote = quotes[index];
    
    // Add fade-out animation
    quoteText.classList.add('fade-out');
    quoteAuthor.classList.add('fade-out');
    
    // Change quote after fade-out
    setTimeout(() => {
        quoteText.textContent = quote.text;
        quoteAuthor.textContent = quote.author;
        quoteNumber.textContent = index + 1;
        
        // Update current index
        currentIndex = index;
        
        // Remove fade-out and add fade-in
        quoteText.classList.remove('fade-out');
        quoteAuthor.classList.remove('fade-out');
        quoteText.classList.add('fade-in');
        quoteAuthor.classList.add('fade-in');
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            quoteText.classList.remove('fade-in');
            quoteAuthor.classList.remove('fade-in');
        }, 600);
        
        // Update favorite button state
        updateFavoriteButton();
    }, 400);
}

function getRandomQuote() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * quotes.length);
    } while (randomIndex === currentIndex && quotes.length > 1);
    return randomIndex;
}

function goToPrevious() {
    const newIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    displayQuote(newIndex);
}

function goToNext() {
    const newIndex = (currentIndex + 1) % quotes.length;
    displayQuote(newIndex);
}

function goToRandom() {
    const randomIndex = getRandomQuote();
    displayQuote(randomIndex);
}

// ============================================
// ACTION HANDLERS
// ============================================

function copyToClipboard() {
    const text = `"${quoteText.textContent}" — ${quoteAuthor.textContent}`;
    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        const originalHTML = copyBtn.innerHTML;
        copyBtn.classList.add('active');
        copyBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copied!</span>';
        
        setTimeout(() => {
            copyBtn.classList.remove('active');
            copyBtn.innerHTML = originalHTML;
        }, 2000);
    }).catch(() => {
        alert('Failed to copy quote');
    });
}

function shareQuote() {
    const text = `"${quoteText.textContent}" — ${quoteAuthor.textContent}`;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'Inspiring Quote',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Share cancelled'));
    } else {
        // Fallback: Copy to clipboard and show feedback
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = shareBtn.innerHTML;
            shareBtn.classList.add('active');
            shareBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Link Ready!</span>';
            
            setTimeout(() => {
                shareBtn.classList.remove('active');
                shareBtn.innerHTML = originalHTML;
            }, 2000);
        });
    }
}

function toggleFavorite() {
    const currentQuote = quotes[currentIndex];
    const quoteId = currentIndex;
    
    const isFavorited = favorites.includes(quoteId);
    
    if (isFavorited) {
        favorites = favorites.filter(id => id !== quoteId);
    } else {
        favorites.push(quoteId);
    }
    
    // Save to localStorage
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    
    // Update button appearance
    updateFavoriteButton();
    
    // Show feedback
    showNotification(isFavorited ? 'Removed from favorites' : 'Added to favorites');
}

function updateFavoriteButton() {
    const isFavorited = favorites.includes(currentIndex);
    
    if (isFavorited) {
        favoriteBtn.classList.add('active');
    } else {
        favoriteBtn.classList.remove('active');
    }
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        z-index: 9999;
        animation: slideInNotification 0.4s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.4s ease-out forwards';
        setTimeout(() => notification.remove(), 400);
    }, 2500);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInNotification {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutNotification {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// EVENT LISTENERS
// ============================================

newQuoteBtn.addEventListener('click', goToRandom);
prevBtn.addEventListener('click', goToPrevious);
nextBtn.addEventListener('click', goToNext);
copyBtn.addEventListener('click', copyToClipboard);
shareBtn.addEventListener('click', shareQuote);
favoriteBtn.addEventListener('click', toggleFavorite);

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.key === 'Enter') {
        event.preventDefault();
        goToRandom();
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
    } else if (event.key === 'c' || event.key === 'C') {
        copyToClipboard();
    }
});

// Initialize favorites button state
updateFavoriteButton();

// Optional: Log keyboard shortcuts on load
console.log(`
╔════════════════════════════════════════╗
║      INSPIRE - Quote Generator         ║
╠════════════════════════════════════════╣
║  KEYBOARD SHORTCUTS:                   ║
║  • Space/Enter: Random Quote           ║
║  • ← Arrow: Previous Quote             ║
║  • → Arrow: Next Quote                 ║
║  • C: Copy Quote                       ║
╚════════════════════════════════════════╝
`);
