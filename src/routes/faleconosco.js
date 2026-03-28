var express = require("express"); 
var router = express.Router();


var faleconoscoControler = require("../controllers/faleconoscoController")


router.post("/", function(req, res) {
    faleconoscoControler.enviar(req, res);
    
    console.log("passou pelo router fale conosco")
})

module.exports = router