function toggleDashboardMenu(event) {
    event.stopPropagation();
    var submenu = document.getElementById("submenuDashboard");
    submenu.classList.toggle("ativo");
}