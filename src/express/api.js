'use strict';

const axios = require(`axios`);
const {TIMEOUT, DEFAULT_PORT_SERVER, API_PREFIX, HttpMethod} = require(`../const`);

const port = process.env.API_PORT || DEFAULT_PORT_SERVER;
const defaultUrl = `http://localhost:${port}${API_PREFIX}/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  auth({email, password}) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  getArticles({userId, limit, offset, needComments} = {}) {
    return this._load(`/articles`, {params: {userId, limit, offset, needComments}});
  }

  getArticle({id, userId, viewMode}) {
    return this._load(`/articles/${id}`, {params: {userId, viewMode}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories({needCount}) {
    return this._load(`/categories`, {params: {needCount}});
  }

  getCategory({categoryId, limit, offset}) {
    return this._load(`/categories/${categoryId}`, {params: {limit, offset}});
  }

  getComments({limit} = {}) {
    return this._load(`/comments`, {params: {limit}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editArticle({id, data}) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  createComment({id, data}) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  deleteComment({id, commentId}) {
    return this._load(`/articles/${id}/comments/${commentId}`, {
      method: HttpMethod.DELETE
    });
  }

  createCategory(data) {
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data
    });
  }

  editCategory({id, data}) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteCategory(id) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};

