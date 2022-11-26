// import { lineChart } from "./line-chart";
import "./style.css";
import * as d3 from "d3";

import { barChart } from "./bar-chart";
import { lineChart } from "./line-chart";
import { Int32, Table, Utf8 } from "apache-arrow";
import { db } from "./duckdb";
import parquet from "./pittsburgh.parquet?url";

const app = document.querySelector("#app")!;

// Part 1
// Create the chart. The specific code here makes some assumptions that may not hold for you.
const chart1 = lineChart();

async function update1(Station: string) {
  // Query DuckDB for the data we want to visualize.
  const data1: Table = await conn1.query(`
  SELECT date_trunc('month', "Timestamp(UTC)") + INTERVAL 15 DAY as t, round(avg("US AQI"), 2) as a_aqi,
  round(quantile_cont("US AQI", 0.1),2) as aqi1, round(quantile_cont("US AQI", 0.9),2) as aqi2
  FROM pittsburgh.parquet
  where "Station name" = '${Station}'
  group by t 
  order by t`);

  const data2: Table = await conn1.query(`
  SELECT date_trunc('day', "Timestamp(UTC)") as t1, round("US AQI", 2) as aqi,
  FROM pittsburgh.parquet
  where "Station name" = '${Station}'
  group by t1, aqi
  order by t1`);

  const X1 = data1.getChild("t")!.toArray();
  const X2 = data2.getChild("t1")!.toArray();
  const Y1 = data1.getChild("a_aqi")!.toArray();
  const Y2 = data1.getChild("aqi1")!.toArray();
  const Y3 = data1.getChild("aqi2")!.toArray();
  const Y4 = data2.getChild("aqi")!.toArray();
  chart1.update1(X1, X2, Y1, Y2, Y3, Y4);
}

// Load a Parquet file and register it with DuckDB. We could request the data from a URL instead.
const res1 = await fetch(parquet);
await db.registerFileBuffer(
  "pittsburgh.parquet",
  new Uint8Array(await res1.arrayBuffer())
);

// Query DuckDB for the locations.
const conn1 = await db.connect();

const Stations: Table<{ Station: Utf8 }> = await conn1.query(`
SELECT DISTINCT "Station name" as Station, count(*)::INT as cnt
FROM pittsburgh.parquet
group by Station`);

// Create a select element for the locations.
const select1 = d3.select(app).append("select");
for (const Station of Stations) {
  select1
    .append("option")
    .text(`${Station.Station} (${Station.cnt})`)
    .property("value", Station.Station);
}

select1.on("change", async () => {
  const Station = select1.property("value");
  update1(Station);
});

// Update the chart with the first location.
update1("Liberty (SAHS)");

// Add the chart to the DOM.
app.appendChild(chart1.element);

// Part 2
const chart = barChart();

// Query DuckDB for the locations.
const conn = await db.connect();

async function update(City: string) {
  // Query DuckDB for the data we want to visualize.
  const data: Table<{ mp: Utf8; cnt: Int32 }> = await conn.query(`
    select "Main pollutant" as mp, count()::INT as count
    from pittsburgh.parquet
    where City = '${City}'
    group by "Main pollutant"`);

  // Get the X and Y columns for the chart. Instead of using Parquet, DuckDB, and Arrow, we could also load data from CSV or JSON directly.
  const X = data.getChildAt(1)!.toArray();
  const Y = data
    .getChildAt(0)!
    .toJSON()
    .map((d) => `${d}`);
  chart.update(X, Y);
}

// Load a Parquet file and register it with DuckDB. We could request the data from a URL instead.
const res = await fetch(parquet);
await db.registerFileBuffer(
  "pittsburgh.parquet",
  new Uint8Array(await res.arrayBuffer())
);

// Load a Parquet file and register it with DuckDB. We could request the data from a URL instead.
const Cities: Table<{ City: Utf8 }> = await conn.query(`
SELECT DISTINCT City
FROM pittsburgh.parquet`);

// Create a select element for the locations.

const select = d3.select(app).append("select");
for (const City of Cities) {
  select.append("option").text(City.City);
}

select.on("change", async () => {
  const City = select.property("value");

  update(City);
});

// Update the chart with the first location.
update("Pittsburgh");

// Add the chart to the DOM.
app.appendChild(chart.element);
