// ==================== main.js — единый файл для всего сайта ====================

// ==================== ТЕМА, ГОРОД, УВЕДОМЛЕНИЯ, ИЗБРАННОЕ ====================

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const html = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    if (savedTheme === 'dark') {
        html.classList.add('dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    } else {
        html.classList.remove('dark');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
}

let currentCity = localStorage.getItem("selectedCity") || "Альметьевск";

function updateCityBadges() {
    const citySpans = document.querySelectorAll('.city-display, #currentCityText');
    citySpans.forEach(span => { if (span) span.innerText = currentCity; });
}

function setCity(city) {
    if (!city) return;
    currentCity = city;
    localStorage.setItem("selectedCity", city);
    updateCityBadges();
    showToast(`Город изменён: ${city}`, "success");
    if (window.location.pathname.includes('city.html')) {
        if (typeof renderCities === 'function') renderCities();
    }
}

function showToast(msg, type = "info") {
    let toast = document.createElement("div");
    toast.className = `fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-5 py-2.5 rounded-full shadow-lg text-white font-medium transition-all duration-300 ${type === "success" ? "bg-green-600" : "bg-purple-600"} text-sm`;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 400); }, 2500);
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function getFavoritesKey() {
    const user = getCurrentUser();
    return user ? `favorites_${user.email}` : null;
}

