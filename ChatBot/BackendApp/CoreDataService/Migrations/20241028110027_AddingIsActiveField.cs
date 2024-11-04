using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoreDataService.Migrations
{
    /// <inheritdoc />
    public partial class AddingIsActiveField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "QueryHistories",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "QueryHistories");
        }
    }
}
