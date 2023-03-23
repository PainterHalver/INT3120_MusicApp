var express = require("express");
var router = express.Router();
const { ZingMp3 } = require("zingmp3-api-full-v2");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const data = await ZingMp3.getHome();
  res.json({
    headSlider: data.data.items[0].items,
    newRelease: data.data.items[3].items,
    hotArtists: data.data.items.find(
      (element) => element.sectionId == "hArtistTheme"
    ).items,
    //todayPlaylists: data.data.items.find(element => element.sectionId == 'hAutoTheme1').items,
    chart: data.data.items.find((element) => element.sectionId == "hZC"),
    top100: data.data.items.find((element) => element.sectionId == "h100")
      .items,
    hotAlbums: data.data.items.find((element) => element.sectionId == "hAlbum")
      .items,
    //data: data,
  });
});

router.get("/categories", async (req, res, next) => {
  const data = await ZingMp3.getAllCategories();
  res.json({
    data: data,
  });
});

router.get("/category/detail", async (req, res, next) => {
  const data = await ZingMp3.getCategoryDetail("IWZ9Z0CA");
  res.json({
    data: data,
  });
});

router.get("/chart", async (req, res, next) => {
  const data = await ZingMp3.getChartHome();
  const items = data.data.RTChart.chart.items;
  const times = data.data.RTChart.chart.times;
  const chart = { labels: [], datasets: [] };
  const weekChart = data.data.weekChart;

  let i = 0;
  Object.keys(times).forEach((element) => {
    if (i % 2 == 0) chart.labels.push(times[element].hour);
    else chart.labels.push("");
    i++;
  });
  i = 0;
  Object.keys(items).forEach((element) => {
    chart.datasets.push({
      data: items[element].map((item) => {
        return item.counter;
      }),
    });
  });
  i = 0;
  const titles = ['V-POP', 'US-UK', 'KPOP']

  Object.keys(weekChart).forEach((element) => {
    weekChart[element].items = weekChart[element].items.slice(0, 3);
    weekChart[element].title = titles[i];
    i++;
  });
  i = null;

  res.json({
    chart,
    songs: data.data.RTChart.items,
    weekChart,
  });
});

module.exports = router;
