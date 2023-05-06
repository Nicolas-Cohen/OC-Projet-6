const projets = document.querySelector(".projets");
const divGallery = document.createElement("div");
divGallery.classList.add("gallery");
projets.appendChild(divGallery);
const token = sessionStorage.getItem('token');
const isLogged = token !== null;

async function fetchTravaux() {
  const data = await (await (fetch("http://localhost:5678/api/works"))).json();
  return data
}

async function fetchCaterories() {
  const data = await (await (fetch("http://localhost:5678/api/categories"))).json();
  return data
}

function appendWork(travaux) {
  divGallery.innerHTML = '';
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

function createFilter(catTravaux, travaux, cats) {
  const filterContainer = document.querySelector('.container-btn');
  const button = document.createElement('button');
  button.textContent = catTravaux.name;
  button.name = catTravaux.name;
  button.addEventListener('click', () => {
    console.log(filterContainer);
    for (const child of filterContainer.children) {
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

function appendWork(travaux) {
  divGallery.innerHTML = '';
  travaux.forEach(travail => {
    const figure = createImageWithCaption(travail.imageUrl, travail.title, travail.title);
    divGallery.appendChild(figure);
    figure.addEventListener('click', () => {
      console.log(travail.title);
    })
  });
}

// Permet d'afficher les travaux et les filtres sur l'index lorsque l'utilisateur est déconnecté
(async () => {
  let travaux = await fetchTravaux(); // recuperation de la liste des travaux et qui est de type tableau.
  let categoriesTravaux = await fetchCaterories(); // recuperation de la liste des categories
  appendWork(travaux);
  createFilter({ id: null, name: 'Tous' }, travaux, categoriesTravaux)
  categoriesTravaux.forEach(cat => {
    createFilter(cat, travaux, categoriesTravaux)
  })

  const loginButton = document.querySelector('#loginButton');
  const filtersButton = document.querySelector('.container-btn');

  const editorBar = document.createElement('div');
  editorBar.className = 'editor-bar';

  if (isLogged) {
    console.log('Connected');
    editorBar.innerHTML = '<i class = \' fa-regular fa-pen-to-square \'></i> <p>Mode édition <span>publier les changements</span></p>';
    document.body.prepend(editorBar);
    loginButton.innerText = 'logout';
    filtersButton.innerHTML = '';

    const buttonComeBackModal = document.querySelector('.js-modal-return');

    // MODALE
    let modal = null;
    const modalWorksContainer = document.querySelector('.projets-modal')

    // Function d'ouverture de la modale
    const openModal = async function (workList) {
      modalWorksContainer.innerHTML = ''
      modal = document.querySelector('#modal1')
      modal.style.display = null
      modal.removeAttribute('aria-hidden')
      modal.setAttribute('aria-modal', 'true')
      modal.addEventListener('click', closeModal)
      modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
      modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
      console.log(workList, modalWorksContainer)
      workList.forEach(element => {
        modalWorkFactory(element);
      });

      // Afficher la seconde partie de la modale ...
      const addPhotoButton = document.querySelector('.add-photo');
      const modalAddProject = document.querySelector('#js-modal-add-project');
      modalAddProject.addEventListener('click', function (e) {
        e.stopPropagation();
      });
      const firstModal = document.querySelector('#js-modal-first');
      addPhotoButton.addEventListener('click', function () {
        modalAddProject.style.display = null;
        firstModal.style.display = 'none';
      });
      // ... et en revenir
      buttonComeBackModal.addEventListener('click', function (e) {
        e.stopPropagation();
        modalAddProject.style.display = 'none';
        firstModal.style.display = null;
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
      removeWorkIcon.classList.add('fa-solid', 'fa-trash-can')
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
      item.append(removeWorkIcon)
      image.crossOrigin = "Anonymous"; // pour permettre l'utilisation de cette ressource se trouvant sur un autre serveur
      item.appendChild(image);
      modalWorksContainer.appendChild(item)
    }

    // Faire apparaitre l'image chargée et masquer les autres éléments de la div
    const photoInput = document.getElementById('photo-input');
    const selectPhotoDiv = document.querySelector('.select-photo');

    photoInput.addEventListener('change', function (event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.addEventListener('load', function () {
        const image = new Image();
        image.src = reader.result;
        image.style.width = '40%';
        selectPhotoDiv.style.display = 'none';
        const imageFormDisplay = document.querySelector('.imageFormDisplay')
        imageFormDisplay.innerHTML = ''; // supprimer l'image précédente
        imageFormDisplay.appendChild(image);
      });

      if (file) {
        reader.readAsDataURL(file);
      }
    });

    // Ajout des travaux dans l'API 
    const validerPhoto = document.querySelector('#valider-photo');
    const modalForm = document.querySelector('.modal-form');
    validerPhoto.addEventListener('click', async (e) => {
      e.preventDefault();
      const imageInput = document.querySelector('#photo-input');
      const image = imageInput.files[0];
      const titre = document.querySelector('#title-photo').value;
      const categorie = document.querySelector('#category').value;
      const formData = new FormData();
      formData.append('image', image);
      formData.append('title', titre);
      formData.append('category', +categorie);
      console.log(categorie)
      fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formData
      }).then((response) => {
        fetchTravaux().then(data => {
          appendWork(data)
          openModal(data);
        })
        // Afficher la premiere partie de la modale ...
        const modalAddProject = document.querySelector('#js-modal-add-project');
        const firstModal = document.querySelector('#js-modal-first');
        // ... et en revenir
          modalAddProject.style.display = 'none';
          firstModal.style.display = null;
      })
    });

    // Fermer la js-modal-add-project avec l'icone "croix"
    const closeModalTwo = document.querySelector('.js-modal-close-two');
    closeModalTwo.addEventListener('click', function () {
      modal.style.display = 'none';
    });

    // Fermer la modale
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

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e)
      }
    })

    // Afficher le lien de la modale
    const projectContainerEdit = document.getElementById('modifier-projet-container-one')

    const editLink = document.createElement('a')
    const editIcon = document.createElement('i')
    editIcon.classList.add('fa-regular', 'fa-pen-to-square')
    editLink.append(editIcon, 'modifier')
    editLink.href = '#'
    editLink.addEventListener('click', async function () {
      fetchTravaux().then(data => {
        openModal(data);
      })
    })
    projectContainerEdit.appendChild(editLink)

    const editLinkClone1 = editLink.cloneNode(true);
    const editLinkClone2 = editLink.cloneNode(true);
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
    // FIN MODALE

    // Permet de se déconnecter
    loginButton.addEventListener('click', () => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
    });
  } else {
    loginButton.innerText = 'login';
  }
})();