
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf95', 'Иван', 'Иванов', 'avatar1.jpg'),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf93', 'Пётр', 'Петров', 'avatar2.jpg');
INSERT INTO categories(name) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо'),
('Наука'),
('Физика'),
('Математика'),
('Антропология'),
('Самообразование'),
('Саморазвитие'),
('Психология');
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(user_id, title, date, announce, fullText, picture) VALUES
(1, 'Как перестать беспокоиться и начать жить.', '2021-08-06T20:59:07+03:00', 'Внушение старо как мир. Словесное воздействие на психику больных использовали с лечебной целью Платон, Аристотель, Гиппократ.', 'Тело взрослого человека образуют около тридцати триллионов клеток. Самовнушением и внушением можно добиться и объективно регистрируемых общих изменений в организме. Есть только одна загвоздка – найти медицинский спирт непросто. Ёлки — это не просто красивое дерево. Это прочная древесина. Производят ли чёрные дыры тепловое излучение, как это предсказывает теория? Сегодня мы вспомним про самые необычные объекты нашей Вселенной. Такие как холодная звезда, одинокая планета и невероятная черная дыра. Эмбриологически все ткани человеческого тела происходят из трёх зародышевых листков — энтодермы, мезодермы и эктодермы. Исследования последнего десятилетия в области когнитивной нейронауки позволяют существенно уточнить детали того, как математика связана с нашим мозгом и сознанием. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Он написал больше 30 хитов. Как начать действовать? Для начала просто соберитесь. Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Существуют ли нелокальные явления в квантовой физике? Простые ежедневные упражнения помогут достичь успеха. Внушение старо как мир. Словесное воздействие на психику больных использовали с лечебной целью Платон, Аристотель, Гиппократ. Язык Python обладает некоторыми примечательными особенностями, которые обуславливают его широкое распространение. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Собрать камни бесконечности легко, если вы прирожденный герой. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Получившуюся жидкость перелейте во флакончик с распылителем. Такие обычно встречаются в travel-наборах из косметических магазинов. Тело человека образовано клетками различных типов, характерным образом организующихся в ткани.', '3.jpg'),
(2, 'Как собрать камни бесконечности.', '2021-07-29T20:59:07+03:00', 'Тело человека образовано клетками различных типов, характерным образом организующихся в ткани. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Внушение старо как мир. Словесное воздействие на психику больных использовали с лечебной целью Платон, Аристотель, Гиппократ.', 'Получившуюся жидкость перелейте во флакончик с распылителем. Такие обычно встречаются в travel-наборах из косметических магазинов. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Язык Python обладает некоторыми примечательными особенностями, которые обуславливают его широкое распространение. Тело взрослого человека образуют около тридцати триллионов клеток. Есть только одна загвоздка – найти медицинский спирт непросто. Самовнушением и внушением можно добиться и объективно регистрируемых общих изменений в организме. Сегодня мы вспомним про самые необычные объекты нашей Вселенной. Такие как холодная звезда, одинокая планета и невероятная черная дыра. Существуют ли нелокальные явления в квантовой физике? Это один из лучших рок-музыкантов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Взгляды на природу математической реальности располагаются между двумя крайностями. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Производят ли чёрные дыры тепловое излучение, как это предсказывает теория? Как начать действовать? Для начала просто соберитесь. 0дно из основных свойств времени – это его способность изменяться только в одном направлении. Собрать камни бесконечности легко, если вы прирожденный герой. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.', '1.jpg'),
(1, 'Путешествие сквозь пространство-время.', '2021-07-30T20:59:07+03:00', 'Производят ли чёрные дыры тепловое излучение, как это предсказывает теория? Внушение старо как мир. Словесное воздействие на психику больных использовали с лечебной целью Платон, Аристотель, Гиппократ. Взгляды на природу математической реальности располагаются между двумя крайностями.', 'Тело взрослого человека образуют около тридцати триллионов клеток. Это один из лучших рок-музыкантов. Есть только одна загвоздка – найти медицинский спирт непросто. Исследования последнего десятилетия в области когнитивной нейронауки позволяют существенно уточнить детали того, как математика связана с нашим мозгом и сознанием. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Достичь успеха помогут ежедневные повторения. Самовнушением и внушением можно добиться и объективно регистрируемых общих изменений в организме. Тело человека образовано клетками различных типов, характерным образом организующихся в ткани. Небесные светила ассоциируются у нас с чем-то невероятно горячим, однако существуют и исключения. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Язык программирования Python 3 — это мощный инструмент для создания программ самого разнообразного назначения, доступный даже для новичков. Как начать действовать? Для начала просто соберитесь. Эмбриологически все ткани человеческого тела происходят из трёх зародышевых листков — энтодермы, мезодермы и эктодермы. Некоторые из этих проблем носят теоретический характер. И некоторые из них тесно взаимосвязаны. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.', '2.jpg'),
(1, 'Самые сложные загадки физики.', '2021-08-04T20:59:07+03:00', 'Тело человека образовано клетками различных типов, характерным образом организующихся в ткани. Эмбриологически все ткани человеческого тела происходят из трёх зародышевых листков — энтодермы, мезодермы и эктодермы.', 'Как начать действовать? Для начала просто соберитесь. Язык программирования Python 3 — это мощный инструмент для создания программ самого разнообразного назначения, доступный даже для новичков. Преобразования Галилея были основаны на гипотезе полной независимости времени и пространства. Отсюда и следовал абсолютный характер, приписывавшийся этим понятиям. Золотое сечение — соотношение двух величин, гармоническая пропорция. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения. Внушение старо как мир. Словесное воздействие на психику больных использовали с лечебной целью Платон, Аристотель, Гиппократ. Собрать камни бесконечности легко, если вы прирожденный герой. Сегодня мы вспомним про самые необычные объекты нашей Вселенной. Такие как холодная звезда, одинокая планета и невероятная черная дыра. Простые ежедневные упражнения помогут достичь успеха. Взгляды на природу математической реальности располагаются между двумя крайностями. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. 0дно из основных свойств времени – это его способность изменяться только в одном направлении. Самовнушением и внушением можно добиться и объективно регистрируемых общих изменений в организме. Небесные светила ассоциируются у нас с чем-то невероятно горячим, однако существуют и исключения. Тело взрослого человека образуют около тридцати триллионов клеток. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Эмбриологически все ткани человеческого тела происходят из трёх зародышевых листков — энтодермы, мезодермы и эктодермы. Перед нами газовый гигант, масса которого в шесть раз больше массы Юпитера. Находится это небесное тело на расстоянии 80 световых лет от Земли. Получившуюся жидкость перелейте во флакончик с распылителем. Такие обычно встречаются в travel-наборах из косметических магазинов. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Есть только одна загвоздка – найти медицинский спирт непросто. Ёлки — это не просто красивое дерево. Это прочная древесина. Язык Python обладает некоторыми примечательными особенностями, которые обуславливают его широкое распространение. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Производят ли чёрные дыры тепловое излучение, как это предсказывает теория? Исследования последнего десятилетия в области когнитивной нейронауки позволяют существенно уточнить детали того, как математика связана с нашим мозгом и сознанием.', '1.jpg'),
(1, 'Путешествие сквозь пространство-время.', '2021-07-27T20:59:07+03:00', 'Исследования последнего десятилетия в области когнитивной нейронауки позволяют существенно уточнить детали того, как математика связана с нашим мозгом и сознанием. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.', 'Есть только одна загвоздка – найти медицинский спирт непросто. Некоторые из этих проблем носят теоретический характер. И некоторые из них тесно взаимосвязаны. Золотое сечение — соотношение двух величин, гармоническая пропорция. Язык программирования Python 3 — это мощный инструмент для создания программ самого разнообразного назначения, доступный даже для новичков. Небесные светила ассоциируются у нас с чем-то невероятно горячим, однако существуют и исключения. Ёлки — это не просто красивое дерево. Это прочная древесина. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Собрать камни бесконечности легко, если вы прирожденный герой. Исследования последнего десятилетия в области когнитивной нейронауки позволяют существенно уточнить детали того, как математика связана с нашим мозгом и сознанием. Как начать действовать? Для начала просто соберитесь. Тело взрослого человека образуют около тридцати триллионов клеток. Язык Python обладает некоторыми примечательными особенностями, которые обуславливают его широкое распространение. 0дно из основных свойств времени – это его способность изменяться только в одном направлении. Сегодня мы вспомним про самые необычные объекты нашей Вселенной. Такие как холодная звезда, одинокая планета и невероятная черная дыра. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Он написал больше 30 хитов. Достичь успеха помогут ежедневные повторения. Существуют ли нелокальные явления в квантовой физике? Эмбриологически все ткани человеческого тела происходят из трёх зародышевых листков — энтодермы, мезодермы и эктодермы. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Производят ли чёрные дыры тепловое излучение, как это предсказывает теория? Тело человека образовано клетками различных типов, характерным образом организующихся в ткани. Перед нами газовый гигант, масса которого в шесть раз больше массы Юпитера. Находится это небесное тело на расстоянии 80 световых лет от Земли. Первая большая ёлка была установлена только в 1938 году. Взгляды на природу математической реальности располагаются между двумя крайностями. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.', '1.jpg');
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
(1, 15),
(1, 13),
(1, 9),
(2, 6),
(2, 2),
(3, 16),
(3, 10),
(3, 2),
(4, 4),
(4, 15),
(4, 2),
(5, 6),
(5, 7),
(5, 4);
ALTER TABLE articles_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(text, user_id, article_id) VALUES
('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', 2, 1),
('Согласен с автором!', 1, 1),
('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', 2, 1),
('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', 1, 1),
('Согласен с автором!', 2, 2),
('Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!', 1, 2),
('Согласен с автором! Планируете записать видосик на эту тему?', 2, 3),
('Хочу такую же футболку :-) Согласен с автором!', 2, 3),
('Мне кажется или я уже читал это где-то? Хочу такую же футболку :-)', 1, 3),
('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?', 2, 3),
('Это где ж такие красоты?', 1, 4),
('Планируете записать видосик на эту тему?', 1, 4),
('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', 2, 4),
('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?', 1, 4),
('Совсем немного...', 1, 5),
('Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то?', 2, 5);
ALTER TABLE comments ENABLE TRIGGER ALL;