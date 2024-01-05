using Book.DataAccessLayer.Model;
using BookStore.DataAccessLayer.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Book.DataAccessLayer.Repository.Book
{
    public class BookRepository : IBookRepository
    {
        private readonly AppDbContext _appDbContext;
        private readonly UserManager<ApplicationUser> _userManager;


        public BookRepository(AppDbContext appDbContext, UserManager<ApplicationUser> userManager)
        {
            _appDbContext = appDbContext;
            _userManager = userManager;

        }

        public async Task AddBookAsync(BookModel book)
        {
            if (book != null)
            {
                _appDbContext.Books.Add(book);
                book.IsAvailable = true;
                await _appDbContext.SaveChangesAsync();
            }
        }

        public async Task DeleteBookAsync(int id)
        {
            var book = _appDbContext.Books.FirstOrDefault(p => p.Id == id);

            if (book != null)
            {
                _appDbContext.Books.Remove(book);
                await _appDbContext.SaveChangesAsync();
            }
        }

        public BookModel GetBookById(int id)
        {
            var book = _appDbContext.Books.FirstOrDefault(p => p.Id == id);
            if (book == null)
            {
                return null;
            }
            return book;
        }


        public async Task<IEnumerable<BookModel>> GetAllBooks()
        {
            return await _appDbContext.Books.ToListAsync();
        }

        public int CountTotalBook()
        {
            return _appDbContext.Books.Count();
        }

        public async Task<IEnumerable<BookModel>> FilterByAuthor(string Author)
        {
            var book = await _appDbContext.Books.Where(p => p.Author == Author).ToListAsync();
            return book;
        }
      
        public async Task<IEnumerable<BookModel>> FilterByGenre(string Genre)
        {
            var book = await _appDbContext.Books.Where(p => p.Genre == Genre).ToListAsync();
            return book;
        }
       

        public async Task BorrowBook(int id, string borrowUserId)
        {
            try
            {
                var book = _appDbContext.Books.FirstOrDefault(p => p.Id == id);

                if (book != null && book.IsAvailable)
                {
                    var borrowUser = await _userManager.FindByIdAsync(borrowUserId);
                    var lentUser = await _userManager.FindByIdAsync(book.LentByUserId);

                    // if the book is not already borrowed by someone else
                    if (string.IsNullOrEmpty(book.CurrentlyBorrowedByUserId))
                    {
                        if (borrowUser != null && lentUser != null && borrowUser.TokensAvailable > 0)
                        {
                            // Update borrow user
                            borrowUser.BooksBorrowed += 1;
                            borrowUser.TokensAvailable -= 1;
                            var borrowResult = await _userManager.UpdateAsync(borrowUser);

                            // Update lent user
                            lentUser.BooksLent += 1;
                            lentUser.TokensAvailable += 1;
                            var lentResult = await _userManager.UpdateAsync(lentUser);

                            // Update book availability
                            book.IsAvailable = false;
                            book.CurrentlyBorrowedByUserId = borrowUserId;

                            _appDbContext.Books.Update(book);

                            await _appDbContext.SaveChangesAsync();
                        }
                        else
                        {
                            // Insufficient tokens or invalid user
                            throw new InvalidOperationException("Unable to borrow the book. Insufficient tokens or invalid user.");
                        }
                    }
                    else
                    {
                        // Book is already borrowed by someone else
                        throw new InvalidOperationException("The book is already borrowed by another user.");
                    }
                }
                else
                {
                    // Book not found or not available
                    throw new KeyNotFoundException("Book not found or not available for borrowing.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while borrowing the book.", ex);
            }
        }

        public async Task<int> GetToken(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if(user!= null)
            {
                return user.TokensAvailable;

            }
            return 0;
        }

        public async Task<IEnumerable<BookModel>> MyBooks(string userId)
        {
          return await _appDbContext.Books.Where(p => p.LentByUserId == userId).ToListAsync();
        }

        public async Task<IEnumerable<BookModel>> BorrowedBooks(string userId)
        {
            return await _appDbContext.Books.Where(p => p.CurrentlyBorrowedByUserId == userId).ToListAsync();
        }

    }
}
