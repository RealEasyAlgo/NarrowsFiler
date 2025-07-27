const convert = () => {
  const input = document.getElementById('inputText').value;
  console.log("input")
  console.dir(input)

  const extract = (regex) => {
    const match = input.match(regex);
    return match ? match[1] : null;
  };

  const symbol         = extract(/Futures Grid Details\s+([A-Z]+USDT)/);
  const asset          = symbol.replace(/USDT$/, '');
  const leverage       = parseInt(extract(/(\d+)X/));
  const entry          = parseFloat(extract(/Grid Open Price\s+([\d.]+)/));
  const floor          = parseFloat(extract(/Price Range\s+([\d.]+)\s*-/));
  const ceiling        = parseFloat(extract(/Price Range\s+[\d.]+\s*-\s*([\d.]+)/));
  const cost           = parseFloat(extract(/Investment\(USDT\)\s+([\d.]+)/));
  const gridLines      = parseInt(extract(/Grid No\.\s+(\d+)/));

  // const datetimeMatch  = extract(/Created Time\s+(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):\d{2}/);
  // const [_, year, month, day, hour, minute] = datetimeMatch.match(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})/);

  const datetimeParts = input.match(/Created Time\s+(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):\d{2}/);
  const [ , year, month, day, hour, minute ] = datetimeParts;

  // const maxLevel = (entry + (ceiling - entry) / 3).toFixed(2);
  // const minLevel = (entry - (entry - floor) / 3).toFixed(2);
  const maxLevel = (entry + (ceiling - entry) / 3);
  const minLevel = (entry - (entry - floor) / 3);

  const result = 
`max${asset} = ${maxLevel}
min${asset} = ${minLevel}

    '${symbol}.P' => gridParameters.new(
         ceilingPriceLevel = ${ceiling},
         entryPriceLevel = ${entry},
         floorPriceLevel = ${floor},

         theYear = ${parseInt(year)},
         theMonth = ${parseInt(month)},
         theDay = ${parseInt(day)},
         theHour = ${parseInt(hour)},
         theMinute = ${parseInt(minute)},

         cost = ${cost.toFixed(2)},
         numberOfGridLines = ${gridLines},
         leverage = ${leverage},

         minPriceLevel = min${asset},
         maxPriceLevel = max${asset}
     )`;

  document.getElementById('outputText').value = result;
};
