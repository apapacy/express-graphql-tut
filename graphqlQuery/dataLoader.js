const DataLoader = require('dataloader')
const mongoSchema = require('../mongoSchema');

module.exports = () => ({
  bookLoader: new DataLoader(async ids => {
    const data = await mongoSchema.Book.find({ _id: { $in: ids }}).populate('authors').exec();
    const books = data.reduce((obj, item) => (obj[item._id] = item) && obj, {})
    return ids.map(id => books[id]);
  }),
  authorLoader: new DataLoader(async ids => {
    const data = await mongoSchema.Author.find({ _id: { $in: ids }}).populate('books').exec();
    const authors = data.reduce((obj, item) => (obj[item._id] = item) && obj, {})
    return ids.map(id => authors[id]);
  })
});
