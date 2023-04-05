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
  const editOne = document.querySelector('#editOne');
  const editTwo = document.querySelector('#editTwo');

  const editorBar = document. createElement ('div');
  editorBar.className = 'editor-bar';

  const token = sessionStorage.getItem('token');
  const isLogged = token !== null;
  if (isLogged) {
    console.log('Connected');
    editOne.innerHTML = '<div class = \'edit\'><i class = \' fa-regular fa-pen-to-square \'></i>modifier<div>';
    editorBar.innerHTML = '<i class = \' fa-regular fa-pen-to-square \'></i> <p>Mode édition <span>publier les changements</span></p>';
    loginButton.innerText = 'logout';
    filtersButton.innerHTML = '';
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
  editorMode();
  })
})();