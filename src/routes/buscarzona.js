var express = require("express"); 
var router = express.Router();


var BuscarZonasControler = require("../controllers/BuscarZonaController")


router.post("/BuscarZonas", function(req, res) {
    BuscarZonasControler.enviar(req, res);
    
  
})



router.post("/BuscarEmpresa", function(req,res) {
    BuscarZonasControler.enviar2(req, res);
    
   

})
module.exports = router