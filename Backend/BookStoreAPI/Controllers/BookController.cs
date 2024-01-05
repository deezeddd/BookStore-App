using Book.BusinessLayer.Service.Book;
using Book.DataAccessLayer.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace BookStoreAPI.Controllers
{
    [ApiController]
    [Route("api/")]
    public class BookController: Controller
    {
       
        private readonly IBookService _bookService;


        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }



        [HttpPost("AddBook")]

        public async Task<IActionResult> AddBook([FromBody] BookModel book)
        {
            if (ModelState.IsValid)
            {
                await _bookService.AddBookAsync(book);
                return Ok(new
                {
                    message = "Book Added Successfully"
                });
            }
            return BadRequest(ModelState);

        }

        [HttpDelete("DeleteBook/{id}")]

        public async Task<IActionResult> DeleteBook([FromRoute] int id)
        {
            if (ModelState.IsValid)
            {
                var book = _bookService.GetBookById(id);
                if (book != null)
                {
                    await _bookService.DeleteBookAsync(id);
                    return Ok(new
                    {
                        book,
                        message = "Book deleted Successfully"
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        message = "Book doesn't exist"
                    });
                }
            }
            { return BadRequest(ModelState); }

        }


        [HttpGet("GetBookById/{id}")]
        public IActionResult GetBookById([FromRoute] int id)
        {
            var book = _bookService.GetBookById(id);
            if (book != null)
            {
                return Ok(book);
            }
            return BadRequest(new
            {
                message = "Book Doesn't Exist"
            });
        }

        [HttpGet("GetAllBooks")]

        public async Task<IActionResult> GetAllBooks()
        {
            var bookList = await _bookService.GetAllBooks();
            var count = _bookService.CountTotalBook();
            if (count == 0)
            {
                return BadRequest(new
                {
                    message = "No Book Available"
                });
            }
            return Ok(bookList);
        }

        [HttpGet("FilterByAuthor")]

        public async Task<IActionResult> FilterByAuthor(string Author)
        {
            var bookList = await _bookService.FilterByAuthor(Author);
            if (bookList == null)
            {
                return NotFound();
            }
            return Ok(bookList);
        }


        [HttpGet("FilterByGenre")]

        public async Task<IActionResult> FilterByGenre(string Genre)
        {
            var bookList = await _bookService.FilterByGenre(Genre);
            if (bookList == null)
            {
                return NotFound();
            }
            return Ok(bookList);
        }

        [HttpPost("BorrowBook")]

        public async Task<IActionResult> BorrowBook(int id, string borrowUserId)
        {
            try
            {
                await _bookService.BorrowBook(id, borrowUserId);

                return Ok(new
                {
                    message = "Book successfully borrowed."
                });
            }
            catch (Exception ex)
            {
                
                return BadRequest(new
                {
                    details = ex.Message
                });
            }
        }


        [HttpGet("GetUserToken")]
        public async Task<int> GetToken(string userId)
        {
            return await _bookService.GetToken(userId);
        }


        [HttpGet("MyBooks")]
        public async Task<IEnumerable<BookModel>> MyBooks(string userId)
        {
            return await _bookService.MyBooks(userId);
        }

        [HttpGet("BorrowedBooks")]
        public async Task<IEnumerable<BookModel>> BorrowedBooks(string userId)
        {
            return await _bookService.BorrowedBooks(userId);
        }



    }
}
