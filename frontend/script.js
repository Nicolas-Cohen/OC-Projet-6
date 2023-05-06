const projets = document.querySelector(".projets");
const divGallery = document.createElement("div");
divGallery.classList.add("gallery");
projets.appendChild(divGallery);
const token = sessionStorage.getItem('token');
const isLogged = token !== null;

// Utilisation de fetch pour envoyer une requête à l'API =
// Ici on extrait les travaux :
async function fetchTravaux() {
  const data = await (await (fetch("http://localhost:5678/api/works"))).json();
  return data
}
// Ici on extrait les catégories :
async function fetchCaterories() {
  const data = await (await (fetch("http://localhost:5678/api/categories"))).json();
  return data
}

// Création des éléments HTML des données extraites :
function appendWork(travaux) {
  // On vide le contenu précédent de l'élément divGallery
  divGallery.innerHTML = '';
  travaux.forEach(travail => {
    // On crée un élément HTML de type figure pour chaque travail
    const figure = createImageWithCaption(travail.imageUrl, travail.title, travail.title);
    // On ajoute l'élément figure à l'élément divGallery
    divGallery.appendChild(figure);
    // On ajoute un événement de clic sur l'élément figure pour afficher le titre du travail dans la console
    figure.addEventListener('click', () => {
      console.log(travail.title);
    })
  });
}

function createImageWithCaption(src, alt, caption) {
  // On crée un élément HTML de type figure
  const figure = document.createElement('figure');
  // On crée un élément HTML de type img et on lui attribue sa source et un texte alternatif
  const image = document.createElement('img');
  image.setAttribute('src', src);
  image.setAttribute('alt', alt);
  // On permet l'utilisation de cette ressource se trouvant sur un autre serveur
  image.crossOrigin = "Anonymous";
  // On ajoute l'élément img à l'élément figure
  figure.appendChild(image);
  // On crée un élément HTML de type figcaption pour le titre de l'image et on lui attribue le texte de la légende
  const figcaption = document.createElement('figcaption');
  figcaption.textContent = caption;
  // On ajoute l'élément figcaption à l'élément figure
  figure.appendChild(figcaption);
  // On renvoie l'élément figure créé
  return figure;
}

function createFilter(catTravaux, travaux, cats) {
  // On sélectionne l'élément HTML qui contiendra le bouton de filtre
  const filterContainer = document.querySelector('.container-btn');
  // On crée un bouton pour le filtre et on lui attribue le nom de la catégorie de travaux
  const button = document.createElement('button');
  button.textContent = catTravaux.name;
  button.name = catTravaux.name;
  // On ajoute un événement de clic sur le bouton pour filtrer les travaux correspondant à la catégorie sélectionnée
  button.addEventListener('click', () => {
    // On affiche l'élément HTML filterContainer dans la console pour vérification
    console.log(filterContainer);
    // On enlève la classe 'button-selected' de tous les enfants de l'élément HTML filterContainer
    for (const child of filterContainer.children) {
      child.classList.remove('button-selected');
    }
    // On ajoute la classe 'button-selected' au bouton sélectionné
    button.classList.add('button-selected');
    // On filtre les travaux en fonction de la catégorie sélectionnée
    let aa = travaux;
    if (catTravaux.id !== null) {
      aa = travaux.filter(element => element.categoryId === catTravaux.id)
    }
    // On affiche les travaux filtrés en appelant la fonction appendWork()
    appendWork(aa);
  })
  // On ajoute le bouton créé à l'élément HTML filterContainer
  filterContainer.append(button)
}

// Fonction qui remplit l'élément HTML divGallery avec les images des travaux en question :
function appendWork(travaux) {
  // On vide le contenu HTML de l'élément divGallery
  divGallery.innerHTML = '';
  // Pour chaque travail dans le tableau travaux, on crée une figure 
  travaux.forEach(travail => {
    const figure = createImageWithCaption(travail.imageUrl, travail.title, travail.title);
    divGallery.appendChild(figure);
    // On ajoute un événement qui affiche le titre du travail dans la console
    figure.addEventListener('click', () => {
      console.log(travail.title);
    })
  });
}

