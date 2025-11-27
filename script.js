// -----------------------------
//  Registro e inicio de sesión
// -----------------------------
function registrarUsuario() {
  const usuario = document.getElementById("newUser").value.trim();
  const contraseña = document.getElementById("newPass").value.trim();

  if (!usuario || !contraseña) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  if (usuarios.find(u => u.usuario === usuario)) {
    alert(" Ese usuario ya existe.");
    return;
  }

  usuarios.push({ usuario, contraseña, puntajeMax: 0 });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert(" Usuario registrado con éxito.");
}

function iniciarSesion() {
  const usuario = document.getElementById("loginUser").value.trim();
  const contraseña = document.getElementById("loginPass").value.trim();

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const userFound = usuarios.find(u => u.usuario === usuario && u.contraseña === contraseña);

  if (userFound) {
    localStorage.setItem("usuarioActivo", usuario);
    mostrarJuego(usuario);
  } else {
    alert(" Usuario o contraseña incorrectos.");
  }
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  location.reload();
}

// -----------------------------
// 🎮 Juego: Caza a los Monstruos
// -----------------------------
let score = 0;
let tiempo = 30;
let intervaloTiempo;
let gameRunning = false;

function mostrarJuego(usuario) {
  document.getElementById("authContainer").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");
  document.getElementById("userName").textContent = usuario;
  iniciarJuego();
}

function iniciarJuego() {
  score = 0;
  tiempo = 30;
  gameRunning = true;
  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = tiempo;
  document.getElementById("gameOver").classList.add("hidden");

  intervaloTiempo = setInterval(() => {
    tiempo--;
    document.getElementById("timer").textContent = tiempo;

    if (tiempo <= 0) {
      terminarJuego();
    } else {
      crearMonstruo();
    }
  }, 1000);
}

function crearMonstruo() {
  const gameArea = document.getElementById("gameArea");
  const monster = document.createElement("div");
  monster.classList.add("monster");

  const size = Math.random() * 40 + 50;
  monster.style.width = `${size}px`;
  monster.style.height = `${size}px`;

  const posX = Math.random() * (gameArea.offsetWidth - size);
  const posY = Math.random() * (gameArea.offsetHeight - size);
  monster.style.left = `${posX}px`;
  monster.style.top = `${posY}px`;

  monster.addEventListener("click", () => {
    if (gameRunning) {
      score++;
      document.getElementById("score").textContent = score;
      monster.remove();
    }
  });

  gameArea.appendChild(monster);

  // Monstruo desaparece si no se clickea
  setTimeout(() => {
    if (monster.parentNode) {
      score--;
      monster.remove();
      document.getElementById("score").textContent = score;
    }
  }, 800);
}

function terminarJuego() {
  gameRunning = false;
  clearInterval(intervaloTiempo);
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOver").classList.remove("hidden");

  // Guardar mejor puntuación
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const user = usuarios.find(u => u.usuario === usuarioActivo);
  if (user && score > (user.puntajeMax || 0)) {
    user.puntajeMax = score;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
}

function reiniciarJuego() {
  document.getElementById("gameOver").classList.add("hidden");
  iniciarJuego();
}

// -----------------------------
//  Ranking global
// -----------------------------
function mostrarRanking() {
  const tabla = document.getElementById("tablaRanking");
  const cuerpo = document.getElementById("rankingBody");
  cuerpo.innerHTML = "";

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.length === 0) {
    cuerpo.innerHTML = "<tr><td colspan='3'>No hay usuarios registrados.</td></tr>";
    tabla.classList.remove("hidden");
    return;
  }

  usuarios.sort((a, b) => (b.puntajeMax || 0) - (a.puntajeMax || 0));

  usuarios.forEach((u, i) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${u.usuario}</td>
      <td>${u.puntajeMax || 0}</td>
    `;
    cuerpo.appendChild(fila);
  });

  tabla.classList.toggle("hidden");
}

// -----------------------------
// Sesión activa
// -----------------------------
window.onload = function () {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (usuarioActivo) mostrarJuego(usuarioActivo);
};
