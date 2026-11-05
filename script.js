
const portfolioForm = document.querySelector("#portfolio-form");
const itemForm = document.querySelector("#item-form");

let portfolios = JSON.parse(localStorage.getItem("json2") || "[]");
let selectedId = "";

if (portfolios.length > 0) {
    selectedId = portfolios[0].id;
}

// Create Portfolio
portfolioForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const data = new FormData(portfolioForm);

    const portfolio = {
        id: Date.now(),
        name: data.get("name").trim(),
        enjoy: data.get("enjoy").trim(),
        tried: data.get("tried").trim(),
        curious: data.get("curious").trim(),
        items: []
    };

    if (!portfolio.name || !portfolio.enjoy ||
        !portfolio.tried || !portfolio.curious) {
        alert("Please fill in all Portfolio fields!");
        return;
    }

    portfolios.push(portfolio);

    localStorage.setItem("json2", JSON.stringify(portfolios));

    selectedId = portfolio.id;

    portfolioForm.reset();
    showPortfolios();
    showItems();
    

    alert("Portfolio saved!");
});


// Add Portfolio Item
itemForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const data = new FormData(itemForm);

    const item = {
        title: data.get("title").trim(),
        type: data.get("type"),
        date: data.get("date").trim(),
        role: data.get("role").trim(),
        skills: data.get("skills").trim(),
        description: data.get("description").trim(),
        did: data.get("did").trim(),
        learned: data.get("learned").trim(),
        challenge: data.get("challenge").trim(),
        next: data.get("next").trim(),
        evidence: data.get("evidence").trim()
    };

    for (let key in item) {
        if (!item[key]) {
            document.querySelector("#message").textContent =
                "Please fill in all fields!";
            return;
        }
    }

    // Check Date
    const dateParts = item.date.split("-");
    const checkDate = new Date(item.date);

    if (dateParts.length != 3 || isNaN(checkDate) ||
        checkDate.toISOString().slice(0, 10) != item.date) {
        document.querySelector("#message").textContent =
            "Invalid date! Use YYYY-MM-DD";
        return;
    }

    // Check URL
    try {
        const url = new URL(item.evidence);

        if (url.protocol != "http:" &&
            url.protocol != "https:") {
            throw "Invalid URL";
        }

    } catch {
        document.querySelector("#message").textContent =
            "Invalid URL! Please enter http:// or https://";
        return;
    }

    if (!selectedId) {
        alert("Please create a Portfolio first!");
        return;
    }

    for (let i = 0; i < portfolios.length; i++) {
        if (portfolios[i].id == selectedId) {
            portfolios[i].items.push(item);
        }
    }

    localStorage.setItem("json2", JSON.stringify(portfolios));

    itemForm.reset();

    document.querySelector("#message").textContent =
        "Portfolio Item saved successfully!";

    showItems();
});


// Show Portfolio List
function showPortfolios() {

    const list = document.querySelector("#portfolio-list");
    list.innerHTML = "";

    for (let i = 0; i < portfolios.length; i++) {

        const button = document.createElement("button");

        button.className = "portfolio-choice";

        if (portfolios[i].id == selectedId) {
            button.className += " active";
        }

        button.textContent = portfolios[i].name;

        button.addEventListener("click", function() {
            selectedId = portfolios[i].id;

            showPortfolios();
            showItems();
        });

        list.appendChild(button);
    }
}


// Show Portfolio Items
function showItems() {

    const area = document.querySelector("#items");
    const name = document.querySelector("#selected-name");
    

    area.innerHTML = "";

    let selected = null;

    for (let i = 0; i < portfolios.length; i++) {
        if (portfolios[i].id == selectedId) {
            selected = portfolios[i];
        }
    }

    if (selected == null) {
        name.textContent = "Please select a Portfolio";
        return;
    }

    name.textContent = "Portfolio: " + selected.name;

    for (let i = 0; i < selected.items.length; i++) {

        const item = selected.items[i];
        const card = document.createElement("div");

        card.className = "item-card";

        card.innerHTML =
            "<h3>" + item.title + "</h3>" +
            "<p>Type: " + item.type + "</p>" +
            "<p>Date: " + item.date + "</p>" +
            "<p>Role: " + item.role + "</p>" +
            "<p>Skills: " + item.skills + "</p>" +
            "<p>Description: " + item.description + "</p>" +
            "<p>What I did: " + item.did + "</p>" +
            "<p>What I learned: " + item.learned + "</p>" +
            "<p>Challenge: " + item.challenge + "</p>" +
            "<p>Next step: " + item.next + "</p>" +
            "<p>Evidence: <a href='" + item.evidence +
            "' target='_blank'>View Work</a></p>";

        area.appendChild(card);
    }
}


// Load saved data
showPortfolios();
showItems();