function getFavorites() {
    const key = getFavoritesKey();
    if (!key) return [];
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveFavorites(favorites) {
    const key = getFavoritesKey();
    if (key) localStorage.setItem(key, JSON.stringify(favorites));
}

function isFavorite(questId) {
    const favorites = getFavorites();
    return favorites.includes(questId);
}

function addToFavorites(questId) {
    if (!getCurrentUser()) {
        showToast('Войдите, чтобы добавить в избранное', 'info');
        return false;
    }
    const favorites = getFavorites();
    if (!favorites.includes(questId)) {
        favorites.push(questId);
        saveFavorites(favorites);
        showToast('Добавлено в избранное', 'success');
        return true;
    }
    return false;
}

function removeFromFavorites(questId) {
    if (!getCurrentUser()) return false;
    let favorites = getFavorites();
    const index = favorites.indexOf(questId);
    if (index !== -1) {
        favorites.splice(index, 1);
        saveFavorites(favorites);
        showToast('Удалено из избранного', 'info');
        return true;
    }
    return false;
}

function toggleFavorite(questId) {
    if (isFavorite(questId)) {
        removeFromFavorites(questId);
    } else {
        addToFavorites(questId);
    }
}

function initCommon() {
    initTheme();
    updateCityBadges();

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const toggleBtn = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (toggleBtn && mobileMenu) {
        toggleBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    }
}

// ==================== ДАННЫЕ ====================
const quests = [
    { id: "warpoint", name: "Warpoint", type: "VR-квест", typeEn: "vr", status: "open", rating: 4.8, price: 2500, priceStr: "от 2500₽", desc: "Погружение в виртуальную реальность с полным обзором 360°", duration: "60 минут", fullDesc: "Современный VR-квест, где вы оказываетесь на поле боя будущего. Используйте лазерное оружие, уклоняйтесь от врагов и выполняйте тактические задачи.", basedOn: "Оригинальный сценарий", players: "2-4 человека", difficulty: "Средний", difficultyEn: "medium", image: "photo/warpoint.png", theme: "Фантастика / Военный боевик", story: "2050 год. Корпорации захватили власть, и только вы можете остановить их. Ваша команда — элитный отряд сопротивления. Проникните в секретный комплекс и уничтожьте супероружие, пока не стало слишком поздно.", features: ["Полное VR-погружение", "Тактические сражения", "Реалистичное оружие", "Командная работа"] },
    { id: "maniac", name: "Маньяк-коллекционер", type: "Квест", typeEn: "horror", status: "closed", rating: 4.9, price: 2800, priceStr: "от 2800₽", desc: "Страшный психологический триллер", duration: "70 минут", fullDesc: "Вы оказались в логове безумного коллекционера, который собирает человеческие страхи.", basedOn: "По мотивам фильмов ужасов", players: "2-5 человек", difficulty: "Высокий", difficultyEn: "hard", image: "photo/maniac.png", theme: "Психологический хоррор", story: "Вы просыпаетесь в подвале. Вокруг — странные предметы: куклы, фотографии, дневники. Голос из динамика сообщает: «Вы — новый экспонат моей коллекции. У вас 70 минут, чтобы выбраться, иначе станете частью моей галереи страха».", features: ["Живые актёры", "Психологическое давление", "Неожиданные повороты", "Интерактивные загадки"] },
    { id: "psycho", name: "Психбольница", type: "Квест", typeEn: "horror", status: "closed", rating: 4.7, price: 2600, priceStr: "от 2600₽", desc: "Атмосфера безумия и загадок", duration: "60 минут", fullDesc: "Заброшенная психиатрическая лечебница хранит мрачные тайны.", basedOn: "Вдохновлено классикой хоррора", players: "2-6 человек", difficulty: "Высокий", difficultyEn: "hard", image: "photo/psix.png", theme: "Мистический хоррор", story: "Лечебница «Аркхем» была закрыта после загадочных событий. Но ходят слухи, что доктор Морроу продолжает свои эксперименты. Вы отправляетесь туда, чтобы найти доказательства, но попадаете в ловушку.", features: ["Атмосферный звук", "Спецэффекты", "Ловушки", "Элементы триллера"] },
    { id: "banker", name: "Старый банкир", type: "Квест", typeEn: "logic", status: "closed", rating: 4.5, price: 2400, priceStr: "от 2400₽", desc: "Ограбление века в старинном особняке", duration: "60 минут", fullDesc: "Вы — команда грабителей, проникшая в особняк эксцентричного банкира.", basedOn: "Оригинальный детективный сюжет", players: "2-5 человек", difficulty: "Средний", difficultyEn: "medium", image: "photo/bank.png", theme: "Детектив / Ограбление", story: "Мистер Грей, известный банкир, спрятал своё состояние в сейфе, который охраняется сложнейшими механизмами. Ваша цель — взломать систему и вынести деньги, пока хозяин не вернулся.", features: ["Сложные механические загадки", "Командная работа", "Атмосфера старого особняка"] },
    { id: "amongus", name: "Among Us", type: "Квест-анимация", typeEn: "kids", status: "closed", rating: 4.9, price: 2200, priceStr: "от 2200₽", desc: "Космический детектив для команд", duration: "60 минут", fullDesc: "Интерактивная игра по мотивам популярной видеоигры. Вы — члены экипажа космического корабля.", basedOn: "По игре Among Us", players: "4-8 человек", difficulty: "Лёгкий", difficultyEn: "easy", image: "photo/among.png", theme: "Космический детектив", story: "Вы — экипаж корабля «Скиллд». Ваша миссия — выполнить задания и вернуться на Землю. Но один из вас — предатель. Самозванец будет саботировать системы и устранять членов команды.", features: ["Ролевая игра", "Дедукция", "Командные задания", "Костюмы и декорации"] },
    { id: "sherlock", name: "Шерлок Холмс", type: "Квест-анимация", typeEn: "logic", status: "closed", rating: 4.6, price: 2700, priceStr: "от 2700₽", desc: "Лондонские тайны и дедукция", duration: "70 минут", fullDesc: "Викторианский Лондон. Вместе с доктором Ватсоном вы расследуете загадочное убийство.", basedOn: "По мотивам произведений Артура Конан Дойла", players: "2-5 человек", difficulty: "Средний", difficultyEn: "medium", image: "photo/sherlok.png", theme: "Детектив / Викторианский Лондон", story: "На Бейкер-стрит произошло убийство. Скотленд-Ярд в тупике. Шерлок Холмс просит вашей помощи. Вам предстоит осмотреть место преступления, допросить свидетелей и собрать улики.", features: ["Атмосфера XIX века", "Дедуктивные загадки", "Интерактивные улики"] },
    { id: "hogwarts", name: "Тайная комната Хогвартса", type: "Квест-анимация", typeEn: "kids", status: "open", rating: 5.0, price: 3000, priceStr: "от 3000₽", desc: "Магия, заклинания и факультеты", duration: "90 минут", fullDesc: "Погрузитесь в мир Гарри Поттера! Вы — новые ученики Хогвартса.", basedOn: "По вселенной Гарри Поттера", players: "3-6 человек", difficulty: "Средний", difficultyEn: "medium", image: "photo/hog.png", theme: "Фэнтези / Магия", story: "Вы получили письмо из Хогвартса. Но в школе творится что-то странное: студенты исчезают, а коридоры полны тайн. Профессор Дамблдор просит вас найти Тайную комнату и разгадать загадку Слизерина.", features: ["Магические атрибуты", "Зельеварение", "Загадки по вселенной", "Костюмы факультетов"] },
    { id: "huggy", name: "Хаги Ваги", type: "Квест-анимация", typeEn: "kids", status: "open", rating: 4.8, price: 2100, priceStr: "от 2100₽", desc: "Детский хоррор с монстриками", duration: "50 минут", fullDesc: "Добро пожаловать на фабрику игрушек! Хаги Ваги и другие монстры устроили веселые испытания.", basedOn: "По мотивам игры Poppy Playtime", players: "2-4 человека", difficulty: "Лёгкий", difficultyEn: "easy", image: "photo/hagi.png", theme: "Детский хоррор / Приключение", story: "Фабрика игрушек Playtime Co. закрылась много лет назад, но игрушки ожили. Хаги Ваги приглашает вас поиграть. Но его игры не всегда безопасны. Пройдите испытания, решите головоломки и найдите выход.", features: ["Живые игрушки", "Яркие декорации", "Детские загадки", "Безопасный хоррор"] },
    { id: "wednesday", name: "Уэнсдей", type: "Квест-анимация", typeEn: "kids", status: "open", rating: 4.9, price: 2600, priceStr: "от 2600₽", desc: "Готическая загадка от Уэнсдей", duration: "65 минут", fullDesc: "Академия Невермор. Уэнсдей Аддамс просит вас помочь раскрыть тайну.", basedOn: "По сериалу «Уэнсдей»", players: "2-5 человек", difficulty: "Средний", difficultyEn: "medium", image: "photo/wend.png", theme: "Готический детектив", story: "В академии Невермор происходит нечто странное. Уэнсдей подозревает, что за этим стоит древнее проклятие. Она просит вашей помощи. Вам предстоит исследовать тайные комнаты и расшифровать записи в дневниках.", features: ["Готическая атмосфера", "Химические опыты", "Танцевальный батл", "Интерактивные загадки"] },
    { id: "stranger-things", name: "Обратная сторона", type: "Квест", typeEn: "horror", status: "open", rating: 4.9, price: 2900, priceStr: "от 2900₽", desc: "Погружение в мир обратной стороны", duration: "75 минут", fullDesc: "Вдохновлённый сериалом «Очень странные дела». Исследуйте заброшенную лабораторию.", basedOn: "По мотивам сериала «Очень странные дела»", players: "2-6 человек", difficulty: "Средний", difficultyEn: "medium", image: "photo/obrt.jpeg", theme: "Мистика / Научная фантастика", story: "Хокинс, 1985 год. В лаборатории пропали учёные. Вы отправляетесь туда, чтобы выяснить правду, но оказываетесь в ловушке. Вокруг — странные существа, порталы и измерения.", features: ["Атмосфера 80-х", "Элементы научной фантастики", "Живые актёры", "Монстры из измерений"] },
    { id: "pirates", name: "Проклятие Чёрной жемчужины", type: "Квест-анимация", typeEn: "kids", status: "open", rating: 4.7, price: 2800, priceStr: "от 2800₽", desc: "Пиратское приключение с поиском сокровищ", duration: "70 минут", fullDesc: "Йо-хо-хо! Вы — команда пиратов на поисках легендарного клада.", basedOn: "По мотивам фильма «Пираты Карибского моря»", players: "2-6 человек", difficulty: "Средний", difficultyEn: "medium", image: "photo/prokl.jpg", theme: "Приключения / Пираты", story: "Капитан Джек Воробей потерял свою карту сокровищ. Он нанимает вас, чтобы найти Чёрную жемчужину и снять проклятие. Вас ждут морские битвы, загадки древних пиратов и встреча с призраками.", features: ["Пиратские костюмы", "Карты и компасы", "Приключенческие загадки", "Командный дух"] },
    { id: "matrix", name: "Матрица: Выбор", type: "VR-квест", typeEn: "vr", status: "open", rating: 4.9, price: 3200, priceStr: "от 3200₽", desc: "Погружение в мир Матрицы с полным VR-опытом", duration: "65 минут", fullDesc: "Красная или синяя таблетка? Вы попали в Матрицу.", basedOn: "По вселенной Матрицы", players: "2-4 человека", difficulty: "Высокий", difficultyEn: "hard", image: "photo/matrix.jpg", theme: "Киберпанк / Философская фантастика", story: "Вы — избранный. Агенты Смиты знают о вас. Вы должны сбежать из Матрицы, уклоняясь от пуль и взламывая код реальности. Сможете ли вы принять красную таблетку и увидеть правду?", features: ["Полное VR-погружение", "Slow-motion эффект", "Борьба с агентами", "Философские загадки"] },
    { id: "zombie", name: "Зомби-апокалипсис", type: "Квест", typeEn: "horror", status: "open", rating: 4.8, price: 2700, priceStr: "от 2700₽", desc: "Выживание в мире зомби", duration: "60 минут", fullDesc: "Вирус вышел из-под контроля. Найдите вакцину и выберитесь.", basedOn: "По мотивам фильмов про зомби", players: "2-5 человек", difficulty: "Средний", difficultyEn: "medium", image: "photo/zombi.jpeg", theme: "Постапокалипсис / Хоррор", story: "Вирус Z-19 распространился по городу. Вы — последние выжившие, укрывшиеся в лаборатории. Нужно найти образец вакцины и выбраться на крышу, где вас ждёт вертолёт. Но зомби уже рядом.", features: ["Реалистичный грим", "Живые зомби", "Тактическое выживание", "Атмосфера апокалипсиса"] },
    { id: "inception", name: "Начало", type: "Квест", typeEn: "logic", status: "open", rating: 4.9, price: 3100, priceStr: "от 3100₽", desc: "Внедрение в сон", duration: "80 минут", fullDesc: "Внедритесь в сон миллиардера и украдите секретные данные.", basedOn: "По мотивам фильма «Начало»", players: "2-5 человек", difficulty: "Высокий", difficultyEn: "hard", image: "photo/start.jpg", theme: "Фантастика / Психологический триллер", story: "Вы — экстракторы, способные проникать в сны. Ваша цель — внедрить идею в подсознание бизнесмена, чтобы разрушить его империю. Но сны имеют несколько уровней, а проекции будут мешать.", features: ["Многоуровневые загадки", "Эффект гравитации", "Проекции сознания", "Психологические ловушки"] },
    { id: "back-to-future", name: "Назад в будущее", type: "Квест-анимация", typeEn: "kids", status: "open", rating: 4.8, price: 2600, priceStr: "от 2600₽", desc: "Путешествие во времени на DeLorean", duration: "70 минут", fullDesc: "Док Браун нуждается в вашей помощи! Почините машину времени.", basedOn: "По мотивам фильма «Назад в будущее»", players: "2-5 человек", difficulty: "Средний", difficultyEn: "medium", image: "photo/back.jpg", theme: "Научная фантастика / Комедия", story: "Док Браун застрял в 1955 году, а его DeLorean сломан. Вы должны отыскать детали, собрать 1.21 гигаватт и вернуть его в 1985 год, не нарушив временной континуум.", features: ["Машина времени", "Ностальгические загадки", "Юмор", "Приключение во времени"] },
    { id: "jumanji", name: "Джуманджи", type: "Квест-анимация", typeEn: "kids", status: "open", rating: 4.9, price: 2900, priceStr: "от 2900₽", desc: "Приключение в джунглях", duration: "75 минут", fullDesc: "Вы нашли загадочную настольную игру и теперь вы внутри неё.", basedOn: "По мотивам фильма «Джуманджи»", players: "2-6 человек", difficulty: "Средний", difficultyEn: "medium", image: "photo/jumangi.jpg", theme: "Приключения / Фэнтези", story: "Вы наткнулись на старую настольную игру «Джуманджи». Бросаете кубик — и вас затягивает в джунгли. Чтобы вернуться домой, нужно пройти все испытания, сразиться с хищниками и найти сокровище.", features: ["Интерактивные испытания", "Живые джунгли", "Звери и ловушки", "Командное приключение"] },
    { id: "saw", name: "Пила: Комната страха", type: "Квест", typeEn: "horror", status: "open", rating: 5.0, price: 3400, priceStr: "от 3400₽", desc: "Самый страшный квест по мотивам Пилы", duration: "90 минут", fullDesc: "Вы проснулись в комнате, где за вами наблюдает Конструктор.", basedOn: "По мотивам серии фильмов «Пила»", players: "2-4 человека", difficulty: "Экстремальный", difficultyEn: "hard", image: "photo/pila.jpg", theme: "Психологический хоррор / Триллер", story: "Вы просыпаетесь в заброшенной ванной. Запись на диктофоне сообщает: «Вы должны пройти мои испытания, чтобы жить. Решайте загадки, жертвуйте или ищите выход». Каждая комната — ловушка.", features: ["Экстремальные загадки", "Моральный выбор", "Атмосфера Пилы", "Ловушки"] }
];

const reviews = [
    { name: "Хворов Артём", level: "любитель", quest: "Маньяк-коллекционер", text: "Данный квест отлично подойдёт любителям и даже профессионалам. Загадки трудные, а аниматоры погружают в атмосферу с головой." },
    { name: "Женя", level: "любитель", quest: "Психбольница", text: "Захватывающее приключение, современное оборудование, качественная графика и хоррор-тематика." },
    { name: "Олег Савченко", level: "новичок", quest: "Warpoint", text: "Первый раз посетил VR-квест, было очень здорово! Рекомендую." },
    { name: "Алина", level: "любитель", quest: "Warpoint", text: "Поиграли, посмеялись, побегали. Зарядились отличным настроением!" },
    { name: "Татьяна", level: "любитель", quest: "Хаги Ваги", text: "Спасибо большое за классную программу! Очень порадовали детей." }
];

const newsData = [
    {
        id: 1,
        title: "Открытие нового VR-клуба в Альметьевске",
        date: "15 марта 2025",
        description: "Сверхреалистичные локации и полное погружение уже доступны. Спецпредложение для первых 100 команд.",
        image: "photo/warpoint.png",
        category: "VR",
        fullText: "Новый VR-клуб «Warpoint Arena» открыл свои двери в центре города. Посетителей ждут 5 уникальных сценариев, полное физическое погружение и профессиональные инструкторы. Скидка 20% на первое посещение при предварительной записи."
    },
    {
        id: 2,
        title: "Фестиваль квестов «Экстрим-выход» пройдёт в Казани",
        date: "02 апреля 2025",
        description: "Более 20 уникальных комнат, мастер-классы от создателей квестов, розыгрыш абонементов.",
        image: "photo/festival.jpeg",
        category: "События",
        fullText: "С 10 по 15 мая в Казани состоится крупнейший фестиваль квестов. Гости смогут посетить новые проекты, пообщаться с разработчиками и выиграть бесплатные прохождения."
    },
    {
        id: 3,
        title: "Квест «Тайная комната Хогвартса» получил награду лучший семейный проект",
        date: "28 февраля 2025",
        description: "Интерактивная магия и полное погружение в мир Гарри Поттера.",
        image: "photo/hog.png",
        category: "Награды",
        fullText: "На ежегодной премии «Квест-лидер» проект «Тайная комната Хогвартса» признан лучшим семейным квестом. Организаторы отмечают высокую детализацию и вовлекающий сценарий."
    },
    {
        id: 4,
        title: "Новогодние квест-каникулы: скидка 30% на все детские программы",
        date: "10 декабря 2024",
        description: "Успейте забронировать праздник для своего ребенка со сказочным сюжетом.",
        image: "photo/novi god.jpg",
        category: "Акции",
        fullText: "В преддверии праздников мы дарим скидку 30% на все детские квесты. Волшебная атмосфера, подарки и веселые задания ждут ваших детей."
    },
    {
        id: 5,
        title: "Новый хоррор-квест «Проклятый особняк» открывается в этом месяце",
        date: "5 марта 2025",
        description: "Атмосфера старинного замка, живые актёры и неожиданные повороты сюжета.",
        image: "photo/dom proklyat.jpg",
        category: "Новинки",
        fullText: "Создатели квеста «Психбольница» представляют новый проект. «Проклятый особняк» обещает стать самым страшным квестом сезона. Рекомендовано для игроков старше 16 лет."
    },
    {
        id: 6,
        title: "VR-квест «Матрица: Выбор» получил премию за инновации",
        date: "20 февраля 2025",
        description: "Уникальная система замедления времени и полное погружение.",
        image: "photo/natrica.jpeg",
        category: "Награды",
        fullText: "Проект «Матрица: Выбор» отмечен премией в номинации «Лучшее техническое оснащение». Разработчики внедрили технологию отслеживания движений и эффект slow-motion."
    }
];

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) starsHtml += '<i class="fas fa-star text-amber-400 text-sm"></i>';
    if (halfStar) starsHtml += '<i class="fas fa-star-half-alt text-amber-400 text-sm"></i>';
    for (let i = 0; i < emptyStars; i++) starsHtml += '<i class="far fa-star text-amber-400 text-sm"></i>';
    return starsHtml;
}

