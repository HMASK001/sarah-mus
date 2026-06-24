// 1. Initialisation : Charger le panier au démarrage de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log("Panier.js chargé !");
    afficherLePanier();
    mettreAJourCompteurHeader();
});

// 2. Fonction pour lire le panier depuis la mémoire du navigateur
function obtenirPanier() {
    const panier = localStorage.getItem('panier_sarah_mus');
    return panier ? JSON.parse(panier) : [];
}

// 3. Afficher les articles sur la page panier.html
function afficherLePanier() {
    const conteneurArticles = document.getElementById('articles-panier');
    if (!conteneurArticles) return; // Sécurité : on n'est pas sur la page panier

    const panier = obtenirPanier();
    
    if (panier.length === 0) {
        conteneurArticles.innerHTML = `<p>Votre panier est vide.</p>`;
        updatePrices(0, 0); // Reset des prix
        return;
    }

    let htmlGenere = '';
    let subtotal = 0;

    panier.forEach((item, index) => {
        let itemTotal = item.prix * item.quantite;
        subtotal += itemTotal;

        htmlGenere += `
            <div class="mini-item">
                <img src="${item.image || 'chemise.jpg'}" alt="${item.nom}">
                <div class="mini-details">
                    <h4>${item.nom}</h4>
                    <p>Taille: ${item.taille || 'Unique'} | Couleur: ${item.couleur || 'Unique'}</p>
                    <p>Qté : ${item.quantite}</p>
                </div>
                <span>${itemTotal.toFixed(2)} $</span>
                <button onclick="supprimerArticle(${index})">🗑️</button>
            </div>
        `;
    });

    conteneurArticles.innerHTML = htmlGenere;
    
    // Règle de livraison : Offerte dès 70$, sinon 9.90$
    let shipping = subtotal < 70 ? 9.90 : 0;
    updatePrices(subtotal, shipping);
}

// 4. Mise à jour sécurisée des prix (évite les erreurs null)
function updatePrices(subtotal, shipping) {
    let total = subtotal + shipping;
    let shippingText = shipping === 0 ? "OFFERT" : shipping.toFixed(2) + " $";

    // Sécurisation : on teste si l'élément existe avant d'écrire dedans
    const ids = {
        "sidebar-subtotal": subtotal.toFixed(2) + " $",
        "sidebar-shipping": shippingText,
        "sidebar-total": total.toFixed(2) + " $",
        "subtotal-val": subtotal.toFixed(2) + " $"
    };

    for (let id in ids) {
        let el = document.getElementById(id);
        if (el) el.innerText = ids[id];
    }
}

// 5. Supprimer un article
window.supprimerArticle = function(index) {
    let panier = obtenirPanier();
    panier.splice(index, 1);
    localStorage.setItem('panier_sarah_mus', JSON.stringify(panier));
    afficherLePanier();
    mettreAJourCompteurHeader();
};

// 6. Vider tout le panier
window.viderLePanier = function() {
    if (confirm("Vider tout le panier ?")) {
        localStorage.removeItem('panier_sarah_mus');
        afficherLePanier();
        mettreAJourCompteurHeader();
    }
};

// 7. Mise à jour du compteur dans le menu (Header)
function mettreAJourCompteurHeader() {
    const panier = obtenirPanier();
    const totalArticles = panier.reduce((total, item) => total + item.quantite, 0);
    const compteurs = document.querySelectorAll('.nb-panier, #cart-count');
    
    compteurs.forEach(el => {
        el.textContent = `(${totalArticles})`;
    });
};