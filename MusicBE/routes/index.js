var express = require('express');
var router = express.Router();
const {ZingMp3} = require('zingmp3-api-full-v2');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const data = await ZingMp3.getHome();
  res.json({
    headSlider: data.data.items[0].items, 
    newRelease: data.data.items[3].items,
    hotArtists: data.data.items.find(element => element.sectionId == 'hArtistTheme').items,
    todayPlaylists: data.data.items.find(element => element.sectionId == 'hAutoTheme1').items,
    chart: data.data.items.find(element => element.sectionId == 'hZC'),
    top100: data.data.items.find(element => element.sectionId == 'h100').items,
    hotAlbums: data.data.items.find(element => element.sectionId == 'hAlbum').items,
  })
});

router.get('/categories', async (req, res, next) => {
  const data = await ZingMp3.getAllCategories();
  res.json({
    data: data,
  })
});

router.get('/category/detail', async (req, res, next) => {
  const data = await ZingMp3.getCategoryDetail('IWZ9Z0CA');
  res.json({
    data: data,
  })
});

module.exports = router;
