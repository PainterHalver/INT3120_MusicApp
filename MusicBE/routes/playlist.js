var express = require('express');
var router = express.Router();
const {ZingMp3} = require('zingmp3-api-full-v2');

router.get('/', async (req, res, next) => {
    const detail = await ZingMp3.getDetailPlaylist('69IAZIWU');
    const recommends = await ZingMp3.getBottomSection('69IAZIWU');
    res.json({
      data: {detail, recommends},
    })
});

module.exports = router;