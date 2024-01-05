using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Book.DataAccessLayer.Model
{
    public class BookModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Author { get; set; }
        public string Genre { get; set; }
        public string Description { get; set; }
        public Boolean IsAvailable { get; set; } = true;
        public string LentByUserId { get; set; }
        public string LenterName { get; set; } = "";
        public int Ratings { get; set; } = 0;
        public string CurrentlyBorrowedByUserId { get; set; } = "";


    }
}