// ==================== СТРАНИЦА ГЛАВНАЯ (index.html) ====================
let filters = {
    search: '',
    types: [],
    difficulties: [],
    status: 'all',
    priceRange: 'all',
    sortBy: 'rating'
};

function renderFilterPanel() {
    return `
        <div class="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 mb-8 dark:bg-gray-800 dark:border-gray-700">
            <h3 class="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <i class="fas fa-filter text-purple-500"></i> Фильтры и поиск
            </h3>
            <div class="mb-4">
                <input type="text" id="searchInput" placeholder="🔍 Поиск по названию квеста..." 
                       class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Тип квеста</label>
                    <div class="space-y-2">
                        <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><input type="checkbox" value="vr" class="type-filter"> VR-квест</label>
                        <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><input type="checkbox" value="horror" class="type-filter"> Хоррор</label>
                        <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><input type="checkbox" value="logic" class="type-filter"> Логический</label>
                        <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><input type="checkbox" value="kids" class="type-filter"> Детский</label>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Сложность</label>
                    <div class="space-y-2">
                        <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><input type="checkbox" value="easy" class="difficulty-filter"> Лёгкий</label>
                        <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><input type="checkbox" value="medium" class="difficulty-filter"> Средний</label>
                        <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><input type="checkbox" value="hard" class="difficulty-filter"> Высокий</label>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Цена</label>
                    <select id="priceFilter" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <option value="all">Все цены</option>
                        <option value="0-2000">до 2000 ₽</option>
                        <option value="2000-2500">2000 - 2500 ₽</option>
                        <option value="2500-3000">2500 - 3000 ₽</option>
                        <option value="3000+">от 3000 ₽</option>
                    </select>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 mb-2">Статус</label>
                    <select id="statusFilter" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <option value="all">Все</option>
                        <option value="open">Открытые</option>
                        <option value="closed">Закрытые</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Сортировка</label>
                    <select id="sortFilter" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <option value="rating">По рейтингу (высокий)</option>
                        <option value="price-asc">По цене (сначала дешёвые)</option>
                        <option value="price-desc">По цене (сначала дорогие)</option>
                        <option value="name">По названию (А-Я)</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-between items-center mt-4">
                <button id="resetFilters" class="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400">
                    <i class="fas fa-undo-alt mr-1"></i> Сбросить все фильтры
                </button>
                <span id="resultsCount" class="text-sm text-gray-500 dark:text-gray-400">Найдено: ${quests.length} квестов</span>
            </div>
        </div>
    `;
}

