using Book.BusinessLayer.Service.Account;
using Book.DataAccessLayer.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography.Xml;

namespace BookStoreAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]

    public class AccountController : Controller
    {
        private readonly IAccountService _accountService;
        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserModel signInModel)
        {
            var result = await _accountService.LoginAsync(signInModel);


            if (string.IsNullOrEmpty(result))
            {
                return Unauthorized(
                    new
                    {
                        error = "Invalid Credentials"
                    });
            }


            return Ok(new
            {

                token = result,
                message = "Login Successful"
            }); ;
        }


        [Authorize]
        [HttpGet("IsAuthenticated")]
        public IActionResult IsAuthenticated()
        {
            // User is authenticated
            return Ok(new
            {
                msg = "Authenticated"
            });
        }

        //[Authorize]
        //[HttpGet("GetUserDetails")]

        //public 


    }
}
