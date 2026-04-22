function loadingModal() {
    const barra = document.getElementById("preenchimento");
    const modal = document.getElementById("modal");
    let progresso = 0;
    const timer = setInterval(() => {
        progresso++;
        barra.style.width = progresso + "%";

        if (progresso >= 100) {
            clearInterval(timer);
            modal.style.display = "none";
        }
    }, 30);
}




