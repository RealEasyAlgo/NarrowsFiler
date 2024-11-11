const getFirstDayOfMonth = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return `${firstDay.getFullYear()}/${String(firstDay.getMonth() + 1).padStart(2, '0')}/${String(firstDay.getDate()).padStart(2, '0')}`; 
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
  return `${sunday.getFullYear()}/${String(sunday.getMonth() + 1).padStart(2, '0')}/${String(sunday.getDate()).padStart(2, '0')}`; 
  // return `${sunday.getFullYear()}/${sunday.getMonth() + 1}/${sunday.getDate()}`;
}

function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    let day = String(date.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
}

function trimArrayElements(arr) {
  return arr.map(element => element.trim());
}

function removeDuplicateLines(multilineString) {
  // console.log(`multilineString : ${multilineString}`);
  const linesArray = multilineString.split('\n');
  const trimmedArray = trimArrayElements(linesArray)
  const uniqueLinesSet = new Set(trimmedArray);
  const uniqueLinesArray = Array.from(uniqueLinesSet);

  return uniqueLinesArray.join('\n');
}
