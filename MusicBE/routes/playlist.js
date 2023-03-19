var express = require('express');
var router = express.Router();
const {ZingMp3} = require('zingmp3-api-full-v2');

router.get('/', async (req, res, next) => {
    const data = await ZingMp3.getDetailPlaylist('69IAZIWU');
    res.json({
      data: data,
    })
});

module.exports = router;