// Permet d'afficher les travaux et les filtres sur l'index lorsque l'utilisateur est déconnecté
(async () => {
  // On attend de récupérer les travaux et les catégories depuis le serveur
  let travaux = await fetchTravaux();
  let categoriesTravaux = await fetchCaterories();
  // On appelle la fonction pour afficher les images des travaux récupérés
  appendWork(travaux);
  // On crée un bouton de filtre "Tous" pour afficher tous les travaux
  createFilter({ id: null, name: 'Tous' }, travaux, categoriesTravaux)
  // On crée des boutons de filtre pour chaque catégorie de travaux
  categoriesTravaux.forEach(cat => {
    createFilter(cat, travaux, categoriesTravaux)
  })
  // On sélectionne l'élément de bouton de connexion et l'élément de conteneur de boutons de filtre
  const loginButton = document.querySelector('#loginButton');
  const filtersButton = document.querySelector('.container-btn');
  // On crée un élément de barre d'éditeur et on lui ajoute une classe CSS
  const editorBar = document.createElement('div');
  editorBar.className = 'editor-bar';

  // Si l'utilisateur est connecté
  if (isLogged) {
    // Afficher un message dans la console pour confirmer la connexion
    console.log('Connected');
    // Ajouter un bouton "Mode édition" avec un icône et un texte à la barre d'édition
    editorBar.innerHTML = '<i class = \' fa-regular fa-pen-to-square \'></i> <p>Mode édition <span>publier les changements</span></p>';
    // Ajouter la barre d'édition au début du corps de la page
    document.body.prepend(editorBar);
    // Modifier le texte du bouton de connexion pour qu'il dise "Déconnexion"
    loginButton.innerText = 'logout';
    // Suppression de tous les filtres
    filtersButton.innerHTML = '';

    // Trouver le bouton de retour dans la modal
    const buttonComeBackModal = document.querySelector('.js-modal-return');

    // Initialiser la modal à null
    let modal = null;
    // Trouver le conteneur de travaux dans la modal
    const modalWorksContainer = document.querySelector('.projets-modal')

    // Fonction asynchrone qui ouvre la modal avec une liste de travaux
    const openModal = async function (workList) {
      // Vider le conteneur de travaux
      modalWorksContainer.innerHTML = ''
      // Trouver la modal
      modal = document.querySelector('#modal1')
      // Afficher la modal
      modal.style.display = null
      // Supprimer l'attribut aria-hidden de la modal
      modal.removeAttribute('aria-hidden')
      // Ajouter l'attribut aria-modal à la modal
      modal.setAttribute('aria-modal', 'true')
      // Fermer la modal quand on clique sur l'écouteur d'événement
      modal.addEventListener('click', closeModal)
      // Trouver le bouton de fermeture de la modal et ajouter un écouteur d'événements qui ferme la modal quand on clique dessus
      modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
      // Trouver le bouton stop de la modal et ajouter un écouteur d'événements qui arrête la propagation de l'événement quand on clique dessus
      modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
      // Afficher dans la console la liste de travaux et le conteneur de travaux dans la modal
      console.log(workList, modalWorksContainer)
      // Pour chaque travail dans la liste, créer un élément de travail dans la modal
      workList.forEach(element => {
        modalWorkFactory(element);
      });

      // Afficher la seconde partie de la modale :
      // Récupération de l'élément HTML du bouton "Ajouter une photo"
      const addPhotoButton = document.querySelector('.add-photo');
      // Récupération de l'élément HTML de la fenêtre modale pour ajouter un projet
      const modalAddProject = document.querySelector('#js-modal-add-project');
      // Ajout d'un gestionnaire d'événement pour empêcher la propagation de l'événement de clic sur la fenêtre modale
      modalAddProject.addEventListener('click', function (e) {
        e.stopPropagation();
      });
      // Récupération de l'élément HTML de la première fenêtre modale
      const firstModal = document.querySelector('#js-modal-first');
      // Ajout d'un gestionnaire d'événement pour afficher la fenêtre modale pour ajouter un projet lorsqu'on clique sur le bouton "Ajouter une photo"
      addPhotoButton.addEventListener('click', function () {
        modalAddProject.style.display = null;
        firstModal.style.display = 'none';
      });

      // On ajoute un événement au bouton de retour dans la modal pour empêcher la propagation de l'événement
      buttonComeBackModal.addEventListener('click', function (e) {
        e.stopPropagation();
        // On cache la modal d'ajout de projet et on réaffiche la première modal
        modalAddProject.style.display = 'none';
        firstModal.style.display = null;
      });
    }

    // Fonction pour créer un élément de travail dans la galerie modale
    const modalWorkFactory = function (work) {
      let item = document.createElement('div')
      item.classList.add('gallery-modal');
      // Ajout d'un texte
      item.textContent = 'éditer'
      // Création de l'élément image
      const image = document.createElement('img');
      image.setAttribute('src', work.imageUrl);
      // Création de l'icône de suppression
      const removeWorkIcon = document.createElement('i')
      removeWorkIcon.classList.add('fa-solid', 'fa-trash-can')
      // Ajout d'un écouteur d'événement pour la suppression du travail
      removeWorkIcon.addEventListener('click', async () => {
        const confirmation = confirm(`Voulez-vous vraiment supprimer le travail "${work.title}" ?`);
        if (confirmation) {
          const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then(() => {
            item.remove();
            fetchTravaux().then(data => appendWork(data))
          });
        }
      });
      // Ajout de l'icône de suppression à l'élément de travail
      item.append(removeWorkIcon)
      // Autoriser l'utilisation de la ressource sur un autre serveur
      image.crossOrigin = "Anonymous";
      // Ajout de l'élément image à l'élément de travail
      item.appendChild(image);
      // Ajout de l'élément de travail à la galerie modale
      modalWorksContainer.appendChild(item)
    }

    // Sélectionner l'élément input pour les fichiers
    const photoInput = document.getElementById('photo-input');
    // Sélectionner la div pour afficher la photo sélectionnée
    const selectPhotoDiv = document.querySelector('.select-photo');
    // Ajouter un écouteur d'événement pour le changement de la sélection de fichier
    photoInput.addEventListener('change', function (event) {
      // Récupérer le fichier sélectionné
      const file = event.target.files[0];
      // Créer un objet FileReader
      const reader = new FileReader();
      // Ajouter un écouteur d'événement pour le chargement du fichier
      reader.addEventListener('load', function () {
        // Créer un nouvel objet Image
        const image = new Image();
        // Définir la source de l'image sur le contenu du fichier chargé
        image.src = reader.result;
        // Définir la largeur de l'image à 40%
        image.style.width = '40%';
        // Cacher la div pour la sélection de la photo
        selectPhotoDiv.style.display = 'none';
        // Sélectionner la div pour afficher l'image
        const imageFormDisplay = document.querySelector('.imageFormDisplay')
        // Vider le contenu précédent de la div
        imageFormDisplay.innerHTML = '';
        // Ajouter l'image à la div
        imageFormDisplay.appendChild(image);
      });

      // Si un fichier est sélectionné
      if (file) {
        // Lit le contenu du fichier sous forme de Data URL
        reader.readAsDataURL(file);
      }
    });
    // Sélectionne le bouton de validation de la photo
    const validerPhoto = document.querySelector('#valider-photo');
    // Sélectionne le formulaire modal
    const modalForm = document.querySelector('.modal-form');
    // Ajoute un écouteur d'événements sur le bouton de validation de la photo
    validerPhoto.addEventListener('click', async (e) => {
      e.preventDefault(); // Empêche le comportement par défaut de l'événement
      // Récupère l'élément input de la photo et son fichier sélectionné
      const imageInput = document.querySelector('#photo-input');
      const image = imageInput.files[0];
      // Récupère le titre et la catégorie saisis par l'utilisateur
      const titre = document.querySelector('#title-photo').value;
      const categorie = document.querySelector('#category').value;
      // Crée un objet FormData pour envoyer les données au serveur
      const formData = new FormData();
      formData.append('image', image);
      formData.append('title', titre);
      formData.append('category', +categorie);
      // Envoie les données au serveur via une requête POST avec fetch
      fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formData
      }).then((response) => {
        // Après avoir reçu une réponse du serveur, récupère les travaux mis à jour
        fetchTravaux().then(data => {
          // Ajoute les travaux mis à jour au DOM
          appendWork(data)
          // Ouvre le modal avec les travaux mis à jour
          openModal(data);
        })

        // Sélectionne les éléments modaux pour la première et la deuxième modale
        const modalAddProject = document.querySelector('#js-modal-add-project');
        const firstModal = document.querySelector('#js-modal-first');
        // Cache la deuxième modale et affiche la première modale
        modalAddProject.style.display = 'none';
        firstModal.style.display = null;
      })
    });
    // Ajoute un gestionnaire d'événements pour fermer la deuxième modale
    const closeModalTwo = document.querySelector('.js-modal-close-two');
    closeModalTwo.addEventListener('click', function () {
      modal.style.display = 'none';
    });

    // Ferme la modal et effectue le nettoyage des événements associés.
    const closeModal = function () {
      // Vérifie si la modal est définie
      if (modal === null) return;
      // Cache la modal et ajuste les attributs aria
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      // Retire les écouteurs d'événements
      modal.removeEventListener('click', closeModal);
      modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
      modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
      // Réinitialise la variable modal
      modal = null;
    }

    // Création d'une fonction qui stoppe la propagation d'un événement
    const stopPropagation = function (e) {
      e.stopPropagation()
    }

    // Ajout d'un événement sur la touche échappement pour fermer le modal
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e)
      }
    })

    // Récupération de l'élément qui contiendra le bouton "modifier"
    const projectContainerEdit = document.getElementById('modifier-projet-container-one')

    // Création du lien "modifier"
    const editLink = document.createElement('a')
    const editIcon = document.createElement('i')
    editIcon.classList.add('fa-regular', 'fa-pen-to-square') // Ajout de classes pour l'icône
    editLink.append(editIcon, 'modifier') // Ajout de l'icône et du texte "modifier" au lien
    editLink.href = '#' // Définition du lien
    editLink.addEventListener('click', async function () { // Ajout d'un événement sur le clic du lien
      fetchTravaux().then(data => { // Appel de la fonction qui renvoie une promesse résolue avec des données
        openModal(data); // Appel de la fonction pour ouvrir la modal avec les données récupérées
      })
    })

    projectContainerEdit.appendChild(editLink) // Ajout du lien au conteneur correspondant

    // Clone le lien pour le réutiliser avec un autre conteneur
    const editLinkClone1 = editLink.cloneNode(true);
    const editLinkClone2 = editLink.cloneNode(true);

    // Ajoute les liens clonés aux différents conteneurs
    document.getElementById('modifier-projet-container-two').appendChild(editLinkClone1);
    editLinkClone1.addEventListener('click', async function () {
      fetchTravaux().then(data => {
        openModal(data);
      })
    })
    document.getElementById('modifier-projet-container-three').appendChild(editLinkClone2);
    editLinkClone2.addEventListener('click', async function () {
      fetchTravaux().then(data => {
        openModal(data);
      })
    })

    // Permet de se déconnecter :
    // Ajout d'un événement sur le bouton de déconnexion
    loginButton.addEventListener('click', () => {
      // Suppression du token et de l'ID utilisateur de la session storage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
    });
    // Si l'utilisateur n'est pas connecté, changer le texte du bouton de connexion
  } else {
    loginButton.innerText = 'login';
  }
})();