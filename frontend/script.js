const projets = document.querySelector(".projets");
const divGallery = document.createElement("div");
divGallery.classList.add("gallery");
projets.appendChild(divGallery);

function appendWork (travaux) {
    divGallery.innerHTML ='';
    travaux.forEach(travail => {
      const figure = createImageWithCaption(travail.imageUrl, travail.title, travail.title);
      divGallery.appendChild(figure);  
      figure.addEventListener('click', () => {
        console.log(travail.title);
      })
    });
}

function createImageWithCaption(src, alt, caption) {
  const figure = document.createElement('figure');
  const image = document.createElement('img');
  image.setAttribute('src', src);
  image.setAttribute('alt', alt);
  image.crossOrigin = "Anonymous"; // pour permettre l'utilisation de cette ressource se trouvant sur un autre serveur
  figure.appendChild(image);
  const figcaption = document.createElement('figcaption');
  figcaption.textContent = caption;
  figure.appendChild(figcaption);
  return figure;
}

function createFilter(catTravaux, travaux, cats ) {
  const filterContainer = document.querySelector('.container-btn');
  const button = document.createElement('button');
  button.textContent = catTravaux.name;
  button.name = catTravaux.name;
  button.addEventListener('click', ()=> {
    console.log(filterContainer);
    for (const child of filterContainer.children){
      child.classList.remove('button-selected');
    }
    button.classList.add('button-selected');
    let aa = travaux;
    if (catTravaux.id !== null) {
      aa = travaux.filter(element => element.categoryId === catTravaux.id)
    }
    appendWork(aa);
  })
  filterContainer.append(button)
}

