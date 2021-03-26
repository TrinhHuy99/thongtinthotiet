const APP_ID = "7050b446ae483d71e2d373ce07a2c0ab";
const DEFAULT_VALUE = '--'
const searchInput = document.querySelector('#search-input');
const cityName = document.querySelector('.city-name');
const weatherState = document.querySelector('.weather-state');
const weatherIcon = document.querySelector('.weather-icon');
const temperater = document.querySelector('.temperater');
const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');

searchInput.addEventListener('change', (e) => {
    //units=metric chuyển từ độ f sang độ c
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
        //trả về một lời hứa giải quyết (resolve) một đối tượng response(lấy dữ liệu từ 1 url)
        .then(async res => {
            //Tham số res nhận giá trị của đối tượng được trả về từ tìm nạp (url). Sử dụng phương thức json () để chuyển đổi res thành dữ liệu JSON: 
            const data = await res.json();
            console.log('[searchInput]', data);
            cityName.innerHTML = data.name || DEFAULT_VALUE;
            weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
            weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`) || DEFAULT_VALUE;
            temperater.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;
            //moment.js(chuyển đổi định dạng )
            sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE;
            sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE;
            humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
            windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE;

        });



});
//trợ lí ảo
//lưu api nhận diện giọng nói vào 1 biến
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
//lưu api đọc đoạn text từ window
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
recognition.lang = 'vi-VI';
//kết qủa trả về ngay sau khi tìm kiếm bằng giọng nói
recognition.continuous = false;
const speak = (text) => {
    if (synth.speaking) {
        console.error('System busy...Try again')
        return;

    }
    //đọc được đoạn text
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => {
        console.log('SpeechSynthesisUtterance.onend')
    }
    utter.onerror = (err) => {
        console.log('SpeechSynthesisUtterance.oneror', error);
    }
    synth.speak(utter);
}
const microphone = document.querySelector('.mic');
const handleVoice = (text) => {
    console.log('text', text);
    const handleText = text.toLowerCase();
    if (handleText.includes('thời tiết tại')) {
        const location = handleText.split('tại')[1].trim();
        console.log('location', location);
        searchInput.value = location;
        const changeEvent = new Event('change');
        searchInput.dispatchEvent(changeEvent);
        return;

    }
    const container = document.querySelector('.container');
    if (handleText.includes('thay đổi màu nền')) {
        const color = text.split('màu nền')[1].trim();
        container.style.background = color;
        return;
    }
    if (handleText.includes('màu nền mặc định')) {
        container.style.background = '';
        return;
    }
    if (handleText.includes('mấy giờ')) {
        //sử dụng dụng interface
        const textToSpecch = `${moment().hour()} hours ${moment().minutes()} minutes`
        speak(textToSpecch);
        return;


    }
    speak('Try again');

}
microphone.addEventListener('click', (e) => {
    e.defaultPrevented;
    //bắt đầu vào hỏi có muốn mở microphone không
    recognition.start();
    //thêm class phía sau class mic
    microphone.classList.add('recording');
})
recognition.onspeechend = () => {
    recognition.stop();
    microphone.classList.remove('recording');
}
recognition.onerror = (err) => {
    console.log(err);
    microphone.classList.remove('recording');

}
//trả kết quả về api
recognition.onresult = (e) => {
    console.log('onresult', e);
    const text = e.results[0][0].transcript;
    handleVoice(text);
}