using Microsoft.AspNetCore.Identity;


namespace Book.DataAccessLayer.Model
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public int TokensAvailable { get; set; } = 2;
        public int BooksBorrowed { get; set; } = 0;
        public int BooksLent { get; set; } = 0;

    }
}
