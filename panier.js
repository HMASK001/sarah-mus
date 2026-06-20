
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