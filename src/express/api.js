'use strict';

const axios = require(`axios`);
const {TIMEOUT, DEFAULT_PORT_SERVER, HttpMethod} = require(`../const`);

const port = process.env.API_PORT || DEFAULT_PORT_SERVER;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({user, limit, offset, needComments} = {}) {
    return this._load(`/articles`, {params: {user, limit, offset, needComments}});
  }

  getArticle(id, comments) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  getComments({limit, needArticles}) {
    return this._load(`/comments`, {params: {limit, needArticles}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editArticle(articleId, data) {
    return this._load(`/articles/${articleId}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(articleId, data) {
    return this._load(`/articles/${articleId}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};