function renderQuestCard(q) {
    const starsHtml = renderStars(q.rating);
    const isFav = isFavorite(q.id);
    return `
        <div class="quest-card bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-xl dark:bg-gray-800 dark:border-gray-700">
            <div class="h-48 overflow-hidden">
                <img src="${q.image}" alt="${q.name}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-110">
            </div>
            <div class="p-5">
                <div class="flex justify-between items-start">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">${q.name}</h3>
                    <div class="flex gap-2">
                        <button class="favorite-btn text-xl focus:outline-none transition hover:scale-110" data-id="${q.id}">
                            <i class="fas fa-heart ${isFav ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}"></i>
                        </button>
                        <span class="text-xs px-2 py-1 rounded-full ${q.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300'}">${q.status === 'open' ? 'Открыт' : 'Закрыт'}</span>
                    </div>
                </div>
                <p class="text-sm text-purple-500 mt-1 dark:text-purple-400">${q.type}</p>
                <div class="flex items-center my-2 gap-1">
                    ${starsHtml}
                    <span class="text-gray-700 dark:text-gray-300 ml-1 text-sm">(${q.rating})</span>
                </div>
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300"><i class="fas fa-chart-line mr-1"></i>${q.difficulty}</span>
                    <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300"><i class="fas fa-tag mr-1"></i>${q.priceStr}</span>
                </div>
                <p class="text-gray-500 text-sm line-clamp-2 dark:text-gray-400">${q.desc}</p>
                <div class="mt-3 flex justify-between items-center">
                    <span class="font-bold text-purple-700 dark:text-purple-400">${q.priceStr}</span>
                    <a href="quest-detail.html?id=${q.id}" class="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1.5 rounded-full transition btn-primary">Подробнее</a>
                </div>
            </div>
        </div>
    `;
}

function filterAndSortQuests() {
    let filtered = [...quests];
    if (filters.search) filtered = filtered.filter(q => q.name.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.types.length) filtered = filtered.filter(q => filters.types.includes(q.typeEn));
    if (filters.difficulties.length) filtered = filtered.filter(q => filters.difficulties.includes(q.difficultyEn));
    if (filters.status !== 'all') filtered = filtered.filter(q => q.status === filters.status);
    if (filters.priceRange !== 'all') {
        if (filters.priceRange === '0-2000') filtered = filtered.filter(q => q.price <= 2000);
        else if (filters.priceRange === '2000-2500') filtered = filtered.filter(q => q.price >= 2000 && q.price <= 2500);
        else if (filters.priceRange === '2500-3000') filtered = filtered.filter(q => q.price >= 2500 && q.price <= 3000);
        else if (filters.priceRange === '3000+') filtered = filtered.filter(q => q.price >= 3000);
    }
    if (filters.sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (filters.sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (filters.sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (filters.sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
}

function renderQuests() {
    const filtered = filterAndSortQuests();
    const resultsSpan = document.getElementById('resultsCount');
    if (resultsSpan) resultsSpan.textContent = `Найдено: ${filtered.length} квестов`;
    return `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="questsGrid">
            ${filtered.map(q => renderQuestCard(q)).join('')}
        </div>
        ${filtered.length === 0 ? '<div class="text-center py-12 text-gray-500 dark:text-gray-400">Квесты не найдены. Попробуйте изменить параметры фильтрации.</div>' : ''}
    `;
}

function renderHomePage() {
    return `
        <div class="space-y-12">
            <div class="bg-white rounded-3xl p-6 md:p-10 text-center shadow-sm border border-purple-200 dark:bg-gray-800 dark:border-gray-700">
                <h1 class="text-3xl md:text-5xl font-extrabold mb-4 text-gray-800 dark:text-gray-100">Квесты в реальности <span class="gradient-text">в ${currentCity}</span></h1>
                <p class="text-gray-600 max-w-2xl mx-auto text-lg dark:text-gray-300">Открой мир головоломок, адреналина и магии. Выбери свой квест и брось вызов судьбе!</p>
                <div class="mt-5 flex justify-center gap-3 flex-wrap">
                    <span class="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-purple-700 text-sm dark:bg-gray-700/70 dark:text-purple-300"><i class="fas fa-users mr-1"></i> Команды 2-6 чел</span>
                    <span class="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-purple-700 text-sm dark:bg-gray-700/70 dark:text-purple-300"><i class="fas fa-clock mr-1"></i> 60 мин приключений</span>
                </div>
            </div>
            ${renderFilterPanel()}
            <div id="questsSection">${renderQuests()}</div>
            <div class="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 mt-4 dark:bg-gray-800 dark:border-gray-700">
                <h2 class="text-2xl font-bold mb-5 flex items-center gap-2 text-gray-800 dark:text-gray-100"><i class="fas fa-comment-dots text-purple-500"></i> Последние отзывы</h2>
                <div class="grid md:grid-cols-2 gap-5">
                    ${reviews.map(r => `
                        <div class="bg-purple-50/40 p-4 rounded-xl dark:bg-gray-700/50">
                            <div class="flex items-center gap-2 mb-2">
                                <i class="fas fa-user-circle text-purple-500 text-xl dark:text-purple-400"></i>
                                <span class="font-bold text-gray-800 dark:text-gray-100">${r.name}</span>
                                <span class="text-xs text-gray-400 dark:text-gray-500">${r.level}</span>
                            </div>
                            <p class="text-gray-700 text-sm italic dark:text-gray-300">«${r.text.substring(0, 120)}${r.text.length > 120 ? '…' : ''}»</p>
                            <p class="text-xs text-purple-500 mt-2 dark:text-purple-400">Квест: ${r.quest}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function attachFilterEvents() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', (e) => { filters.search = e.target.value; updateQuestsDisplay(); });
    document.querySelectorAll('.type-filter').forEach(cb => cb.addEventListener('change', (e) => {
        if (e.target.checked) filters.types.push(e.target.value);
        else filters.types = filters.types.filter(t => t !== e.target.value);
        updateQuestsDisplay();
    }));
    document.querySelectorAll('.difficulty-filter').forEach(cb => cb.addEventListener('change', (e) => {
        if (e.target.checked) filters.difficulties.push(e.target.value);
        else filters.difficulties = filters.difficulties.filter(d => d !== e.target.value);
        updateQuestsDisplay();
    }));
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) statusFilter.addEventListener('change', (e) => { filters.status = e.target.value; updateQuestsDisplay(); });
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) priceFilter.addEventListener('change', (e) => { filters.priceRange = e.target.value; updateQuestsDisplay(); });
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) sortFilter.addEventListener('change', (e) => { filters.sortBy = e.target.value; updateQuestsDisplay(); });
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) resetBtn.addEventListener('click', () => {
        filters = { search: '', types: [], difficulties: [], status: 'all', priceRange: 'all', sortBy: 'rating' };
        document.querySelectorAll('.type-filter, .difficulty-filter').forEach(cb => cb.checked = false);
        if (statusFilter) statusFilter.value = 'all';
        if (priceFilter) priceFilter.value = 'all';
        if (sortFilter) sortFilter.value = 'rating';
        if (searchInput) searchInput.value = '';
        updateQuestsDisplay();
        if (typeof showToast === 'function') showToast('Фильтры сброшены', 'info');
    });
}

