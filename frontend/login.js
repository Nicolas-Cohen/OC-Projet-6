const loginForm = document.getElementById('loginForm');
const error = document.querySelector('#error-message');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  // Récupérer les informations de connexion du formulaire
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Envoyer les informations de connexion à l'API pour authentification
  const response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (response.status === 200) {
    // Récupérer le jeton d'authentification depuis la réponse de l'API
    const token = await response.json();
    console.log(token) 

    // Enregistrer le jeton d'authentification dans le stockage local
    sessionStorage.setItem('token', token.token);
    sessionStorage.setItem('userId', token.userId);

    // redirige l'utilisateur vers la page d'accueil  
    window.location.href = 'index.html';

  } else {
    // Afficher un message d'erreur si les informations de connexion sont invalides
    error.textContent = 'Nom d\'utilisateur ou mot de passe incorrect.';
  }
});

