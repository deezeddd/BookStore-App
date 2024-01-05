using Book.DataAccessLayer.Model;
using Book.DataAccessLayer.Repository.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Book.BusinessLayer.Service.Account
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;
        public AccountService(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<String> LoginAsync(LoginUserModel signInModel)
        {
            return await _accountRepository.LoginAsync(signInModel);
        }
    }
}