function updateQuestsDisplay() {
    const section = document.getElementById('questsSection');
    if (section) {
        section.innerHTML = renderQuests();
        setTimeout(() => animateCards(), 100);
        attachFavoriteListeners();
    }
}

function attachFavoriteListeners() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.removeEventListener('click', favoriteClickHandler);
        btn.addEventListener('click', favoriteClickHandler);
    });
}

function favoriteClickHandler(e) {
    const btn = e.currentTarget;
    const questId = btn.getAttribute('data-id');
    toggleFavorite(questId);
    const isFav = isFavorite(questId);
    const icon = btn.querySelector('i');
    if (isFav) {
        icon.classList.remove('text-gray-300', 'hover:text-red-400');
        icon.classList.add('text-red-500');
    } else {
        icon.classList.remove('text-red-500');
        icon.classList.add('text-gray-300', 'hover:text-red-400');
    }
}

function animateCards() {
    const cards = document.querySelectorAll('.quest-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(card => observer.observe(card));
}

// ==================== СТРАНИЦА АВТОРИЗАЦИИ (auth.html) ====================
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

function saveCurrentUser(user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showToast('Вы вышли из аккаунта', 'info');
    renderAuthPage();
}

function renderLoginRegisterForm() {
    return `
        <div class="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-purple-100 p-8 dark:bg-gray-800 dark:border-gray-700">
            <div class="text-center mb-6">
                <i class="fas fa-user-lock text-5xl text-purple-500"></i>
                <h2 class="text-2xl font-bold mt-2 text-gray-800 dark:text-gray-100">Добро пожаловать</h2>
                <p class="text-gray-500 dark:text-gray-400">Войдите или создайте аккаунт</p>
            </div>
            <div class="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button id="tabLogin" class="tab-btn flex-1 py-2 text-center font-medium transition-all">Вход</button>
                <button id="tabRegister" class="tab-btn flex-1 py-2 text-center font-medium transition-all">Регистрация</button>
            </div>
            <div id="loginForm" class="space-y-5">
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" id="loginEmail" class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="quest@example.com" required></div>
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Пароль</label><input type="password" id="loginPassword" class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="••••••••" required></div>
                <button id="loginBtn" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition">Войти</button>
                <p class="text-center text-xs text-gray-400 mt-4 dark:text-gray-500">Нет аккаунта? <a href="#" id="switchToRegister" class="text-purple-600">Зарегистрироваться</a></p>
            </div>
            <div id="registerForm" class="space-y-5 hidden">
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Имя</label><input type="text" id="regName" class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Иван Иванов" required></div>
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" id="regEmail" class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="quest@example.com" required></div>
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Пароль</label><input type="password" id="regPassword" class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="••••••••" required></div>
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Телефон (опционально)</label><input type="tel" id="regPhone" class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="+7 (XXX) XXX-XX-XX"></div>
                <button id="registerBtn" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition">Зарегистрироваться</button>
                <p class="text-center text-xs text-gray-400 mt-4 dark:text-gray-500">Уже есть аккаунт? <a href="#" id="switchToLogin" class="text-purple-600">Войти</a></p>
            </div>
        </div>
    `;
}

function renderProfile() {
    const allBookings = JSON.parse(localStorage.getItem('questBookings') || '[]');
    const userBookings = allBookings.filter(b => b.userEmail === currentUser.email);
    const favoritesIds = getFavorites();
    const favoriteQuests = favoritesIds.map(id => quests.find(q => q.id === id)).filter(q => q);
    return `
        <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-purple-100 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
            <div class="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                <div class="flex items-center gap-4 flex-wrap">
                    <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl"><i class="fas fa-user"></i></div>
                    <div class="flex-1"><h1 class="text-2xl font-bold">${currentUser.name}</h1><p class="text-purple-100">${currentUser.email}</p><p class="text-purple-200 text-sm mt-1">${currentUser.phone ? currentUser.phone : 'Телефон не указан'}</p></div>
                    <button id="logoutBtnProfile" class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition"><i class="fas fa-sign-out-alt mr-2"></i> Выйти</button>
                </div>
            </div>
            <div class="p-6">
                <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2"><i class="fas fa-calendar-alt text-purple-500"></i> История бронирований</h2>
                ${userBookings.length === 0 ? `
                    <div class="text-center py-8 text-gray-500 dark:text-gray-400"><i class="fas fa-calendar-times text-4xl mb-2 opacity-50"></i><p>У вас пока нет бронирований</p><a href="index.html" class="inline-block mt-3 text-purple-600 hover:underline">Перейти к квестам →</a></div>
                ` : `
                    <div class="space-y-3">
                        ${userBookings.map(b => `
                            <div class="booking-card bg-gray-50 rounded-xl p-4 dark:bg-gray-700">
                                <div class="flex flex-wrap justify-between items-start gap-3">
                                    <div><h3 class="font-bold text-gray-800 dark:text-gray-100">${b.questName}</h3><div class="flex flex-wrap gap-3 mt-1 text-sm"><span class="text-gray-600 dark:text-gray-300"><i class="far fa-calendar-alt mr-1"></i> ${b.date}</span><span class="text-gray-600 dark:text-gray-300"><i class="far fa-clock mr-1"></i> ${b.time}</span><span class="text-gray-600 dark:text-gray-300"><i class="fas fa-users mr-1"></i> ${b.players} чел.</span><span class="text-purple-600 dark:text-purple-400 font-semibold">${b.totalPrice} ₽</span></div>${b.comment ? `<p class="text-gray-500 text-sm mt-1 dark:text-gray-400"><i class="fas fa-comment mr-1"></i> ${b.comment}</p>` : ''}</div>
                                    <span class="text-xs px-2 py-1 rounded-full ${new Date(b.date) >= new Date() ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-400'}">${new Date(b.date) >= new Date() ? 'Актуально' : 'Прошёл'}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
                <div class="mt-8"><h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2"><i class="fas fa-heart text-purple-500"></i> Избранные квесты</h2>
                ${favoriteQuests.length === 0 ? `<div class="text-center py-8 text-gray-500 dark:text-gray-400"><i class="fas fa-heart-broken text-4xl mb-2 opacity-50"></i><p>Нет избранных квестов</p><p class="text-sm">Добавляйте квесты в избранное, чтобы они появились здесь</p></div>` : `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${favoriteQuests.map(q => `<a href="quest-detail.html?id=${q.id}" class="block bg-gray-50 rounded-xl p-3 dark:bg-gray-700 hover:shadow-md transition"><div class="flex items-center gap-3"><img src="${q.image}" alt="${q.name}" class="w-12 h-12 object-cover rounded-lg"><div><h4 class="font-semibold text-gray-800 dark:text-gray-100">${q.name}</h4><p class="text-sm text-gray-500 dark:text-gray-400">${q.type}</p></div></div></a>`).join('')}</div>
                `}</div>
                <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6"><h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2"><i class="fas fa-cog text-purple-500"></i> Настройки профиля</h2>
                <form id="profileSettingsForm" class="space-y-4 max-w-md"><div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Имя</label><input type="text" id="profileName" value="${currentUser.name}" class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"></div>
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" id="profileEmail" value="${currentUser.email}" class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"></div>
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Телефон</label><input type="tel" id="profilePhone" value="${currentUser.phone || ''}" class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"></div>
                <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition">Сохранить изменения</button></form></div>
            </div>
        </div>
    `;
}

function initFormSwitching() {
    const loginFormDiv = document.getElementById('loginForm');
    const registerFormDiv = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    function showLogin() { loginFormDiv.classList.remove('hidden'); registerFormDiv.classList.add('hidden'); tabLogin.classList.add('active'); tabRegister.classList.remove('active'); }
    function showRegister() { loginFormDiv.classList.add('hidden'); registerFormDiv.classList.remove('hidden'); tabRegister.classList.add('active'); tabLogin.classList.remove('active'); }
    tabLogin.addEventListener('click', showLogin);
    tabRegister.addEventListener('click', showRegister);
    if (switchToRegister) switchToRegister.addEventListener('click', (e) => { e.preventDefault(); showRegister(); });
    if (switchToLogin) switchToLogin.addEventListener('click', (e) => { e.preventDefault(); showLogin(); });
    document.getElementById('loginBtn').addEventListener('click', () => {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        if (!email || !password) { showToast('Заполните все поля', 'info'); return; }
        const users = JSON.parse(localStorage.getItem('questUsers') || '[]');
        const user = users.find(u => u.email === email);
        if (!user) { showToast('Пользователь не найден', 'info'); return; }
        saveCurrentUser(user);
        showToast(`Добро пожаловать, ${user.name}!`, 'success');
        renderAuthPage();
    });
    document.getElementById('registerBtn').addEventListener('click', () => {
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const phone = document.getElementById('regPhone').value.trim();
        if (!name || !email || !password) { showToast('Заполните все обязательные поля', 'info'); return; }
        let users = JSON.parse(localStorage.getItem('questUsers') || '[]');
        if (users.find(u => u.email === email)) { showToast('Пользователь с таким email уже существует', 'info'); return; }
        const newUser = { name, email, phone, registeredAt: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('questUsers', JSON.stringify(users));
        saveCurrentUser(newUser);
        showToast(`Добро пожаловать, ${name}!`, 'success');
        renderAuthPage();
    });
}

function initProfileSettings() {
    const form = document.getElementById('profileSettingsForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('profileName').value.trim();
        const newEmail = document.getElementById('profileEmail').value.trim();
        const newPhone = document.getElementById('profilePhone').value.trim();
        if (!newName || !newEmail) { showToast('Имя и email обязательны', 'info'); return; }
        currentUser.name = newName;
        currentUser.email = newEmail;
        currentUser.phone = newPhone;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        let users = JSON.parse(localStorage.getItem('questUsers') || '[]');
        const index = users.findIndex(u => u.email === newEmail);
        if (index !== -1) users[index] = currentUser;
        localStorage.setItem('questUsers', JSON.stringify(users));
        showToast('Данные обновлены', 'success');
        renderAuthPage();
    });
}

function renderAuthPage() {
    const container = document.getElementById('authContainer');
    if (currentUser) {
        container.innerHTML = renderProfile();
        document.getElementById('logoutBtnProfile')?.addEventListener('click', logout);
        initProfileSettings();
    } else {
        container.innerHTML = renderLoginRegisterForm();
        initFormSwitching();
    }
}

// ==================== СТРАНИЦА ДЕТАЛЬНОГО КВЕСТА (quest-detail.html) ====================
function getQuestFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    return quests.find(q => q.id === id) || null;
}

function renderQuestDetail() {
    const quest = getQuestFromUrl();
    const container = document.getElementById("questDetail");
    if (!quest) {
        container.innerHTML = `<div class="text-center py-16 dark:text-gray-300"><i class="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i><h2 class="text-2xl font-bold">Квест не найден</h2><a href="index.html" class="inline-block mt-6 bg-purple-600 text-white px-6 py-2 rounded-full">На главную</a></div>`;
        return;
    }
    const isOpen = quest.status === "open";
    const isFav = isFavorite(quest.id);
    let bookingHTML = "";
    if (isOpen) {
        bookingHTML = `
            <div class="bg-gray-50 rounded-xl p-5 flex flex-wrap justify-between items-center gap-4 dark:bg-gray-700">
                <div><span class="text-3xl font-bold text-purple-700 dark:text-purple-400">${quest.priceStr}</span><span class="text-gray-500 ml-1 dark:text-gray-300">за команду</span></div>
                <a href="booking.html?questId=${quest.id}&questName=${encodeURIComponent(quest.name)}&price=${quest.price}" class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition btn-primary shadow-md inline-block">Забронировать сейчас</a>
                <button id="favoriteBtnDetail" class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-purple-700 dark:text-purple-300 px-6 py-3 rounded-full font-bold transition shadow-md inline-flex items-center gap-2">
                    <i class="fas fa-heart ${isFav ? 'text-red-500' : 'text-gray-400'}"></i>
                    <span>${isFav ? 'В избранном' : 'В избранное'}</span>
                </button>
            </div>
        `;
    } else {
        bookingHTML = `
            <div class="bg-red-50 rounded-xl p-5 text-center dark:bg-red-900/30">
                <div class="flex flex-col items-center gap-3">
                    <i class="fas fa-lock text-4xl text-red-500 dark:text-red-400"></i>
                    <div><p class="text-red-700 font-semibold dark:text-red-300">Этот квест временно закрыт на реконструкцию</p><p class="text-sm text-gray-500 mt-1 dark:text-gray-400">Следите за новостями — скоро он снова откроется!</p></div>
                    <a href="index.html" class="inline-block mt-2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-full transition dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Вернуться к списку</a>
                </div>
            </div>
        `;
    }
    container.innerHTML = `
        <div class="relative">
            <img src="${quest.image}" alt="${quest.name}" class="w-full h-64 object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-6 text-white">
                <h1 class="text-3xl md:text-4xl font-bold">${quest.name}</h1>
                <p class="text-purple-200 mt-1">${quest.type}</p>
            </div>
        </div>
        <div class="p-6 md:p-8">
            <div class="flex flex-wrap gap-4 mb-6">
                <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm dark:bg-purple-900/50 dark:text-purple-300"><i class="far fa-clock mr-1"></i> ${quest.duration}</span>
                <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm dark:bg-purple-900/50 dark:text-purple-300"><i class="fas fa-users mr-1"></i> ${quest.players}</span>
                <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm dark:bg-purple-900/50 dark:text-purple-300"><i class="fas fa-chart-line mr-1"></i> Сложность: ${quest.difficulty}</span>
                <span class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm dark:bg-amber-900/50 dark:text-amber-300"><i class="fas fa-star mr-1"></i> ${quest.rating} / 5</span>
                ${!isOpen ? `<span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm dark:bg-red-900/50 dark:text-red-300"><i class="fas fa-ban mr-1"></i> Закрыт</span>` : ""}
            </div>
            <div class="mb-6"><h2 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">📖 Описание</h2><p class="text-gray-700 leading-relaxed dark:text-gray-300">${quest.fullDesc}</p></div>
            <div class="mb-6"><h2 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">🎭 Тематика</h2><p class="text-gray-700 dark:text-gray-300">${quest.theme}</p></div>
            <div class="mb-6"><h2 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">📖 Сюжет</h2><p class="text-gray-700 leading-relaxed dark:text-gray-300">${quest.story}</p></div>
            <div class="mb-6"><h2 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">✨ Особенности</h2><div class="flex flex-wrap gap-2">${quest.features.map((f) => `<span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm dark:bg-purple-900/50 dark:text-purple-300">${f}</span>`).join("")}</div></div>
            <div class="mb-6"><h2 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">🎬 По мотивам</h2><p class="text-gray-700 dark:text-gray-300"><i class="fas fa-film text-purple-500 mr-2"></i> ${quest.basedOn}</p></div>
            ${bookingHTML}
            <div class="mt-6 text-center"><a href="index.html" class="text-purple-600 hover:underline dark:text-purple-400"><i class="fas fa-arrow-left mr-1"></i> Вернуться к списку квестов</a></div>
        </div>
    `;
    const favBtn = document.getElementById('favoriteBtnDetail');
    if (favBtn) {
        favBtn.addEventListener('click', () => {
            toggleFavorite(quest.id);
            const isFavNow = isFavorite(quest.id);
            const icon = favBtn.querySelector('i');
            const span = favBtn.querySelector('span');
            if (isFavNow) {
                icon.classList.remove('text-gray-400');
                icon.classList.add('text-red-500');
                span.textContent = 'В избранном';
            } else {
                icon.classList.remove('text-red-500');
                icon.classList.add('text-gray-400');
                span.textContent = 'В избранное';
            }
        });
    }
}

// ==================== СТРАНИЦА БРОНИРОВАНИЯ (booking.html) ====================
function renderBookingPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const questId = urlParams.get('questId');
    const questName = decodeURIComponent(urlParams.get('questName') || '');
    const questPrice = parseInt(urlParams.get('price')) || 0;

    const container = document.querySelector('main');
    if (container) {
        container.innerHTML = `
            <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden dark:bg-gray-800">
                <div class="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                    <h1 class="text-2xl md:text-3xl font-bold">Бронирование квеста</h1>
                    <p class="text-purple-100 mt-1">Заполните форму, чтобы забронировать место</p>
                </div>
                <div class="p-6 md:p-8">
                    <div id="questInfo" class="bg-purple-50 rounded-xl p-4 mb-6 dark:bg-purple-900/30"></div>
                    <form id="bookingForm" class="space-y-5">
                        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Дата</label><input type="date" id="bookingDate" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"></div>
                        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Время</label><select id="bookingTime" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"><option value="">Выберите время</option><option value="10:00">10:00</option><option value="12:00">12:00</option><option value="14:00">14:00</option><option value="16:00">16:00</option><option value="18:00">18:00</option><option value="20:00">20:00</option></select></div>
                        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Количество игроков</label><select id="playersCount" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"><option value="2">2 игрока</option><option value="3">3 игрока</option><option value="4">4 игрока</option><option value="5">5 игроков</option><option value="6">6 игроков</option></select></div>
                        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ваше имя</label><input type="text" id="userName" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Иван Иванов"></div>
                        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Телефон</label><input type="tel" id="userPhone" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="+7 (XXX) XXX-XX-XX"></div>
                        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" id="userEmail" required class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="example@mail.ru"></div>
                        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Комментарий (опционально)</label><textarea id="userComment" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Особые пожелания..."></textarea></div>
                        <div class="bg-gray-50 rounded-xl p-4 dark:bg-gray-700"><div class="flex justify-between items-center mb-2"><span class="text-gray-600 dark:text-gray-300">Стоимость:</span><span id="totalPrice" class="text-xl font-bold text-purple-700 dark:text-purple-400">0 ₽</span></div><p class="text-xs text-gray-500 dark:text-gray-400">* Цена за команду, оплата на месте</p></div>
                        <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition btn-primary shadow-md"><i class="fas fa-calendar-check mr-2"></i> Забронировать</button>
                    </form>
                </div>
            </div>
        `;
        const questInfoDiv = document.getElementById('questInfo');
        if (questInfoDiv) {
            questInfoDiv.innerHTML = `<div class="flex items-center gap-3"><i class="fas fa-quest text-2xl text-purple-500"></i><div><h3 class="font-bold text-gray-800 dark:text-gray-100">${questName}</h3><p class="text-sm text-gray-600 dark:text-gray-300">Цена: от ${questPrice} ₽ за команду</p></div></div>`;
        }
        const playersSelect = document.getElementById('playersCount');
        const totalPriceSpan = document.getElementById('totalPrice');
        function updateTotalPrice() { totalPriceSpan.textContent = `${questPrice} ₽`; }
        playersSelect.addEventListener('change', updateTotalPrice);
        updateTotalPrice();
        const dateInput = document.getElementById('bookingDate');
        dateInput.min = new Date().toISOString().split('T')[0];
        const form = document.getElementById('bookingForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const booking = {
                id: Date.now(),
                questId,
                questName,
                date: dateInput.value,
                time: document.getElementById('bookingTime').value,
                players: playersSelect.value,
                userName: document.getElementById('userName').value,
                userPhone: document.getElementById('userPhone').value,
                userEmail: document.getElementById('userEmail').value,
                comment: document.getElementById('userComment').value,
                totalPrice: questPrice,
                city: currentCity,
                createdAt: new Date().toISOString()
            };
            let bookings = JSON.parse(localStorage.getItem('questBookings') || '[]');
            bookings.push(booking);
            localStorage.setItem('questBookings', JSON.stringify(bookings));
            showToast(`Бронирование квеста "${questName}" успешно создано!`, "success");
            setTimeout(() => { window.location.href = `booking-success.html?id=${booking.id}`; }, 1500);
        });
    }
}

