
/* Список всех категорий */
SELECT * FROM categories;

/* Список непустых категорий */
SELECT id, name FROM categories
  JOIN articles_categories
  ON id = category_id
  GROUP BY id;

/* Категории с количеством статей */
SELECT id, name, count(article_id) FROM categories
  LEFT JOIN articles_categories
  ON id = category_id
  GROUP BY id;

/* Список статей, сначала свежие */
SELECT articles.*,
  count(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  GROUP BY articles.id, users.id
  ORDER BY articles.date DESC;

/* Детальная информация о статье */
SELECT articles.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
WHERE articles.id = 4
  GROUP BY articles.id, users.id;

/* Свежие комментарии */
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.date DESC
  LIMIT 5;

/* Комментарии к статье, сначала свежие */
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 5
  ORDER BY comments.date DESC;

/* Обновить заголовок */
UPDATE articles
SET title = 'New Title'
WHERE id = 2