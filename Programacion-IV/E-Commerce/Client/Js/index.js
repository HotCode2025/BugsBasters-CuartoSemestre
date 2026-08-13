const shopContent = document.getElementById("shopContent");
products.forEach((product) => {
    const content = document.createElement("div");
    content.innerHTML = `
    <img src ="${product.image}" class="img">
    <h3 class="title">${product.name}</h3>
    <p class="price">$${product.price}</p>
  `;
    shopContent.append(content);
});