// ==================== СТРАНИЦА УСПЕШНОГО БРОНИРОВАНИЯ (booking-success.html) ====================
function renderBookingSuccessPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = parseInt(urlParams.get('id'));
    const bookings = JSON.parse(localStorage.getItem('questBookings') || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    const detailsDiv = document.getElementById('bookingDetails');
    if (booking && detailsDiv) {
        detailsDiv.innerHTML = `<h3 class="font-bold text-gray-800 dark:text-gray-100 mb-3">Детали бронирования:</h3>
            <p><span class="font-medium">Квест:</span> ${booking.questName}</p>
            <p><span class="font-medium">Дата:</span> ${booking.date}</p>
            <p><span class="font-medium">Время:</span> ${booking.time}</p>
            <p><span class="font-medium">Количество игроков:</span> ${booking.players}</p>
            <p><span class="font-medium">Имя:</span> ${booking.userName}</p>
            <p><span class="font-medium">Телефон:</span> ${booking.userPhone}</p>
            <p><span class="font-medium">Email:</span> ${booking.userEmail}</p>
            ${booking.comment ? `<p><span class="font-medium">Комментарий:</span> ${booking.comment}</p>` : ''}
            <p class="mt-3 text-purple-600 dark:text-purple-400"><span class="font-medium">Сумма:</span> ${booking.totalPrice} ₽ (оплата на месте)</p>`;
    } else if (detailsDiv) {
        detailsDiv.innerHTML = '<p class="text-gray-500">Информация о бронировании не найдена</p>';
    }
}

