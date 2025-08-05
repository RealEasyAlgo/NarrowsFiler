const EXCHANGES_COOKIE_NAME = "EA_ExchangesPreferences";
const SECTIONS_COOKIE_NAME = "EA_SectionsPreferences";

const LATEST_ASSETS_PER_EXCHANGE_FILE_NAME = "AssetsPerExchange.json"


const getFirstDayOfMonth = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(2, '0')}-${String(firstDay.getDate()).padStart(2, '0')}`; 
}    

const getSundayOfWeek = () => {
  let daysToSunday = "";
  let dayOfWeek = "";
  const today = new Date();
  dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  // console.log(dayOfWeek);
  if (dayOfWeek != 0) {
      daysToSunday = -7 - ((dayOfWeek - 7) % 7); // Calculate days until Sunday
  }
  // console.log(daysToSunday);

  const sunday = new Date(today.getTime() + daysToSunday * 24 * 60 * 60 * 1000);
  return `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`; 
  // return `${sunday.getFullYear()}/${sunday.getMonth() + 1}/${sunday.getDate()}`;
}

const formatDate = (date) => {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    let day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const trimArrayElements = (arr) => {
  return arr.map(element => element.trim());
}

const removeDuplicateLines = (multilineString) => {
  // console.log(`multilineString : ${multilineString}`);
  const linesArray = multilineString.split('\n');
  const trimmedArray = trimArrayElements(linesArray)
  const uniqueLinesSet = new Set(trimmedArray);
  const uniqueLinesArray = Array.from(uniqueLinesSet);

  return uniqueLinesArray.join('\n');
}

let oldDate = "";
let newDate = "";
const updateDateTime = () => {
    const now = new Date();
    const formattedDateTime = now.toLocaleString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false // 24-hour format
    }).replace(",", ""); // Remove the comma between date and time

    const newDate = now.toLocaleString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    })

    document.getElementById("dateTimeDisplay").innerText = formattedDateTime;
    // console.log(`Timestamp ${formattedDateTime} ${newDate} vs ${formatDate(now)}`)
    if (oldDate != newDate) {
      changeRadioLabelText("daily", `Daily_${newDate}.txt`);
      changeRadioLabelText("weekly", `Weekly_${getSundayOfWeek()}.txt`);
      changeRadioLabelText("monthly", `Monthly_${getFirstDayOfMonth()}.txt`);
      changeRadioLabelText("combo", `Combo_${newDate}.txt`);
    }

    oldDate = newDate;
};

// Initial call to display the date and time immediately
updateDateTime();

// Update every second (1000 ms)
setInterval(updateDateTime, 60000);

// const theNarrows = `
// BYBIT:1000BTTUSDT.P    
// BYBIT:ALEOUSDT.P    
// BYBIT:ARUSDT.P    
// BYBIT:AVAILUSDT.P    
// BYBIT:BATUSDT.P    
// BYBIT:BTCUSDT.P    
// BYBIT:CUDISUSDT.P    
// BYBIT:KAVAUSDT.P    
// BYBIT:KERNELUSDT.P    
// BYBIT:LUMIAUSDT.P    
// BYBIT:QIUSDT.P    
// BYBIT:REQUSDT.P    
// BYBIT:SOLVUSDT.P    
// BYBIT:SOONUSDT.P    
// BYBIT:USD1USDT.P    
// BYBIT:USD1USDT.P      
// BYBIT:USDEUSDT.P    
// BYBIT:USDEUSDT.P      
// BYBIT:XAUTUSDT.P    
// BYBIT:XAUTUSDT.P      
// `

// const theExchangeSymbols = {
//   "BLOFIN": [
//     "1000BTTUSDT.P",
//     "ALEOUSDT.P",
//     "ARUSDT.P",
//     "AVAILUSDT.P",
//     "BATUSDT.P",
//     "BTCUSDT.P",
//     "CUDISUSDT.P",
//     "KAVAUSDT.P",
//     "KERNELUSDT.P",
//     "QIUSDT.P",
//     "REQUSDT.P",
//     "SOLVUSDT.P",
//     "SOONUSDT.P",
//     "USD1USDT.P",
//     "XAUTUSDT.P"
//   ],
//   "BYBIT": [
//     "1000BTTUSDT.P",
//     "ALEOUSDT.P",
//     "ARUSDT.P",
//     "AVAILUSDT.P",
//     "BATUSDT.P",
//     "BTCUSDT.P",
//     "CUDISUSDT.P",
//     "KAVAUSDT.P",
//     "KERNELUSDT.P",
//     "LUMIAUSDT.P",
//     "QIUSDT.P",
//     "REQUSDT.P",
//     "SOLVUSDT.P",
//     "SOONUSDT.P",
//     "USD1USDT.P",
//     "XAUTUSDT.P"
//   ],
//   "GATEIO": [
//     "1000BTTUSDT.P",
//     "ALEOUSDT.P",
//     "ARUSDT.P",
//     "AVAILUSDT.P",
//     "BATUSDT.P",
//     "XAUTUSDT.P"
//   ],
//   "MEXC": [
//     "1000BTTUSDT.P",
//     "ALEOUSDT.P",
//     "ARUSDT.P",
//     "QIUSDT.P",
//     "REQUSDT.P",
//     "SOLVUSDT.P",
//     "SOONUSDT.P",
//     "USD1USDT.P",
//     "XAUTUSDT.P"
//   ],
//   "OKX": [
//     "1000BTTUSDT.P",
//     "ALEOUSDT.P",
//     "ARUSDT.P",
//     "AVAILUSDT.P",
//     "BATUSDT.P",
//     "BTCUSDT.P",
//     "CUDISUSDT.P",
//     "KAVAUSDT.P",
//     "QIUSDT.P",
//     "REQUSDT.P",
//     "SOLVUSDT.P",
//   ],
//   "TOOBIT": [
//     "1000BTTUSDT.P",
//     "ALEOUSDT.P",
//     "ARUSDT.P",
//     "AVAILUSDT.P",
//     "BATUSDT.P",
//     "BTCUSDT.P",
//     "CUDISUSDT.P",
//     "KAVAUSDT.P",
//     "KERNELUSDT.P",
//     "QIUSDT.P",
//     "REQUSDT.P",
//     "SOLVUSDT.P",
//     "SOONUSDT.P",
//     "USD1USDT.P",
//     "XAUTUSDT.P"
//   ]
// }


// const theExchangePriorities = ["GATEIO","MEXC","OKX","TOOBIT","BINANCE","BINGX","BITGET","BITMEX","BLOFIN","BYBIT","PHEMEX","WEEX"]

// const aHeader = `###REFERENCES
// BTC.D
// USDT.D
// CME:BTC1!
// ###LONG POSITIONS
// ###LONG POSITIONS CLOSED
// ###SHORT POSITIONS
// ###SHORT POSITIONS CLOSED
// ###CURIOSITIES
// ###NARROWS
// `
