using Book.DataAccessLayer.Model;
using Book.DataAccessLayer.Repository.Book;
using BookStore.DataAccessLayer.Context;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Book.BusinessLayer.Service.Book
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepository;
        public BookService(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task AddBookAsync(BookModel book)
        {
            await _bookRepository.AddBookAsync(book);

        }
        public async Task DeleteBookAsync(int id)
        {
            await _bookRepository.DeleteBookAsync(id);
        }


        public BookModel GetBookById(int id)
        {
            return _bookRepository.GetBookById(id);
        }

        public async Task<IEnumerable<BookModel>> GetAllBooks()
        {
            return await _bookRepository.GetAllBooks();
        }

        public int CountTotalBook()
        {
            return _bookRepository.CountTotalBook();
        }
        public async Task<IEnumerable<BookModel>> FilterByAuthor(string Author)
        {
            return await _bookRepository.FilterByAuthor(Author);
        }
     
        public async Task<IEnumerable<BookModel>> FilterByGenre(string Genre)
        {
            return await _bookRepository.FilterByGenre(Genre);
        }

        public async Task BorrowBook(int id, string borrowUserId)
        {
             await _bookRepository.BorrowBook(id, borrowUserId);

        }

        public async Task<int> GetToken(string userId)
        {
            return await _bookRepository.GetToken(userId);
        }

        public async Task<IEnumerable<BookModel>> MyBooks(string userId)
        {
            return await _bookRepository.MyBooks(userId);
        }

        public async Task<IEnumerable<BookModel>> BorrowedBooks(string userId)
        {
            return await _bookRepository.BorrowedBooks(userId);
        }

    }

}
