using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Book.DataAccessLayer.Migrations
{
    public partial class updatebookmodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LenterName",
                table: "Books",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Ratings",
                table: "Books",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LenterName",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "Ratings",
                table: "Books");
        }
    }
}
