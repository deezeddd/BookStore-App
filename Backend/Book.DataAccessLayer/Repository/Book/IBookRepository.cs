using Book.DataAccessLayer.Model;
using BookStore.DataAccessLayer.Context;
using Microsoft.AspNetCore.Mvc;

namespace Book.DataAccessLayer.Repository.Book
{
    public interface IBookRepository
    {
        Task AddBookAsync(BookModel book);
        Task DeleteBookAsync(int id);
        public BookModel GetBookById(int id);
        public Task<IEnumerable<BookModel>> GetAllBooks();
        public int CountTotalBook();
        public Task<IEnumerable<BookModel>> FilterByAuthor(string Author);
        public Task<IEnumerable<BookModel>> FilterByGenre(string Genre);
        public Task BorrowBook(int id, string borrowUserId);
        public Task<int> GetToken(string userId);

        public Task<IEnumerable<BookModel>> MyBooks(string userId);

        public Task<IEnumerable<BookModel>> BorrowedBooks(string userId);
      


    }
}