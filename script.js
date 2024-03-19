document.addEventListener('DOMContentLoaded', function () {
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const convertedAmountInput = document.getElementById('convertedAmount');
    const swapButton = document.getElementById('swapBtn');

    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(response => response.json())
        .then(data => {
            const rates = data.rates;
            for (const currency in rates) {
                const option = document.createElement('option');
                option.value = currency;
                option.textContent = currency;
                fromCurrencySelect.appendChild(option.cloneNode(true));
                toCurrencySelect.appendChild(option);
            }
            convertCurrency();
        })
        .catch(error => {
            console.error('Error fetching currencies:', error);
        });

    amountInput.addEventListener('input', convertCurrency);
    fromCurrencySelect.addEventListener('change', convertCurrency);
    toCurrencySelect.addEventListener('change', convertCurrency);

    swapButton.addEventListener('click', function () {
        const tempCurrency = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = tempCurrency;
        const tempAmount = amountInput.value;
        amountInput.value = convertedAmountInput.value;
        convertedAmountInput.value = tempAmount;
        convertCurrency();
    });

    function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
            .then(response => response.json())
            .then(data => {
                const rate = data.rates[toCurrency];
                const convertedAmount = amount * rate;
                convertedAmountInput.value = convertedAmount.toFixed(2);
            })
            .catch(error => {
                console.error('Error fetching exchange rates:', error);
                convertedAmountInput.value = 'Error';
            });
    }
});
