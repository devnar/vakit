const axios = require("axios");
const readline = require("readline");
const moment = require("moment");

// Şehir al
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getPrayerTimes(city = "Istanbul") {
  const url = `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=Turkey&method=13`;

  axios.get(url)
    .then(response => {
      const data = response.data.data.timings;
      console.log(`\n📍 ${city} için ezan vakitleri:\n`);
      for (const [name, time] of Object.entries(data)) {
        console.log(`${translateName(name).padEnd(12)}: ${time}`);
      }


      showNextPrayer(data);
    })
    .catch(error => {
      console.error("❌ Ezan vakitleri alınamadı:", error.message);
    });
}

function showNextPrayer(timings) {
  const now = moment();
  const format = "HH:mm";

  const ordered = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  for (const key of ordered) {
    const time = moment(timings[key], format);
    if (time.isAfter(now)) {
      const diff = moment.duration(time.diff(now));
      console.log(`\n⏰ Sıradaki vakit: ${translateName(key)} (${timings[key]})`);
      console.log(`➡️ Kalan süre: ${diff.hours()} saat ${diff.minutes()} dakika\n`);
      return;
    }
  }

  console.log("\n🌙 Tüm vakitler geçti, yarını bekleyiniz.\n");
}

function translateName(english) {
  const map = {
    Fajr: "İmsak",
    Sunrise: "Güneş",
    Dhuhr: "Öğle",
    Asr: "İkindi",
    Maghrib: "Akşam",
    Isha: "Yatsı",
    Imsak: "İmsak",
    Midnight: "Gece Yarısı"
  };
  return map[english] || english;
}

// Giriş
rl.question("Şehir ismini giriniz (varsayılan: Istanbul): ", function (city) {
  getPrayerTimes(city.trim() || "Istanbul");
  rl.close();
});
