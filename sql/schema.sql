DROP TABLE IF EXISTS articles_categories;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories
  (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL
  );

CREATE TABLE users
  (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(50)
  );

CREATE TABLE articles
  (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    announce VARCHAR(255) NOT NULL,
    fulltext text,
    picture VARCHAR(50),
    date DATE DEFAULT CURRENT_DATE,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );

CREATE TABLE comments
  (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    article_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    text text NOT NULL,
    author VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );

CREATE TABLE articles_categories
  (
    article_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),
    FOREIGN KEY (article_id) REFERENCES articles(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );

CREATE INDEX ON articles(title);
