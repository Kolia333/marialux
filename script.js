// Функціонал для фіксованої навігації
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.classList.toggle('scrolled', window.scrollY > 0);
});

// Мобільне меню
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
    mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
});

// Функціонал пошуку
const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-input');
const dateInput = document.querySelector('.date-input');
const guestsInput = document.querySelector('.guests-input');

searchButton.addEventListener('click', () => {
    const searchQuery = searchInput.value.trim();
    const date = dateInput.value;
    const guests = guestsInput.value;

    if (searchQuery && date) {
        // В майбутньому тут буде логіка пошуку
        const searchParams = {
            location: searchQuery,
            date: date,
            guests: guests
        };
        console.log('Параметри пошуку:', searchParams);
        showNotification('Шукаємо найкращі варіанти для вас...');
    } else {
        showNotification('Будь ласка, заповніть обов\'язкові поля', 'error');
    }
});

// Функціонал бронювання
document.querySelectorAll('.book-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const title = card.querySelector('h3').textContent;
        const price = card.querySelector('.card-price p').textContent;
        const location = card.querySelector('.location').textContent;
        
        showBookingModal(title, price, location);
    });
});

// Модальне вікно бронювання
function showBookingModal(title, price, location) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Бронювання</h2>
            <h3>${title}</h3>
            <p>${location}</p>
            <p class="price">${price}</p>
            <form id="booking-form">
                <div class="form-group">
                    <label>Ім'я:</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" required>
                </div>
                <div class="form-group">
                    <label>Телефон:</label>
                    <input type="tel" required>
                </div>
                <div class="form-group">
                    <label>Дата заїзду:</label>
                    <input type="date" required>
                </div>
                <div class="form-group">
                    <label>Дата виїзду:</label>
                    <input type="date" required>
                </div>
                <button type="submit" class="book-button">Підтвердити бронювання</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Анімація появи
    setTimeout(() => modal.classList.add('active'), 10);

    // Закриття модального вікна
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });

    // Обробка форми
    const form = modal.querySelector('#booking-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Бронювання успішно створено!', 'success');
        setTimeout(() => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }, 1500);
    });
}

// Система сповіщень
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;

    document.body.appendChild(notification);
    
    // Анімація появи
    setTimeout(() => notification.classList.add('active'), 10);

    // Автоматичне закриття
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Анімація появи елементів при прокрутці
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('about-card')) {
                entry.target.style.transitionDelay = `${entry.target.dataset.delay}s`;
            }
        }
    });
}, observerOptions);

// Додаємо затримку для карток "Про нас"
document.querySelectorAll('.about-card').forEach((card, index) => {
    card.dataset.delay = index * 0.2;
    observer.observe(card);
});

// Спостерігаємо за всіма картками
document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
    card.classList.add('fade-in');
});

// Плавна прокрутка до секцій
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Закриваємо мобільне меню при кліку
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            }
        }
    });
});

// Ініціалізація форми пошуку
document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація календаря для дати заїзду
    const checkInPicker = flatpickr("#check-in", {
        dateFormat: "d.m.Y",
        minDate: "today",
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                longhand: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"]
            },
            months: {
                shorthand: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
                longhand: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"]
            }
        },
        onChange: function(selectedDates) {
            // Оновлюємо мінімальну дату виїзду при виборі дати заїзду
            if (selectedDates.length > 0) {
                const nextDay = new Date(selectedDates[0]);
                nextDay.setDate(nextDay.getDate() + 1);
                checkOutPicker.set('minDate', nextDay);
                
                // Якщо дата виїзду раніше нової дати заїзду, очищаємо її
                if (checkOutPicker.selectedDates[0] && checkOutPicker.selectedDates[0] <= selectedDates[0]) {
                    checkOutPicker.clear();
                }
            }
        }
    });

    // Ініціалізація календаря для дати виїзду
    const checkOutPicker = flatpickr("#check-out", {
        dateFormat: "d.m.Y",
        minDate: "today",
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                longhand: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"]
            },
            months: {
                shorthand: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
                longhand: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"]
            }
        }
    });

    // Обробка поля для вибору кількості гостей
    const guestsInput = document.getElementById('guests');
    
    // Встановлюємо початкове значення
    guestsInput.value = '0';
    
    // Обробка введення значення
    guestsInput.addEventListener('input', function() {
        let value = this.value;
        
        // Видаляємо всі нецифрові символи
        value = value.replace(/[^0-9]/g, '');
        
        // Конвертуємо в число
        let numValue = parseInt(value);
        
        // Перевіряємо чи це число
        if (isNaN(numValue)) {
            this.value = '0';
            return;
        }
        
        // Обмежуємо значення від 0 до 10
        if (numValue > 10) {
            this.value = '10';
        } else {
            this.value = numValue.toString();
        }
    });
    
    // Обробка втрати фокусу
    guestsInput.addEventListener('blur', function() {
        if (this.value === '') {
            this.value = '0';
        }
    });

    // Функціонал зміни теми
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Перевіряємо збережену тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Обробник кліку по кнопці
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Зберігаємо та встановлюємо нову тему
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    // Оновлення іконки теми
    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Функціонал модального вікна бронювання
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');
    const bookButtons = document.querySelectorAll('.book-button');
    
    // Ініціалізація flatpickr для дати
    flatpickr("#booking-date", {
        enableTime: false,
        dateFormat: "Y-m-d",
        minDate: "today",
        locale: "uk"
    });
    
    // Ініціалізація flatpickr для часу
    flatpickr("#booking-time", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        minTime: "09:00",
        maxTime: "22:00",
        locale: "uk"
    });
    
    // Відкриття модального вікна при кліку на кнопку "Забронювати"
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.card');
            const title = card.querySelector('.card-title').textContent;
            const location = card.querySelector('.card-location span').textContent;
            
            // Встановлюємо заголовок модального вікна
            modal.querySelector('h2').textContent = `Бронювання - ${title}`;
            
            // Показуємо модальне вікно
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Закриття модального вікна
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    });
    
    // Закриття при кліку поза модальним вікном
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
    
    // Обробка відправки форми
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Тут буде логіка відправки даних на сервер
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            date: document.getElementById('booking-date').value,
            time: document.getElementById('booking-time').value,
            guests: document.getElementById('booking-guests').value,
            notes: document.getElementById('notes').value
        };
        
        // Виводимо дані в консоль (для демонстрації)
        console.log('Дані бронювання:', formData);
        
        // Показуємо повідомлення про успішне бронювання
        alert('Дякуємо за бронювання! Ми зв\'яжемося з вами найближчим часом.');
        
        // Закриваємо модальне вікно
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Очищаємо форму
        this.reset();
    });
});