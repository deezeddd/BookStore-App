using Book.DataAccessLayer.Model;

namespace Book.BusinessLayer.Service.Account
{
    public interface IAccountService
    {
        Task<string> LoginAsync(LoginUserModel signInModel);
    }
}