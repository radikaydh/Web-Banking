let currentBalance = 0;
let currentOverdraft = 0;
let overdraftLimit = 500;
const message = document.getElementById('message');
function deposit(event) {
    event.preventDefault();
    message.textContent = ' ';
    const depositAmtString = document.getElementById('depositAmt').value;
    const checkDecimals = depositAmtString.split('.');
    const depositAmt = parseFloat(depositAmtString);
    if (isNaN(depositAmt) || depositAmt === "" || depositAmt <= 0 || (checkDecimals[1] !== undefined && checkDecimals[1].length > 2)) {
        message.textContent = 'Deposit must be a valid amount greater than Rp 0';
        message.classList.remove('messageInfo');
        flashRed();
    } else if (currentOverdraft > 0 && currentOverdraft - depositAmt > 0) {
        currentOverdraft = twoDecimals(currentOverdraft - depositAmt);
        document.getElementById('currentOverdraft').innerHTML = 'Rp ' + currentOverdraft.toFixed(2);
    } else if (currentOverdraft > 0 && currentOverdraft - depositAmt <= 0) {
        currentBalance = twoDecimals(depositAmt - currentOverdraft);
        currentOverdraft = 0;
        document.getElementById('currentBalance').innerHTML = 'Rp ' + currentBalance.toFixed(2);
        document.getElementById('currentOverdraft').innerHTML = 'Rp ' + currentOverdraft.toFixed(2);
    } else {
        currentBalance = twoDecimals(currentBalance + depositAmt);
        document.getElementById('currentBalance').innerHTML = 'Rp ' + currentBalance.toFixed(2);
    }
    document.getElementById('formDeposit').reset();
    document.getElementById('depositAmt').blur();
    inOverdraft();
}

document.getElementById('formDeposit').addEventListener('submit', deposit);


function withdraw(event) {
    event.preventDefault();
    message.textContent = ' ';
    const withdrawAmtString = document.getElementById('withdrawAmt').value;
    const checkDecimals = withdrawAmtString.split('.');
    const withdrawAmt = parseFloat(withdrawAmtString);
    const testCurrentBalance = currentBalance - withdrawAmt;
    const testOverdraft = (overdraftLimit - currentOverdraft) - (withdrawAmt - currentBalance);
    if (isNaN(withdrawAmt) || withdrawAmt === "" || withdrawAmt <= 0 || (checkDecimals[1] !== undefined && checkDecimals[1].length > 2)) {
        message.textContent = 'Withdraw must be a valid amount greater than Rp 0';
        flashRed();
    } else if (testCurrentBalance < 0 && testOverdraft < 0) {
        message.textContent = 'Insufficient funds!';
        flashRed();
    } else if (testCurrentBalance < 0 && testOverdraft >= 0) {
        currentOverdraft = Math.abs(currentOverdraft + (withdrawAmt - currentBalance));
        currentBalance = 0;
        document.getElementById('currentBalance').innerHTML = 'Rp ' + currentBalance.toFixed(2);
        document.getElementById('currentOverdraft').innerHTML = 'Rp ' + currentOverdraft.toFixed(2);
    } else if (testCurrentBalance >= 0) {
        currentBalance = twoDecimals(testCurrentBalance);
        document.getElementById('currentBalance').innerHTML = 'Rp ' + currentBalance.toFixed(2);
    }
    document.getElementById('formWithdraw').reset();
    document.getElementById('withdrawAmt').blur();
    inOverdraft();

}

document.getElementById('formWithdraw').addEventListener('submit', withdraw);


function decreaseOverdraft() {
    message.textContent = ' ';
    if (overdraftLimit === 0) {
        message.textContent = 'Minimum overdraft limit reached';
        flashRed();
    } else if ((overdraftLimit - 50) < currentOverdraft) {
        message.textContent = 'Cannot reduce Overdraft Limit due to current Overdraft balance';
        flashRed();
    } else {
        overdraftLimit = overdraftLimit - 50;
        document.getElementById('overdraftLimit').innerHTML = 'Rp ' + overdraftLimit;
    }
}

document.getElementById('decrease').addEventListener('click', decreaseOverdraft);


function increaseOverdraft() {
    message.textContent = ' ';
    if (overdraftLimit === 1000) {
        message.textContent = 'Maximum overdraft limit reached';
        flashRed();
    } else {
        overdraftLimit = overdraftLimit + 50;
        document.getElementById('overdraftLimit').innerHTML = 'Rp ' + overdraftLimit; 
    }
}

document.getElementById('increase').addEventListener('click', increaseOverdraft);


function inOverdraft() {
    if (currentOverdraft > 0) {
        document.getElementById('currentOverdraft').classList.add('inOverdraft');
    } else if (currentOverdraft === 0) {
        document.getElementById('currentOverdraft').classList.remove('inOverdraft');
    }
}


function flashRed () {
    message.classList.remove('messageInfo');
    setTimeout(function() {
        message.classList.add('messageInfo');
    }, 0);
}


function twoDecimals (value) {
    return Math.round(value * 100) / 100;
}

