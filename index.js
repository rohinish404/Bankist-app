"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

function displayMovements(movements) {
  containerMovements.innerHTML = "";

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}
displayMovements(movements);

function summaryVal(movements) {
  //summary in value
  const inAmt = movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (total, mov) {
      return total + mov;
    });
  labelSumIn.textContent = `${inAmt}€`;
  //summary out value
  const outAmt = movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (total, mov) {
      return total + mov;
    });
  labelSumOut.textContent = `${Math.abs(outAmt)}€`;
  const totalval = movements.reduce(function (total, mov) {
    return total + mov;
  });
  labelBalance.textContent = `${totalval}€`;

  //interest
  accounts.forEach(function (accs) {
    const interestVal = (totalval * accs.interestRate) / 100;
    labelSumInterest.textContent = `${interestVal}€`;
  });
}
summaryVal(movements);

//adding username to the objects
function username(accounts) {
  accounts.forEach(function (accs) {
    accs.username = accs.owner
      .toLowerCase()
      .split(" ")
      .map(function (acc) {
        return acc[0];
      })
      .join("");
  });
}
username(accounts);
let currentAccount;
let time = 299;
//button login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = "100";
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    updateUi(currentAccount);

    const timer1 = setInterval(timer, 1000);
  }
});
const timer = function () {
  const min = String(Math.trunc(time / 60)).padStart(2, 0);
  const sec = String(Math.trunc(time % 60)).padStart(2, 0);
  labelTimer.textContent = `${min}:${sec}`;
  // console.log(`${min}:${sec}`);
  if (time > 0) {
    time--;
  } else {
    clearInterval(timer);
    containerApp.style.opacity = "0";
  }
};

function updateUi(acc) {
  displayMovements(acc.movements);
  summaryVal(acc.movements);
}

// btnSort.addEventListener('click',function(e){
//     e.preventDefault()
//     console.log('hello');
//     console.log(currentAccount);
//     const sorted = currentAccount.movements.sort(function(a,b){
//         return a-b
//     })
//     console.log(sorted);
// })

let transferAcc;


btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
//   transferAmt(accounts);
transferAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value);
  //   console.log(transferAcc);
  if (amount <= Number(labelBalance.textContent.slice(0,labelBalance.textContent.length-1)) && currentAccount.username !== transferAcc.username) {
   
    transferAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
    displayMovements(transferAcc.movements);
    displayMovements(currentAccount.movements);
  }

  inputTransferTo.value = "";
  inputTransferAmount.value = "";
});


btnLoan.addEventListener('click',function(e){
    e.preventDefault()

    const loanAmt = inputLoanAmount.value
    currentAccount.movements.push(loanAmt)
    displayMovements(currentAccount.movements)
    inputLoanAmount.value = ''
})
let closeAcc
btnClose.addEventListener('click',function(e){
    e.preventDefault()

    const closeName = inputCloseUsername.value
    closeAcc = accounts.find(function(acc){
        return acc.username === inputCloseUsername.value 
    })
    console.log(closeAcc);
    if(Number(closeAcc.pin) === Number(inputClosePin.value)){
        const index = accounts.indexOf(closeAcc);
        accounts.splice(index,1)
        console.log(accounts);
        containerApp.style.opacity = "0";
    }
    inputCloseUsername.value = ''
    inputClosePin.value = ''

})

