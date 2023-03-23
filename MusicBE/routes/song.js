var express = require("express");
var router = express.Router();
const { ZingMp3 } = require("zingmp3-api-full-v2");

router.get("/detail", async (req, res, next) => {
  const data = await ZingMp3.getSong("ZZDA7U9Z");
  res.json({
    data: data,
  });
});

router.get("/recommend", async (req, res, next) => {
  const data = await ZingMp3.getRecommendSongs("ZZDA7U9Z");
  res.json({
    data: data,
  });
});

module.exports = router;
