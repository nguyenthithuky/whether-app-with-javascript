const wrapper = document.querySelector('.wrapper');
const inputPart = document.querySelector('.input-part');
const infoTxt = document.querySelector('.info-txt');
const inputField = document.querySelector('input');
const locationBtn = document.querySelector('button');
const weatherPart = document.querySelector('.weather-part');
const wIcon = document.querySelector('img');
const arrowBack = document.querySelector('header i');

let api;

inputField.addEventListener('keyup', e => {
    if (e.key == 'Enter' && inputField.value != '') {
        requestApi(inputField.value)
    }
})

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    } else {
        alert('your browser not support geolocation api ')
    }
})

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=70e9203aa987a8dc97d77e3efa1accc4`;
    fetchData();
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=70e9203aa987a8dc97d77e3efa1accc4`
    fetchData();
}
function onError(error) {
    infoTxt.innerHTML = error.message;
    infoTxt.classList.add('error')
}

function fetchData() {
    infoTxt.innerHTML = 'getting weather detalisc...';
    infoTxt.classList.add('pending');
    console.log("api", api);
    fetch(api).then(res => res.json()).then(result => {
        console.log("result", result);
        weatherDatalis(result)
    }).catch(() => {
        infoTxt.innerHTML = 'something went wrong';
        infoTxt.classList.replace('pending', 'error');
    });
}

function weatherDatalis(info) {
    if (infoTxt.cod == '404') {
        infoTxt.classList.replace('pending', 'error');
        infoTxt.innerHTML = `${inputField.value} is not a valid city name`

    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { main: { temp, humidity, feels_like } } = info

        if (id == 800) {
            wIcon.src = 'icons/clear.svg';
        } else if (id >= 200 && id <= 232) {
            wIcon.src = 'icons/storm.svg';
        } else if (id >= 600 && id <= 781) {
            wIcon.src = 'icons/snow.svg'
        } else if (id >= 701 && id <= 781) {
            wIcon.src = 'icons/haze.svg';
        } else if (id >= 801 && id <= 804) {
            wIcon.src = 'icons/cloud.svg'
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            wIcon.src = 'icons/rain.svg'
        }

        weatherPart.querySelector('.temp .numb').innerHTML = Math.floor(temp);
        weatherPart.querySelector('.weather').innerHTML = description;
        weatherPart.querySelector('.location span').innerHTML = `${city}, ${country}`;
        weatherPart.querySelector('.temp .numb-2').innerHTML = Math.floor(feels_like);
        weatherPart.querySelector('.humidity span').innerHTML = `${humidity}%`;
        infoTxt.classList.remove('pending', 'error');
        infoTxt.innerHTML = '';
        inputField.value = '';
        wrapper.classList.add('active');

    }
}

arrowBack.addEventListener('click', () => {
    wrapper.classList.remove('active');
})