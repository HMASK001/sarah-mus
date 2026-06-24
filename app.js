document.addEventListener("DOMContentLoaded", () => {
    
    // --- GESTION DU BADGE DE COMPTEUR (HEADER) ---
    const cartCountBadge = document.querySelector('.cart-count');
    
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('sarah_mus_cart')) || [];
        let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCountBadge) cartCountBadge.textContent = totalItems;
        return totalItems;
    }
    updateCartCount();

    // --- LOGIQUE POUR BOUTIQUE.HTML ---
    const shopAddButtons = document.querySelectorAll('.btn-shop-add');
    
    if (shopAddButtons.length > 0) {
        shopAddButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remonter jusqu'à la carte de l'habit sélectionné
                const productCard = button.closest('.product-card');
                
                // Extraire les données dynamiques saisies par l'utilisateur
                const id = button.getAttribute('data-id');
                const image = button.getAttribute('data-image');
                const name = productCard.querySelector('.prod-title').textContent;
                const price = parseFloat(productCard.querySelector('.prod-price').getAttribute('data-raw-price'));
                
                const selectedSize = productCard.querySelector('.prod-size').value;
                const selectedColor = productCard.querySelector('.prod-color').value;
                const selectedQuantity = parseInt(productCard.querySelector('.prod-qty').value) || 1;

                const product = {
                    id: `${id}-${selectedSize}-${selectedColor}`, // Clé unique par déclinaison
                    name: name,
                    price: price,
                    image: image,
                    variant: `${selectedColor} / ${selectedSize}`,
                    quantity: selectedQuantity
                };

                let cart = JSON.parse(localStorage.getItem('sarah_mus_cart')) || [];
                const existingIndex = cart.findIndex(item => item.id === product.id);

                if (existingIndex > -1) {
                    cart[existingIndex].quantity += product.quantity;
                } else {
                    cart.push(product);
                }

                localStorage.setItem('panier.js', JSON.stringify(cart));
                updateCartCount();
                alert(`Ajouté au panier : ${product.name} (${product.variant}) x${product.quantity}`);
            });
        });
    }

    // --- LOGIQUE POUR PANIER.HTML ---
    const cartTableBody = document.querySelector('.cart-table tbody');
    const checkoutSummaryItems = document.querySelector('.summary-items');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutSection = document.querySelector('.checkout-section');

    if (cartTableBody) {
        let cart = JSON.parse(localStorage.getItem('sarah_mus_cart')) || [];

        function renderCart() {
            cartTableBody.innerHTML = "";
            
            if (cart.length === 0) {
                cartTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px;">Votre panier est vide. <a href="boutique.html">Retourner à la boutique</a></td></tr>`;
                updateTotals(0);
                if (checkoutSummaryItems) checkoutSummaryItems.innerHTML = "<p>Aucun article.</p>";
                return;
            }

            cart.forEach((item, index) => {
                const row = document.createElement('tr');
                row.classList.add('cart-item');
                let itemTotal = item.price * item.quantity;

                row.innerHTML = `
                    <td>
                        <div class="product-cell">
                            <img src="${item.image}" alt="${item.name}" class="cart-prod-img">
                            <div class="product-details">
                                <h3>${item.name}</h3>
                                <p class="variant">${item.variant}</p>
                            </div>
                        </div>
                    </td>
                    <td class="unit-price">${item.price.toFixed(2)} $</td>
                    <td>
                        <div class="quantity-selector">
                            <button class="qty-btn minus" data-index="${index}">-</button>
                            <input type="number" value="${item.quantity}" readonly>
                            <button class="qty-btn plus" data-index="${index}">+</button>
                        </div>
                    </td>
                    <td class="total-price">${itemTotal.toFixed(2)} $</td>
                    <td><button class="remove-item" data-index="${index}"><i class="fa-regular fa-trash-can"></i></button></td>
                `;
                cartTableBody.appendChild(row);
            });

            setupCartEvents();
            calculateGlobalTotal();
            renderCheckoutSummary();
        }

        function setupCartEvents() {
            document.querySelectorAll('.qty-btn.plus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    cart[index].quantity += 1;
                    saveAndRefresh();
                });
            });

            document.querySelectorAll('.qty-btn.minus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    if (cart[index].quantity > 1) {
                        cart[index].quantity -= 1;
                        saveAndRefresh();
                    }
                });
            });

            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const button = e.target.closest('.remove-item');
                    const index = button.getAttribute('data-index');
                    cart.splice(index, 1);
                    saveAndRefresh();
                });
            });
        }

        function saveAndRefresh() {
            localStorage.setItem('sarah_mus_cart', JSON.stringify(cart));
            let totalItems = updateCartCount();
            const cartTitle = document.querySelector('.cart-header h2');
            if (cartTitle) cartTitle.textContent = `MON PANIER (${totalItems})`;
            renderCart();
        }

        function calculateGlobalTotal() {
            let subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            updateTotals(subtotal);
        }

        function updateTotals(amount) {
            document.querySelectorAll('.subtotal-val').forEach(cell => cell.textContent = amount.toFixed(2) + " $");
            document.querySelectorAll('.total-val').forEach(cell => cell.textContent = amount.toFixed(2) + " $");
            
            const checkoutTotal = document.querySelector('.summary-totals .total span:nth-child(2)');
            const checkoutSubtotal = document.querySelector('.summary-totals .s-row:nth-child(1) span:nth-child(2)');
            if(checkoutTotal) checkoutTotal.textContent = amount.toFixed(2) + " $";
            if(checkoutSubtotal) checkoutSubtotal.textContent = amount.toFixed(2) + " $";
        }

        function renderCheckoutSummary() {
            if (!checkoutSummaryItems) return;
            checkoutSummaryItems.innerHTML = "";
            cart.forEach(item => {
                const miniItem = document.createElement('div');
                miniItem.classList.add('mini-item');
                miniItem.innerHTML = `
                    <img src="${item.image}" alt="">
                    <div class="mini-details">
                        <h4>${item.name}</h4>
                        <p>${item.variant}</p>
                        <p>Qté : ${item.quantity}</p>
                    </div>
                    <span class="mini-price">${(item.price * item.quantity).toFixed(2)} $</span>
                `;
                checkoutSummaryItems.appendChild(miniItem);
            });
        }

        if (checkoutBtn && checkoutSection) {
            checkoutBtn.addEventListener('click', () => {
                checkoutSection.scrollIntoView({ behavior: 'smooth' });
            });
        }

        renderCart();
        const cartTitle = document.querySelector('.cart-header h2');
        if (cartTitle) cartTitle.textContent = `MON PANIER (${updateCartCount()})`;
    }
});
const form = document.getElementById('form');
if (form){const submitBtn = form.querySelector('button[type="submit"]');

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
    })};
