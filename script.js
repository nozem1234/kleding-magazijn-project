document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("kledingVoorraad")) {
        fetch("clothing.json")
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("kledingVoorraad", JSON.stringify(data));
                renderKleding(data);
            });
    } else {
        renderKleding(JSON.parse(localStorage.getItem("kledingVoorraad")));
    }
});

function renderKleding(kleding, filterGrootte = "all") {
    const kledingContainer = document.getElementById("kleding-container");
    kledingContainer.innerHTML = "";

    kleding
        .filter(item => filterGrootte === "all" || item.size === filterGrootte)
        .forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("kleding-item");
            itemDiv.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.size}</p>
                <p>Aantal: <span id="amount-${item.id}">${item.amount}</span></p>
                <div class="btn-container">
                    <button class="btn-plus" onclick="wijzigAantal('${item.id}', 1)">+</button>
                    <button class="btn-min" onclick="wijzigAantal('${item.id}', -1)">-</button>
                </div>
            `;
            kledingContainer.appendChild(itemDiv);
        });
}

function wijzigAantal(id, wijziging) {
    let kleding = JSON.parse(localStorage.getItem("kledingVoorraad")) || [];
    const itemIndex = kleding.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        kleding[itemIndex].amount += wijziging;
        if (kleding[itemIndex].amount <= 0) {
            kleding.splice(itemIndex, 1);
        }
        localStorage.setItem("kledingVoorraad", JSON.stringify(kleding));
        renderKleding(kleding, document.querySelector(".filter-buttons .active")?.dataset.size || "all");
    }
}

function filterKleding(size) {
    renderKleding(JSON.parse(localStorage.getItem("kledingVoorraad")), size);
}