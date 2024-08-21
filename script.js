function getWeather() {
    const apiKey = ' ';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

//time zone

function updateManilaTime() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Manila',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true  // 12-hour clock with AM/PM
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    document.getElementById('manilaTime').textContent = '' + formatter.format(now);
}

// Update time every second
setInterval(updateManilaTime, 1000);

// Initial call to display the time immediately on load
updateManilaTime();

//STOCKS NEWS API

  // Function to fetch and display stock prices with error handling
    async function fetchStockPrices() {
        const apiKey = ' '; // Replace with your Alpha Vantage API key
        const symbols = ['MSFT', 'AAPL', 'GOOGL']; // Stock symbols for Microsoft, Apple, Google
        const stockContainer = document.getElementById('stockContainer');
        const errorContainer = document.getElementById('errorContainer');

    try {
        for (let symbol of symbols) {
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            const data = await response.json();
            if (!data['Global Quote']) {
                throw new Error(`No data found for symbol ${symbol}`);
            }
            const stockData = data['Global Quote'];

            const stockItem = document.createElement('div');
            stockItem.classList.add('stock-item');

            const stockTitle = document.createElement('h3');
            stockTitle.textContent = `${stockData['01. symbol']}`;

            const stockPrice = document.createElement('p');
            stockPrice.textContent = `$${stockData['05. price']}`;

            stockItem.appendChild(stockTitle);
            stockItem.appendChild(stockPrice);
            stockContainer.appendChild(stockItem);
        }
    } catch (error) {
        console.error('Error fetching stock prices:', error);
        errorContainer.textContent = 'Error fetching stock prices. Please try again later.';
    }
}

// Call the function to fetch and display stock prices on page load
fetchStockPrices();