async function editorMode(workList) {
  const loginButton = document.querySelector('#loginButton');
  const filtersButton = document.querySelector('.container-btn');

  const editorBar = document.createElement('div');
  editorBar.className = 'editor-bar';  

  const token = sessionStorage.getItem('token');
  const isLogged = token !== null;  

  if (isLogged) {
    console.log('Connected');
    editorBar.innerHTML = '<i class = \' fa-regular fa-pen-to-square \'></i> <p>Mode édition <span>publier les changements</span></p>';
    document.body.prepend(editorBar);
    loginButton.innerText = 'logout';
    filtersButton.innerHTML = '';  


    // MODALE
    let modal = null;
    const modalWorksContainer = document.querySelector('.projets-modal')
    const openModal = async function () {
      modalWorksContainer.innerHTML = ''
      modal = document.querySelector('#modal1')
      modal.style.display = null
      modal.removeAttribute('aria-hidden')
      modal.setAttribute('aria-modal','true')
      modal.addEventListener('click', closeModal)
      modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
      modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
      console.log(workList , modalWorksContainer)
      workList.forEach(element => {
        modalWorkFactory(element);
      }) 
    }    
        
    function appendWork (travaux) {
        divGallery.innerHTML ='';
        travaux.forEach(travail => {
          const figure = createImageWithCaption(travail.imageUrl, travail.title, travail.title);
          divGallery.appendChild(figure);  
          figure.addEventListener('click', () => {
            console.log(travail.title);
          })
        });
    }
    
    // Integration des travaux dans la modale + possibilité de les supprimer
    const modalWorkFactory = function (work) {
      let item = document.createElement('div')
      item.classList.add('gallery-modal');
      item.textContent = 'éditer'
      const image = document.createElement('img');
      image.setAttribute('src', work.imageUrl);
      const removeWorkIcon = document.createElement('i')
      removeWorkIcon.classList.add('fa-solid' , 'fa-trash-can')
      removeWorkIcon.addEventListener('click', async () => {
        const confirmation = confirm(`Voulez-vous vraiment supprimer le travail "${work.title}" ?`);
        if (confirmation) {
          const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }
      });
      item.append(removeWorkIcon)
      image.crossOrigin = "Anonymous"; // pour permettre l'utilisation de cette ressource se trouvant sur un autre serveur
      item.appendChild(image);
      modalWorksContainer.appendChild(item)

      // Afficher la seconde partie de la modale ...
      const addPhotoButton = document.querySelector('.add-photo');
      const modalAddProject = document.querySelector('#js-modal-add-project');
      modalAddProject.addEventListener('click', function(e) {
        e.stopPropagation();
      });
      const firstModal = document.querySelector('#js-modal-first');
      addPhotoButton.addEventListener('click', function() {
        modalAddProject.style.display = null;
        firstModal.style.display = 'none';
      });
      // ... et en revenir
      const buttonComeBackModal = document.querySelector('.js-modal-return');
      buttonComeBackModal.addEventListener('click', function(e) {
        e.stopPropagation();
        modalAddProject.style.display = 'none';
        firstModal.style.display = null;
      });

      // Faire apparaitre l'image chargée et masquer les autres éléments de la div
      const photoInput = document.getElementById('photo-input');
      const selectPhotoDiv = document.querySelector('.select-photo');

      photoInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.addEventListener('load', function() {
      const image = new Image();
      image.src = reader.result;
      selectPhotoDiv.innerHTML = '';
      selectPhotoDiv.appendChild(image);
      });

      if (file) {
      reader.readAsDataURL(file);
      }
      });





// Récupération de l'input valider-photo
const validerPhoto = document.querySelector('#valider-photo');

// Ajout d'un gestionnaire d'événements pour l'événement click
validerPhoto.addEventListener('click', async () => {
  // Récupération de la valeur des champs de saisie
  const image = document.querySelector('#photo-input').files[0];
  const titre = document.querySelector('#title-photo').value;
  const categorie = document.querySelector('#category').value;
  
  // Création de l'objet FormData contenant les données du travail
  const formData = new FormData();
  formData.append('image', image);
  formData.append('title', titre);
  formData.append('category', categorie);

  // Envoi de la requête POST à l'API
  await fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    },
    body: formData
  });

  // Rechargement de la page pour afficher le nouveau travail ajouté
  location.reload();
});












      // Fermer la js-modal-add-project avec l'icone "croix"
      const closeModalTwo = document.querySelector('.js-modal-close-two');
      closeModalTwo.addEventListener('click', function() {
        modal.style.display = 'none';
      });
    }

    // Fermer la first-modale
    const closeModal = function () {
    if (modal === null) return
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
    }

    const stopPropagation = function (e) {
    e.stopPropagation()
    }

    window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
    closeModal(e)
    }
    })

    // Afficher le lien de la modale
    const projectContainerEdit = document.getElementById('modifier-projet-container')

    const editLink = document.createElement('a')
    const editIcon = document.createElement('i')
    editIcon.classList.add('fa-regular' , 'fa-pen-to-square')
    editLink.append(editIcon , 'modifier')
    editLink.href = '#'
    editLink.addEventListener('click' , async function() {
    await openModal()
    })
    projectContainerEdit.appendChild(editLink)
    // FIN MODALE
 
    // Permet de se déconnecter
    loginButton.addEventListener('click', () => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
    });
  } else {
    loginButton.innerText = 'login';
  }
}

// Permet d'afficher les travaux et les filtres sur l'index lorsque l'utilisateur est déconnecté
(async () => {
  let travaux = await (await (fetch("http://localhost:5678/api/works"))).json(); // recuperation de la liste des travaux et qui est de type tableau.
  let categoriesTravaux = await (await (fetch("http://localhost:5678/api/categories"))).json(); // recuperation de la liste des categories
  appendWork(travaux);
  console.log(sessionStorage.getItem('token'));
  createFilter({id:null, name:'Tous'}, travaux, categoriesTravaux)
  categoriesTravaux.forEach(cat => {
  createFilter (cat, travaux, categoriesTravaux)
  })
  await editorMode(travaux);
})();