// 1. Fonction pour initialiser et récupérer le panier actuel
function obtenirPanier() {
    const panier = localStorage.getItem('panier_sarah_mus');
    return panier ? JSON.parse(panier) : [];
}

// 2. Fonction pour sauvegarder le panier et mettre à jour les compteurs visuels
function sauvegarderPanier(panier) {
    localStorage.setItem('panier_sarah_mus', JSON.stringify(panier));
    mettreAJourCompteurHeader();
}

// 3. Fonction qui compte le nombre total d'articles et change le (0) dans le menu
function mettreAJourCompteurHeader() {
    const panier = obtenirPanier();
    const totalArticles = panier.reduce((total, article) => total + article.quantite, 0);
    
    // On cherche l'élément du menu (ex: "Panier (0)")
    // Remplace '.nb-panier' par la classe ou l'ID exact de ton compteur dans ton HTML
    const compteurs = document.querySelectorAll('.nb-panier, #cart-count'); 
    compteurs.forEach(compteur => {
        compteur.textContent = `(${totalArticles})`;
    });
}

// 4. Fonction appelée lors du clic sur "Ajouter au panier"
function ajouterAuPanier(nom, prix, image, taille = 'M', couleur = 'Unique') {
    let panier = obtenirPanier();
    
    // On vérifie si l'article existe déjà avec la même taille et couleur
    const articleExistant = panier.find(item => item.nom === nom && item.taille === taille && item.couleur === couleur);
    
    if (articleExistant) {
        articleExistant.quantite += 1;
    } else {
        panier.push({
            nom: nom,
            prix: parseFloat(prix),
            image: image,
            taille: taille,
            couleur: couleur,
            quantite: 1
        });
    }
    
    sauvegarderPanier(panier);
    alert(`Ajouté au panier : ${nom}`);
}

// Charger le compteur du menu dès que la page s'ouvre
document.addEventListener('DOMContentLoaded', mettreAJourCompteurHeader);
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