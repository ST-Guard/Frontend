const express = require("express");
const router = express.Router();

const {
    obterDashboardSupervisora
} = require("../controllers/dashSupervisoraController");

router.get(
    "/obter-dashboard-supervisora",
    obterDashboardSupervisora
);

module.exports = router;