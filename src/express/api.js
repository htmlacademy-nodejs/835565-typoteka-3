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

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  getArticles({user, limit, offset, needComments} = {}) {
    return this._load(`/articles`, {params: {user, limit, offset, needComments}});
  }

  getArticle({id, viewMode}) {
    return this._load(`/articles/${id}`, {params: {viewMode}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories({needCount}) {
    return this._load(`/categories`, {params: {needCount}});
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
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};

