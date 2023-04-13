'use strict';


// Data
const account1 = {
  owner: 'Tomas Pichl',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Displaying movements from account array
const displayMovements = function (movements) {
  containerMovements.innerHTML = ''
  movements.forEach(function (move, i) {
    const typeOfMovement = move > 0 ? `deposit` : `withdrawal`;
    const insertHTML =
      `<div class="movements__row">
        <div class="movements__type movements__type--${typeOfMovement}">${i + 1} ${typeOfMovement}</div>
        <div class="movements__value">${move} CZK</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', insertHTML);
  });
};


// Function that counts acc balance
const calculateDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accumulator, mov) => accumulator + mov, 0);
  labelBalance.textContent = `${acc.balance}CZK`;
}


// Function that calculates and display acc summary
const calculateDisplaySummary = function (accs) {
  const incomes = accs.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} CZK`
  const outcomes = accs.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)} CZK`
  const interest = incomes * accs.interestRate / 100;
  labelSumInterest.textContent = `${interest} CZK`
}

// Function that creates usernames for each owner of the account
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
}
createUserName(accounts);

const updateUserInterface = function (acc) {
  // Load movements
  displayMovements(acc.movements);
  // Load balance
  calculateDisplayBalance(acc);
  // Load summary
  calculateDisplaySummary(acc);
}

let currentAccount;

// Login (form)
btnLogin.addEventListener('click', function (event) {
  // Preventing from default behavior - if form - automaticly refresh on click
  event.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUserInterface(currentAccount);
  }
});

// Transfer money
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amountOfMoney = Number(inputTransferAmount.value);
  const recieveAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (amountOfMoney > 0 && currentAccount.balance >= amountOfMoney && recieveAccount.username !== currentAccount.username && recieveAccount) {
    currentAccount.movements.push(-amountOfMoney);
    recieveAccount.movements.push(amountOfMoney);

    updateUserInterface(currentAccount);
   }
});

// Closing account
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin);
  // Finding an index of current logged in user in acc array
  const indexOfDeletingAcc = accounts.findIndex(acc => acc.username === currentAccount.username);
  accounts.splice(indexOfDeletingAcc, 1);
  inputCloseUsername.value = inputClosePin.value = "";
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Log in to get started`

})