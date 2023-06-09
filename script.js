'use strict';


// Data
const account1 = {
  owner: "Tomas Pichl",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2023-03-27T17:01:17.194Z",
    "2023-04-11T23:36:17.929Z",
    "2023-04-12T10:51:36.790Z",
  ],
  currency: "CZK",
   
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2023-03-27T17:01:17.194Z",
    "2023-04-11T23:36:17.929Z",
    "2023-04-12T10:51:36.790Z",
  ],
  currency: "CZK",
  
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2023-03-27T17:01:17.194Z",
    "2023-04-11T23:36:17.929Z",
    "2023-04-12T10:51:36.790Z",
  ],
  currency: "CZK",
  
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-05-27T17:01:17.194Z",
    "2023-04-11T23:36:17.929Z",
    "2023-04-12T10:51:36.790Z",
  ],
  currency: "CZK",
  
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
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const ifSortMov = sort ? acc.movements.slice()/* slice - only because it crates shallow copy, sort mutate original array */.sort((a, b) => a - b) : acc.movements;
  // Array is sorted before it's putted into forEach method if sort arg. is true
  ifSortMov.forEach(function (move, i) {
    const typeOfMovement = move > 0 ? `deposit` : `withdrawal`;
    // Displaying date on every movement
    const date = new Date(acc.movementsDates[i]) //Looping through 2 arrays with same forEach method
    const dateArr = new Array(
      date.getDate(),
      date.getMonth() + 1, // +1 because months are 0 based ????
      date.getFullYear()
    );
    const displayMovementsDates = `${dateArr.join("/")}`;
    const insertHTML = `<div class="movements__row">
        <div class="movements__type movements__type--${typeOfMovement}">${
      i + 1
    } ${typeOfMovement}</div>
        <div class="movements__date">${displayMovementsDates}</div>
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
  displayMovements(acc);
  // Load balance
  calculateDisplayBalance(acc);
  // Load summary
  calculateDisplaySummary(acc);
}

const startLogoutTime = function () {
  let remainingTime = 300
  const timer = setInterval(function () {
    const minutes = String(Math.trunc(remainingTime / 60)).padStart(2, 0);
    const seconds = String(remainingTime % 60).padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;
    if (remainingTime === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get stareted'
    }
    remainingTime--;
  }, 1000);
  return timer;
};

let currentAccount, timer;

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

    if (timer) clearInterval(timer);
    timer = startLogoutTime();
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
    // Money transfer - movements array
    currentAccount.movements.push(-amountOfMoney);
    recieveAccount.movements.push(amountOfMoney);
    // Date on money transfer
    currentAccount.movementsDates.push(new Date().toISOString());
    recieveAccount.movementsDates.push(new Date().toISOString());
    // Upsade UI
    updateUserInterface(currentAccount);
    // Reset timer
    clearInterval(timer);
    timer = startLogoutTime();
  }
});

// Loan request
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amountOfLoanRequest = Number(inputLoanAmount.value);
  
  if (amountOfLoanRequest > 0 && currentAccount.movements.some(movement => movement >= amountOfLoanRequest * 0.1)) {
    // at least one of the movements must be 10% of loan amount
    setTimeout(function () {
      // Money transfer - movements array
      currentAccount.movements.push(amountOfLoanRequest);
      // Date on money transfer
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUserInterface(currentAccount);
    }, 3000);
    inputLoanAmount.value = "";
    // Reset timer
    clearInterval(timer);
    timer = startLogoutTime();
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

let sorted = false;
// Sorting button
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Set time
  // Manually
  const todayDate = new Date();
  const dateArr = new Array(todayDate.getDate(), todayDate.getMonth(), todayDate.getFullYear());
  const hourArr = new Array(todayDate.getHours(), todayDate.getMinutes());
  // labelDate.textContent = `${dateArr.join("/")}, ${hourArr.join(':')}`.padStart(2,0);
  // With API
  const now = new Date();
  const options = {
    minute: "numeric",
    hour: "numeric",
    day: "numeric",
    month: 'long',
    year: 'numeric'
};
labelDate.textContent = new Intl.DateTimeFormat("cs-CZ", options).format(now);