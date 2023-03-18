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

module.exports = router;