// ==================== СТРАНИЦА ВЫБОРА ГОРОДА (city.html) ====================
let recentCities = JSON.parse(localStorage.getItem("recentCities") || "[]");
const citiesList = ["Москва", "Санкт-Петербург", "Казань", "Альметьевск", "Новосибирск", "Екатеринбург", "Нижний Новгород", "Самара", "Краснодар", "Челябинск", "Омск", "Ростов-на-Дону", "Уфа", "Красноярск", "Пермь", "Воронеж", "Волгоград", "Саратов"];

function renderCities() {
    const grid = document.getElementById("cityGrid");
    if (!grid) return;
    grid.innerHTML = citiesList.map(city => `
        <button data-city="${city}" class="city-btn py-2.5 px-3 rounded-xl border transition-all bg-gray-50 hover:bg-purple-100 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-purple-900/50 dark:text-gray-200">${city}</button>
    `).join('');
    document.querySelectorAll(".city-btn").forEach(btn => {
        if (btn.getAttribute("data-city") === currentCity) {
            btn.classList.add("bg-purple-600", "text-white", "border-purple-600");
            btn.classList.remove("bg-gray-50", "hover:bg-purple-100", "dark:bg-gray-700");
        } else {
            btn.classList.remove("bg-purple-600", "text-white", "border-purple-600");
            btn.classList.add("bg-gray-50", "hover:bg-purple-100", "dark:bg-gray-700");
        }
        btn.addEventListener("click", () => setCity(btn.getAttribute("data-city")));
    });
}

