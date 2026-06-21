
    function chargerPanier() {
        // Récupère les articles sauvegardés dans le localStorage
        const panier = JSON.parse(localStorage.getItem("panier")) || [];
        
        // 1. Mise à jour dynamique des compteurs textuels de la page
        document.getElementById("header-cart-count").innerText = panier.length;
        document.getElementById("cart-title-count").innerText = `Mon Panier (${panier.length})`;
        document.getElementById("summary-items-text").innerText = `Sous-total (${panier.length} articles)`;

        const mainContainer = document.getElementById("main-cart-items");
        const miniContainer = document.getElementById("summary-items-list");
        
        let subtotal = 0;

        // Si le panier est vide
        if (panier.length === 0) {
            mainContainer.innerHTML = "<p style='padding: 30px 0; color: #777; font-size: 14px;'>Votre panier est vide.</p>";
            miniContainer.innerHTML = "<p style='font-size:13px; color:#999;'>Aucun article.</p>";
            updatePrices(0, 0);
            return;
        }

        // Réinitialisation des zones avant injection
        mainContainer.innerHTML = "";
        miniContainer.innerHTML = "";

        // 2. Boucle sur chaque article pour l'ajouter dans la case (Mon Panier) et le résumé
        panier.forEach((item, index) => {
            // Sécurité au cas où le prix est stocké sous forme de chaîne (ex: "249.00")
            let itemPrice = parseFloat(item.price) || 0;
            let itemTotal = itemPrice * item.quantity;
            subtotal += itemTotal;

            // Remplissage de la grande table du HAUT (case Mon Panier)
            mainContainer.innerHTML += `
                <div class="cart-item-row">
                    <div class="cart-product-info">
                        <img src="${item.image || 'chemise.jpg'}" alt="${item.title}">
                        <div class="cart-product-details">
                            <h4>${item.title}</h4>
                            <p>Couleur : ${item.color || 'Unique'}</p>
                            <p>Taille : ${item.size || 'Unique'}</p>
                        </div>
                    </div>
                    <div>${itemPrice.toFixed(2)} $</div>
                    <div>
                        <div class="qty-control">
                            <button onclick="modifierQuantite(${index}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="modifierQuantite(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div style="font-weight:500;">${itemTotal.toFixed(2)} $</div>
                    <div>
                        <button class="btn-delete" onclick="supprimerArticle(${index})">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;

            // Remplissage du mini récapitulatif de la COMMANDE en BAS
            miniContainer.innerHTML += `
                <div class="mini-item">
                    <img src="${item.image || 'chemise.jpg'}" alt="${item.title}">
                    <div class="mini-details">
                        <h4>${item.title}</h4>
                        <p>${item.color || 'Unique'} / ${item.size || 'Unique'}</p>
                        <p>Qté : ${item.quantity}</p>
                    </div>
                    <span class="mini-price">${itemTotal.toFixed(2)} $</span>
                </div>
            `;
        });

        // Règle de livraison : Offerte dès 70$, sinon 9.90$
        let shipping = subtotal < 70 ? 9.90 : 0;
        updatePrices(subtotal, shipping);
    }

    // Fonction centrale pour calculer et afficher les prix partout
    function updatePrices(subtotal, shipping) {
        let total = subtotal + shipping;
        let shippingText = shipping === 0 ? "OFFERT" : shipping.toFixed(2) + " $";

        // Synchronisation du bloc Récapitulatif du HAUT
        document.getElementById("sidebar-subtotal").innerText = subtotal.toFixed(2) + " $";
        document.getElementById("sidebar-shipping").innerText = shippingText;
        document.getElementById("sidebar-total").innerText = total.toFixed(2) + " $";

        // Synchronisation du bloc Votre Commande du BAS
        document.getElementById("subtotal-val").innerText = subtotal.toFixed(2) + " $";
        document.getElementById("shipping-val").innerText = shippingText;
        document.getElementById("total-val").innerText = total.toFixed(2) + " $";
    }

    // Gestionnaire de changement de quantité (+ / -)
    function modifierQuantite(index, changement) {
        let panier = JSON.parse(localStorage.getItem("panier")) || [];
        panier[index].quantity += changement;
        
        // Si la quantité descend à 0, on la bloque à 1 (ou on supprime selon ton choix)
        if (panier[index].quantity <= 0) panier[index].quantity = 1;
        
        localStorage.setItem("panier", JSON.stringify(panier));
        chargerPanier(); // Relance la synchronisation visuelle immédiatement
    }

    // Supprimer un article spécifique via l'icône poubelle
    function supprimerArticle(index) {
        let panier = JSON.parse(localStorage.getItem("panier")) || [];
        panier.splice(index, 1); // Retire l'élément du tableau
        localStorage.setItem("panier", JSON.stringify(panier));
        chargerPanier();
    }

    // Vider l'intégralité du panier d'un coup
    function viderLePanier() {
        if(confirm("Voulez-vous vraiment vider votre panier ?")) {
            localStorage.removeItem("panier");
            chargerPanier();
        }
    }

    // Écouteur pour charger le panier dès que le document HTML est prêt
    document.addEventListener("DOMContentLoaded", chargerPanier);
    const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');

const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("access_key", "2dfeac08-f16e-4fdc-9252-a987cecaa4fd");

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});
document.addEventListener('DOMContentLoaded', function() {
    afficherLePanier();
});

function afficherLePanier() {
    // On récupère les éléments HTML du panier
    const conteneurArticles = document.getElementById('articles-panier'); // Crée cet ID dans ton HTML là où vont les lignes
    const totalSousTotal = document.getElementById('sous-total-prix');   // ID pour le sous-total
    const totalFinal = document.getElementById('total-prix');           // ID pour le prix final
    
    const panier = JSON.parse(localStorage.getItem('panier_sarah_mus')) || [];
    
    if (!conteneurArticles) return; // Sécurité si on n'est pas sur la bonne page

    // Si le panier est vide
    if (panier.length === 0) {
        conteneurArticles.innerHTML = `<p class="panier-vide">Votre panier est vide.</p>`;
        if(totalSousTotal) totalSousTotal.textContent = "0.00 $";
        if(totalFinal) totalFinal.textContent = "0.00 $";
        return;
    }

    // Si le panier contient des articles, on construit le HTML
    let htmlGenere = '';
    let calculGlobal = 0;

    panier.forEach((article, index) => {
        let totalLigne = article.prix * article.quantite;
        calculGlobal += totalLigne;

        htmlGenere += `
            <div class="panier-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${article.image}" alt="${article.nom}" style="width: 70px; height: 90px; object-fit: cover; border-radius: 4px;">
                    <div>
                        <h4 style="margin: 0 0 5px 0;">${article.nom}</h4>
                        <p style="margin: 0; font-size: 14px; color: #666;">Taille: ${article.taille} | Couleur: ${article.couleur}</p>
                        <p style="margin: 5px 0 0 0; font-weight: bold;">${article.prix.toFixed(2)} $</p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span>Qté: <strong>${article.quantite}</strong></span>
                    <button onclick="supprimerArticle(${index})" style="background: none; border: none; color: red; cursor: pointer; font-size: 14px;">Supprimer</button>
                </div>
            </div>
        `;
    });

    conteneurArticles.innerHTML = htmlGenere;
    
    // Mise à jour des prix sur la droite (Récapitulatif)
    if(totalSousTotal) totalSousTotal.textContent = `${calculGlobal.toFixed(2)} $`;
    if(totalFinal) totalFinal.textContent = `${calculGlobal.toFixed(2)} $`;

    // IMPORTANT : On injecte aussi la version texte du panier dans le formulaire masqué Web3Forms pour le proprio !
    const champMasqueFormulaire = document.getElementById('hidden-cart-details');
    if (champMasqueFormulaire) {
        let resumeTexte = panier.map(item => `${item.nom} (Taille: ${item.taille}, Qté: ${item.quantite})`).join(', ');
        champMasqueFormulaire.value = resumeTexte;
    }
}

// Fonction pour enlever un vêtement du panier
window.supprimerArticle = function(index) {
    let panier = JSON.parse(localStorage.getItem('panier_sarah_mus')) || [];
    panier.splice(index, 1); // Retire l'élément sélectionné
    localStorage.setItem('panier_sarah_mus', JSON.stringify(panier));
    
    // On redessine le panier et on met à jour le header
    afficherLePanier();
    
    // Code pour mettre à jour le compteur du header s'il existe sur cette page
    const totalArticles = panier.reduce((total, article) => total + article.quantite, 0);
    const compteurs = document.querySelectorAll('.nb-panier, #cart-count');
    compteurs.forEach(compteur => { compteur.textContent = `(${totalArticles})`; });
};
// Fonction pour vider l'intégralité du panier d'un seul coup
window.viderLePanier = function() {
    // 1. On demande une petite confirmation pour éviter les erreurs
    if (confirm("Êtes-vous sûr de vouloir vider tout votre panier ?")) {
        
        // 2. On efface la clé du panier dans le localStorage
        localStorage.removeItem('panier_sarah_mus');
        
        // 3. On relance l'affichage pour que l'écran affiche directement "Votre panier est vide"
        if (typeof afficherLePanier === "function") {
            afficherLePanier();
        } else {
            // Si la fonction n'est pas trouvée, on recharge simplement la page
            location.reload();
        }
        
        // 4. On remet instantanément les petits compteurs (0) du header à zéro
        const compteurs = document.querySelectorAll('.nb-panier, #cart-count');
        compteurs.forEach(compteur => {
            compteur.textContent = `(0)`;
        });
    }
};
// Cette fonction compte ce qu'il y a dans le localStorage et change le (0) ou (1) du menu
function mettreAJourCompteurHeader() {
    // On récupère le panier actuel
    const panier = JSON.parse(localStorage.getItem('panier_sarah_mus')) || [];
    
    // On calcule le nombre total d'articles
    const totalArticles = panier.reduce((total, article) => total + article.quantite, 0);
    
    // On cherche l'élément du menu dans le HTML (ex: .nb-panier ou #cart-count)
    const compteurs = document.querySelectorAll('.nb-panier, #cart-count'); 
    
    compteurs.forEach(compteur => {
        compteur.textContent = `(${totalArticles})`;
    });
}

// Emplacement magique : Dès qu'une page HTML s'ouvre, elle met à jour son compteur !
document.addEventListener('DOMContentLoaded', mettreAJourCompteurHeader);