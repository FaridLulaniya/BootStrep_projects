// Initialize Cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update Price Based on Weight
document.querySelectorAll(".weight-selector").forEach(selector => {
  selector.addEventListener("change", event => {
    const basePrice = parseFloat(event.target.dataset.basePrice);
    const multiplier = parseFloat(event.target.value);
    const updatedPrice = basePrice * multiplier;

    const priceElement = event.target.parentElement.querySelector(".price");
    priceElement.textContent = `$${updatedPrice.toFixed(2)}`;

    const addToCartButton = event.target.parentElement.querySelector(".add-to-cart");
    addToCartButton.dataset.price = updatedPrice.toFixed(2);
    addToCartButton.dataset.weight = event.target.value;
  });
});

// Add to Cart
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const weight = button.dataset.weight || "1";
    const image = button.dataset.image;
    const existingProduct = cart.find(item => item.name === name && item.weight === weight);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ name, price, weight, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} (${weight} kg) added to cart!`);
  });
});

// Render Cart Items
if (document.getElementById("cart-items")) {
  const cartItemsDiv = document.getElementById("cart-items");

  function renderCart() {
    cartItemsDiv.innerHTML = "";
    cart.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "d-flex justify-content-between align-items-center border p-3 mb-3";
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px;">
        <span>${item.name} (${item.weight} kg) - $${(item.price * item.quantity).toFixed(2)}</span>
        <div>
          <button class="btn btn-secondary decrement" data-index="${index}">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-secondary increment" data-index="${index}">+</button>
          <button class="btn btn-danger delete" data-index="${index}">Delete</button>
        </div>
      `;
      cartItemsDiv.appendChild(itemDiv);
    });
  }

  renderCart();

  // Increment, Decrement, and Delete Actions
  cartItemsDiv.addEventListener("click", event => {
    const index = event.target.dataset.index;

    if (event.target.classList.contains("increment")) {
      cart[index].quantity += 1;
    } else if (event.target.classList.contains("decrement")) {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      }
    } else if (event.target.classList.contains("delete")) {
      const confirmDelete = confirm(`Are you sure you want to delete "${cart[index].name}" (${cart[index].weight} kg) from the cart?`);
      if (confirmDelete) {
        cart.splice(index, 1);
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });
}
