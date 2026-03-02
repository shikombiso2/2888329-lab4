const search_btn = document.getElementById("search-btn");
const country_input = document.getElementById("country-input");
const country_info = document.getElementById("country-info");
const borderContainer = document.getElementById("bordering-countries");
const error_msg = document.getElementById("error-message");
const load_spinner = document.getElementById("loading-spinner");


search_btn.addEventListener("click", () => {
    const country = country_input.value.trim();
    if (country) {
        searchCountry(country);
    }
});

country_input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const country = country_input.value.trim();
        if (country) {
            searchCountry(country);
        }
    }
});

async function searchCountry(country) {
    
    error_msg.textContent = "";
    country_info.innerHTML = "";
    borderContainer.innerHTML = "";
    error_msg.classList.add("hidden");
    
    
    load_spinner.style.display = "block";

    try {
        
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        
        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country_found = data[0];

        
        country_info.innerHTML = `
            <h2>${country_found.name.common}</h2>
            <p><strong>Capital:</strong> ${country_found.capital ? country_found.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country_found.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country_found.region}</p>
            <img src="${country_found.flags.svg}" alt="${country_found.name.common} flag" width="150">
        `;

        
        if (country_found.borders && country_found.borders.length > 0) {
            await displayBorderingCountries(country_found.borders);
        } else {
            borderContainer.innerHTML = "<p class='no-borders'>This country has no bordering countries.</p>";
        }

    } catch (error) {
        error_msg.textContent = "❌ Country not found! Please check the spelling and try again.";
        error_msg.classList.remove("hidden");
        console.error(error);
    } finally {
        load_spinner.style.display = "none";
    }
}

async function displayBorderingCountries(borderCodes) {
    try {
        
        borderContainer.innerHTML = "";
        
        
        const title = document.createElement("h3");
        title.textContent = "Bordering Countries";
        title.textAlign=clearInterval;
        title.className = "section-title";
        borderContainer.appendChild(title);

        
        const gridContainer = document.createElement("div");
        gridContainer.className = "border-grid";
        borderContainer.appendChild(gridContainer);

        
        for (const code of borderCodes) {
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
            const data = await response.json();
            const borderCountry = data[0];
            
           
            const borderCard = document.createElement("div");
            borderCard.className = "border-country";
            borderCard.innerHTML = `
                <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                <p>${borderCountry.name.common}</p>
            `;
            
            gridContainer.appendChild(borderCard);
        }
    } catch (error) {
        console.error("Error fetching bordering countries:", error);
        borderContainer.innerHTML += "<p class='error'>Error loading bordering countries.</p>";
    }
}