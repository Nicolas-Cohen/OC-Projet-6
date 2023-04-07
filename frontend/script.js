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

function editorMode() {
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

    const openModal = function () {
    modal = document.querySelector('#modal1')
    modal.style.display = null
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal','true')
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    }

    

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

    const projectContainerEdit = document.getElementById('modifier-projet-container')

    const editLink = document.createElement('a')
    const editIcon = document.createElement('i')
    editIcon.classList.add('fa-regular' , 'fa-pen-to-square')
    editLink.append(editIcon , 'modifier')
    editLink.href = '#'
    editLink.addEventListener('click' , function() {
    openModal()
    })
    projectContainerEdit.appendChild(editLink)
    // FIN MODALE
 
    loginButton.addEventListener('click', () => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
    });
  } else {
    loginButton.innerText = 'login';
  }
}

(async () => {
  let travaux = await (await (fetch("http://localhost:5678/api/works"))).json(); // recuperation de la liste des travaux et qui est de type tableau.
  let categoriesTravaux = await (await (fetch("http://localhost:5678/api/categories"))).json(); // recuperation de la liste des categories
  appendWork(travaux);
  console.log(sessionStorage.getItem('token'));
  createFilter({id:null, name:'Tous'}, travaux, categoriesTravaux)
  categoriesTravaux.forEach(cat => {
  createFilter (cat, travaux, categoriesTravaux)
  })
  editorMode();
})();