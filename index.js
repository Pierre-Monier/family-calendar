window.onload = async function () {
  const data = await fetchData();
  const dates = getDates();
  const state = createsState(data, dates);
  createUI(state);
};

function createUI(state) {
  const container = document.getElementById("content");
  /// remove the .loader
  const loader = document.querySelector(".loader");
  loader.style.display = "none";

  state.forEach((day) => {
    const div = document.createElement("div");
    div.classList.add("day");
    div.innerHTML = `<h2>${getFrenchDate(
      day
    )} ${day.date.getDate()} ${getFrenchMonth(day)}</h2>`;
    container.appendChild(div);

    if (day.data.length === 0) {
      const p = document.createElement("p");
      p.innerHTML = "Aucun rendez-vous";
      container.appendChild(p);
      return;
    }

    const ul = document.createElement("ul");
    day.data.forEach((d) => {
      const li = document.createElement("li");
      li.innerHTML = `${d.name} à ${d.day.getHours()}h${d.day
        .getMinutes()
        .toString()
        .padEnd(2, "0")}`;
      ul.appendChild(li);
    });

    container.appendChild(ul);
  });
}

/// Return the name of the day in french
function getFrenchDate(day) {
  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  return days[day.date.getDay()];
}

function getFrenchMonth(day) {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  return months[day.date.getMonth()];
}

function createsState(data, dates) {
  const state = [];

  dates.forEach((date) => {
    const dayData = data
      .filter((d) => isSameDay(d.day, date))
      .sort((a, b) => a.day - b.day);
    state.push({
      date: date,
      data: dayData,
    });
  });

  return state;
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

async function fetchData() {
  const gid = "580011276";
  const spreadSheetId = "137b5YwgA7QB_jS2yS2OrevXmy-zXKiV5euKK1R9SpB8";
  const url =
    "https://docs.google.com/spreadsheets/d/" +
    spreadSheetId +
    "/gviz/tq?tqx=out:json&tq&gid=" +
    gid;

  console.log("url: ", url);

  const response = await fetch(url);
  const txt = await response.text();

  console.log("txt: ", txt);

  var jsonString = txt.match(/(?<="table":).*(?=}\);)/g)[0];
  var json = JSON.parse(jsonString);

  console.log("json: ", json);

  return json["rows"]
    .map((row) => row["c"].slice(1))
    .map((row) => {
      return {
        name: row[0]["v"],
        day: parseDate(row[1]["v"], row[2]["f"]),
      };
    });
}

function parseDate(date, time) {
  const createdDate = eval("new " + date);
  createdDate.setHours(time.split(":")[0]);
  createdDate.setMinutes(time.split(":")[1]);

  return createdDate;
}

function getDates() {
  let dates = [];
  for (let i = 0; i < 8; i++) {
    let date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  return dates;
}
