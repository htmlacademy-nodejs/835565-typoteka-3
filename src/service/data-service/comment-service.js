'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../const`);

class CommentService {
  constructor() {
    this._comments = [];
  }

  getComments(offer) {
    this._comments = offer.comments;
  }

  create(comment) {
    const newComment = Object.assign({id: nanoid(MAX_ID_LENGTH)}, comment);
    this._comments.push(newComment);
    return newComment;
  }

  delete(id) {
    const deletedComment = this._comments.find((item) => item.id === id);
    if (!deletedComment) {
      return null;
    }
    this._comments = this._comments.filter((item) => item.id !== id);
    return deletedComment;
  }

  findAll() {
    return this._comments;
  }
}

module.exports = CommentService;
