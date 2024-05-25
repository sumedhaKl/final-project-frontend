const products = {
    clothing: [
        { name: "T-shirt", price: 10 },
        { name: "Jeans", price: 20 },
        { name: "Dress", price: 30 }
    ],
    food: [
        { name: "Bread", price: 2 },
        { name: "Milk", price: 3 },
        { name: "Eggs", price: 4 }
    ],
    household: [
        { name: "Soap", price: 5 },
        { name: "Towel", price: 8 },
        { name: "Dishwasher", price: 50 }
    ],
    gardening: [
        { name: "Shovel", price: 5 },
        { name: "Plant Food", price: 10 },
        { name: "Pot/Plantar", price: 20 }
    ],
    accessories: [
        { name: "Bracelet", price: 50 },
        { name: "Ring", price: 70 },
        { name: "Earrings", price: 100 },
        { name: "Necklace", price: 150}
    ],
    musicalinstruments: [
        { name: "Violin", price: 75 },
        { name: "Piano", price: 100 },
        { name: "Sheet Music", price: 30 }
    ],
};

let selectedProducts = [];
const discounts = [
    { name: "Bread", discount: 0.1 }, 
    { name: "Jeans", discount: 0.15 }, 
    { name: "Violin", discount: 0.2 } 
];

function applyDiscounts() {
    let discountList = document.getElementById('discountList');
    discounts.forEach(discountItem => {
        const discountElement = document.createElement('li');
        discountElement.textContent = `${discountItem.name}: ${discountItem.discount * 100}% off`;
        discountList.appendChild(discountElement);
    });
}

function showProducts() {
    const categorySelect = document.getElementById("categorySelect");
    const selectedCategory = categorySelect.value;
    const productListDiv = document.getElementById("productList");
    const productList = products[selectedCategory];

    if (productList) {
        let html = "<h2>Available Products:</h2><ul>";
        productList.forEach(product => {
            const discount = discounts.find(d => d.name === product.name);
            const finalPrice = discount ? product.price * (1 - discount.discount) : product.price;
            html += `<li><input type="checkbox" value="${product.name}" data-price="${finalPrice}" onchange="toggleProduct(this, ${finalPrice})">${product.name} - $${finalPrice.toFixed(2)}</li>`;
        });
        html += "</ul>";
        productListDiv.innerHTML = html;
    } else {
        productListDiv.innerHTML = "<p>No products available for this category.</p>";
    }
}

function toggleProduct(checkbox, price) {
    const productName = checkbox.value;
    if (checkbox.checked) {
        selectedProducts.push({ name: productName, price: price });
    } else {
        selectedProducts = selectedProducts.filter(item => item.name !== productName);
    }
}

function placeOrder() {
    if (selectedProducts.length === 0) {
        alert("Please select a category and at least one product before placing an order.");
        return;
    }

    const orderStatusElement = document.getElementById("orderStatus");
    orderStatusElement.textContent = "Order placed. Estimated delivery: 3 days.";

    const pastOrdersList = document.getElementById("pastOrdersList");
    let totalCost = 0;

    selectedProducts.forEach(product => {
        totalCost += product.price;
        const newOrder = {date: new Date().toISOString().split('T')[0], product: product.name, price: product.price, status: "Processing"};
        const listItem = document.createElement("li");
        listItem.textContent = `${newOrder.date}: ${newOrder.product} - $${newOrder.price.toFixed(2)} (${newOrder.status})`;
        pastOrdersList.appendChild(listItem);
    });

    const totalElement = document.createElement("p");
    totalElement.textContent = `Total: $${totalCost.toFixed(2)}`;
    pastOrdersList.appendChild(totalElement);

    localStorage.setItem("pastOrders", JSON.stringify(Array.from(pastOrdersList.children).map(item => item.textContent)));

    selectedProducts = [];
}

function resetOrders() {
    localStorage.removeItem("pastOrders");
}

function displayPastOrders() {
    const pastOrdersList = document.getElementById("pastOrdersList");
    const storedOrders = JSON.parse(localStorage.getItem("pastOrders"));

    if (storedOrders) {
        storedOrders.forEach(order => {
            const listItem = document.createElement("li");
            listItem.textContent = order;
            pastOrdersList.appendChild(listItem);
        });
    }
}

function fetchFromPostman() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
        "category": "Food",
        "items_ordered": "bread",
        "quantity_ordered": 1,
        "price_per_item": 2
    });
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };
    fetch("http://127.0.0.1:8086/api/shopping/predict", requestOptions)
        .then(response => response.json())
        .then(data => {
            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<h2>Prediction Result</h2>';
            resultDiv.innerHTML += '<p>Predicted Price from Postman: ' + (data.predicted_price ? 'Price': 'Price') + '</p>';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.onload = function() {
    displayPastOrders();
    applyDiscounts();
    resetOrders();
};