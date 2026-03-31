// function fnNavegar(local) {
//   window.location.href = local;
// }

// validarSessao();
// function validarSessao() {
//   var email = sessionStorage.EMAIL_USUARIO ? sessionStorage.EMAIL_USUARIO : null ;
//   var nome = sessionStorage.NOME_USUARIO ? sessionStorage.NOME_USUARIO : null;

//   var b_usuario = document.getElementById("b_usuario");

//   if (email != null && nome != null) {
//     b_usuario.innerHTML = nome;
//   } else {
//     console.log("AAAAAAAA");
//     window.location.href = "/pages/loginlogout/login.html";
//   }
// }



// DASHBOARD


// Precisa do DOMcontentLoaded, pq garante que os elementos do html carreguem antes de pegar o id do char, saco?
document.addEventListener('DOMContentLoaded', () => {

const ctx = document.getElementById('chartusomedio');

const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    datasets: [
        {
            label: 'Dataset 1',
      data: [10, 20, -30, 40, 50, -20, 70],
      borderColor: 'red',
      backgroundColor: 'rgba(255, 0, 0, 0.5)',
    },
    {
        label: 'Dataset 2',
        data: [-20, 30, 40, -10, 60, 20, 10],
      borderColor: 'blue',
      backgroundColor: 'rgba(0, 0, 255, 0.5)',
    }
]
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
};

new Chart(ctx, config);

});
