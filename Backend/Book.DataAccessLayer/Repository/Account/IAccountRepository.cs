using Book.DataAccessLayer.Model;

namespace Book.DataAccessLayer.Repository.Account
{
    public interface IAccountRepository
    {
        Task<string> LoginAsync(LoginUserModel signInModel);
    }
}