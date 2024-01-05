using Book.BusinessLayer.Service.Account;
using Book.BusinessLayer.Service.Book;
using Book.DataAccessLayer.Model;
using Book.DataAccessLayer.Repository.Account;
using Book.DataAccessLayer.Repository.Book;
using BookStore.DataAccessLayer.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
ConfigurationManager configuration = builder.Configuration;

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//CORS
builder.Services.AddCors(option =>
{
    option.AddPolicy("MyPolicy", builder =>
    {
        builder.AllowAnyOrigin()
        .AllowAnyMethod()
       .AllowAnyHeader();
    });
});

//DB CONNECTION
builder.Services.AddDbContext<AppDbContext>(option =>
{
    option.UseSqlServer("Data Source=IN-PG03521Y;Initial Catalog=BookStoreDb-1;Integrated Security=True;");
});

// IdentityFramework
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(option =>
{
    option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
               .AddJwtBearer(option =>
               {
                   option.SaveToken = true;
                   option.RequireHttpsMetadata = false;
                   option.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
                   {
                       ValidateIssuer = true,
                       ValidateAudience = true,
                       ValidAudience = configuration["JWT:ValidAudience"],
                       ValidIssuer = configuration["JWT:ValidIssuer"],
                       IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
                   };
               });

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = true;
    options.Password.RequiredUniqueChars = 1;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = false;


});
builder.Services.AddAuthentication("CustomCookieScheme")
    .AddCookie("CustomCookieScheme", options =>
    {
        options.Cookie.Name = "UserCookie";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        };
    });

//Repostiories
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IBookRepository, BookRepository>();
builder.Services.AddScoped<IBookService, BookService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    var roles = new[] { "Admin", "User" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }
}

using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    // //User - 1
    string email = "Vedant@user.com";
    string password = "User@123";

    // //User - 2
    string email1 = "user1@user.com";
    string password1 = "User@123";

    // //User - 3
    string email2 = "user2@user.com";
    string password2 = "User@123";

    // //User - 4
    string email3 = "user3@user.com";
    string password3 = "User@123";



    if (await userManager.FindByEmailAsync(email2) == null)
    {
        var user1 = new ApplicationUser
        {
            UserName = email,
            Email = email,
            Name = "Vedant"
        };

        var user2 = new ApplicationUser
        {
            UserName = email1,
            Email = email1,
            Name = "User1"
        };
        var user3 = new ApplicationUser
        {
            UserName = email2,
            Email = email2,
            Name = "User2"
        };
        var user4 = new ApplicationUser
        {
            UserName = email3,
            Email = email3,
            Name = "User3"
        };



        if (user1 != null)
        {
            await userManager.CreateAsync(user1, password1);
            await userManager.AddToRoleAsync(user1, "User");
        }
        if (user2 != null)
        {
            await userManager.CreateAsync(user2, password1);
            await userManager.AddToRoleAsync(user2, "User");
        }
        if (user3 != null)
        {
            await userManager.CreateAsync(user3, password1);
            await userManager.AddToRoleAsync(user3, "User");
        }

        if (user4 != null)
        {
            await userManager.CreateAsync(user4, password);
            await userManager.AddToRoleAsync(user4, "User");
        }
    }

}


app.UseCors("MyPolicy");
app.Run();