function renderRecentCities() {
    const container = document.getElementById("recentCities");
    if (!container) return;
    if (recentCities.length === 0) {
        container.innerHTML = '<span class="text-gray-400 text-sm">Нет недавних городов</span>';
        return;
    }
    container.innerHTML = recentCities.map(city => `
        <button data-city="${city}" class="recent-city-btn px-3 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700 text-sm hover:bg-purple-100 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300 transition">${city}</button>
    `).join('');
    document.querySelectorAll(".recent-city-btn").forEach(btn => {
        btn.addEventListener("click", () => setCity(btn.getAttribute("data-city")));
    });
}

function initCityPage() {
    const searchInput = document.getElementById("citySearchInput");
    const suggestionsDiv = document.getElementById("suggestions");
    function filterCities(query) {
        if (!query) return [];
        return citiesList.filter(city => city.toLowerCase().includes(query.toLowerCase()));
    }
    function showSuggestions() {
        const query = searchInput.value.trim();
        const matches = filterCities(query);
        if (matches.length === 0 || query === "") {
            suggestionsDiv.style.display = "none";
            return;
        }
        suggestionsDiv.innerHTML = matches.map(city => `<div data-city="${city}">${city}</div>`).join('');
        suggestionsDiv.style.display = "block";
        document.querySelectorAll("#suggestions div").forEach(div => {
            div.addEventListener("click", () => {
                const city = div.getAttribute("data-city");
                setCity(city);
                searchInput.value = "";
                suggestionsDiv.style.display = "none";
            });
        });
    }
    searchInput.addEventListener("input", showSuggestions);
    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.style.display = "none";
        }
    });
    function detectCity() {
        if (!navigator.geolocation) {
            showToast("Ваш браузер не поддерживает геолокацию", "info");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`)
                    .then(res => res.json())
                    .then(data => {
                        let city = data.address.city || data.address.town || data.address.village || data.address.municipality;
                        if (city && citiesList.includes(city)) {
                            setCity(city);
                        } else if (city) {
                            showToast(`Мы определили ${city}, но он пока не добавлен в наш список. Выберите из списка.`, "info");
                        } else {
                            showToast("Не удалось определить город", "info");
                        }
                    })
                    .catch(() => showToast("Ошибка при определении города", "info"));
            },
            () => showToast("Не удалось получить доступ к геолокации", "info")
        );
    }
    document.getElementById("detectCityBtn").addEventListener("click", detectCity);
    renderCities();
    renderRecentCities();

    // ========== ГАРАНТИЯ РАБОТЫ ТЁМНОЙ ТЕМЫ ==========
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.removeEventListener('click', toggleTheme);
        themeBtn.addEventListener('click', toggleTheme);
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    } else {
        document.documentElement.classList.remove('dark');
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
    }
}

// ==================== СТРАНИЦА НОВОСТЕЙ (улучшенная версия) ====================
let currentCategory = 'all';
let searchQuery = '';

function renderNewsCard(news) {
    return `
        <div class="news-card bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700" data-category="${news.category}" data-title="${news.title.toLowerCase()}" data-desc="${news.description.toLowerCase()}">
            <div class="h-48 overflow-hidden">
                <img src="${news.image}" alt="${news.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
            </div>
            <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">${news.category}</span>
                    <span class="text-xs text-gray-400 dark:text-gray-500"><i class="far fa-calendar-alt mr-1"></i> ${news.date}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">${news.title}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">${news.description}</p>
                <button class="read-more-btn text-purple-600 dark:text-purple-400 font-medium text-sm hover:underline flex items-center gap-1" data-id="${news.id}">
                    Читать полностью <i class="fas fa-arrow-right text-xs"></i>
                </button>
            </div>
        </div>
    `;
}

function filterAndRenderNews() {
    let filtered = [...newsData];
    
    if (currentCategory !== 'all') {
        filtered = filtered.filter(news => news.category === currentCategory);
    }
    
    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(news => 
            news.title.toLowerCase().includes(query) || 
            news.description.toLowerCase().includes(query)
        );
    }
    
    const grid = document.getElementById('newsGrid');
    const noNewsDiv = document.getElementById('noNewsMessage');
    
    if (filtered.length === 0) {
        grid.innerHTML = '';
        noNewsDiv.classList.remove('hidden');
        return;
    }
    
    noNewsDiv.classList.add('hidden');
    grid.innerHTML = filtered.map(news => renderNewsCard(news)).join('');
    
    const cards = document.querySelectorAll('.news-card');
    cards.forEach((card, index) => {
        setTimeout(() => { card.classList.add('visible'); }, index * 100);
    });
    
    attachReadMoreButtons();
}

function attachReadMoreButtons() {
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.removeEventListener('click', handleReadMore);
        btn.addEventListener('click', handleReadMore);
    });
}

function handleReadMore(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    const news = newsData.find(n => n.id === id);
    if (news) {
        document.getElementById('modalTitle').textContent = news.title;
        document.getElementById('modalDate').textContent = news.date;
        document.getElementById('modalText').textContent = news.fullText;
        document.getElementById('newsModal').classList.remove('hidden');
    }
}

function initNewsPage() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active', 'bg-purple-600', 'text-white'));
            tab.classList.add('active', 'bg-purple-600', 'text-white');
            currentCategory = tab.getAttribute('data-cat');
            filterAndRenderNews();
        });
    });
    
    const searchInput = document.getElementById('searchNews');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            filterAndRenderNews();
        });
    }
    
    const modal = document.getElementById('newsModal');
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }
    
    filterAndRenderNews();
}

// ==================== ОБЩАЯ ИНИЦИАЛИЗАЦИЯ СТРАНИЦ ====================
function initPage() {
    initCommon();
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        const contentDiv = document.getElementById("appContent");
        if (contentDiv) {
            contentDiv.innerHTML = renderHomePage();
            attachFilterEvents();
            setTimeout(() => animateCards(), 200);
            attachFavoriteListeners();
        }
    } else if (path.includes('auth.html')) {
        renderAuthPage();
    } else if (path.includes('quest-detail.html')) {
        renderQuestDetail();
    } else if (path.includes('booking.html')) {
        renderBookingPage();
    } else if (path.includes('booking-success.html')) {
        renderBookingSuccessPage();
    } else if (path.includes('city.html')) {
        initCityPage();
    } else if (path.includes('news.html')) {
        initNewsPage();
    }
}

document.addEventListener('DOMContentLoaded', initPage);