using Microsoft.EntityFrameworkCore.Migrations;
using System;

#nullable disable

namespace WebApplication1.Migrations
{
    public partial class AddDateFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DeliveryDate",
                table: "Shipments",
                type: "timestamp with time zone",
                nullable: true);
                
            migrationBuilder.AddColumn<DateTime>(
                name: "UsedAt",
                table: "DeliveryOtps",
                type: "timestamp with time zone",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeliveryDate",
                table: "Shipments");
                
            migrationBuilder.DropColumn(
                name: "UsedAt",
                table: "DeliveryOtps");
        }
    }
} 