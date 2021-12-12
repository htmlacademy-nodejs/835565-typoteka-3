/**
 * Constants
 */
const DEFAULT_PORT_SERVER = 3000;
const ARTICLES_PER_PAGE = 8;
const SocketAction = {
  CREATE_ARTICLE: `article:created`,
  CREATE_COMMENT: `comment:created`,
};

/**
 * Utility functions
 */
const parseDate = (dateString) => {
  const date = new Date(dateString);
  let [year, month, day, hours, minutes] = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];

  const pad = (number) => (number < 10 ? `0${number}` : number);

  return `${pad(day)}.${pad(month)}.${year}, ${pad(hours)}:${pad(minutes)}`;
};

const getVisibleText = (text, limit) => (text.length > limit)
  ? text.slice(0, limit).concat(`...`)
  : text;

const createCategoriesElement = (categories) => {
  const fragment = document.createDocumentFragment();

  categories.forEach((category) => {
    const categoryItemElement = document.createElement(`li`);
    categoryItemElement.classList.add(`preview__breadcrumbs-item`);

    const categoryLinkElement = document.createElement(`a`);
    categoryLinkElement.classList.add(`preview__breadcrumbs-link`);
    categoryLinkElement.href = `/articles/category/${category.id}`;
    categoryLinkElement.textContent = category.name;

    categoryItemElement.append(categoryLinkElement);
    fragment.append(categoryItemElement);
  });

  return fragment;
};

const createArticleElement = (article) => {
  const articleTemplate = document.querySelector(`#preview-template`);
  const articleCardElement = articleTemplate.cloneNode(true).content;

  if (article.previewPicture) {
    articleCardElement.querySelector(`.preview__background img`)
      .src = `../../upload/img/${article.previewPicture}`;
  } else {
    articleCardElement.querySelector(`.preview__background`).remove();
  }

  articleCardElement.querySelector(`.preview__time`)
    .dateTime = article.createdAt;
  articleCardElement.querySelector(`.preview__time`)
    .textContent = parseDate(article.createdAt);
  articleCardElement.querySelector(`.preview__name a`)
    .href = `/articles/${article.id}`;
  articleCardElement.querySelector(`.preview__name a`)
    .textContent = article.title;
  articleCardElement.querySelector(`.preview__text`)
    .textContent = article.announce;
  articleCardElement.querySelector(`.preview__comment`)
    .href = `/articles/${article.id}`;
  articleCardElement.querySelector(`.preview__comment-count`)
    .textContent = article.comments.length;

  articleCardElement
    .querySelector(`.preview__breadcrumbs`)
    .append(createCategoriesElement(article.categories));

  return articleCardElement;
};

const createCommentElement = (comment) => {
  const commentTemplate = document.querySelector(`#comment-template`);
  const commentElement = commentTemplate.cloneNode(true).content;

  commentElement.querySelector(`.last__list-image`).src = comment.user.avatarSmall
    ? `../upload/img/${comment.user.avatarSmall}`
    : `../../img/blank_user-small.png`;
  commentElement.querySelector(`.last__list-name`)
    .textContent = `${comment.user.firstName} ${comment.user.lastName}`
  commentElement.querySelector(`.last__list-link`)
    .href = `/articles/${comment.articleId}`;
  commentElement.querySelector(`.last__list-link`)
    .textContent = getVisibleText(comment.text, TextVisibleLimit.COMMENT);

  return commentElement;
};


/**
 * Socket initialization,
 * listentng to events
 */
(() => {
  const SERVER_URL = `http://localhost:${DEFAULT_PORT_SERVER}`;
  const socket = io(SERVER_URL);

  const updatePreviewList = (article) => {
    const previewListElement = document.querySelector(`.preview__list`);
    const previewItems = [...previewListElement.querySelectorAll(`.preview__item`)];
    const newPreviewItem = createArticleElement(article);

    for (const previewItem of previewItems) {
      const timeElement = previewItem.querySelector(`time`);

      if (timeElement.dateTime <= article.createdAt) {
        previewListElement.insertBefore(newPreviewItem, previewItem);

        if (previewItems.length === ARTICLES_PER_PAGE) {
          previewItems[previewItems.length - 1].remove();
        }
        return;
      }
    }
  };

  const updateLastCommentsList = (comment) => {
    const lastCommentsList = document.querySelector(`.last__list`);
    const lastComments = lastCommentsList.querySelectorAll(`.last__list-item`);

    if (lastComments.length === LAST_COMMENTS_MAX_NUM) {
      lastComments[lastComments.length - 1].remove();
    }

    lastCommentsList.prepend(createCommentElement(comment));
  };

  socket.addEventListener(SocketAction.CREATE_ARTICLE, (article) => {
    updatePreviewList(article);
  });
})();
