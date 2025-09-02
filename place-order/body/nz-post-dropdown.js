/**
 * NZ Post Collection Location Dropdown
 * Creates a comprehensive dropdown with all NZ Post collection locations
 * Extracted from code-nz-post-collect.txt
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find the post-collect input element
    const postCollectInput = document.getElementById('post-collect');
    // Find the address input element that we'll populate
    const addressInput = document.getElementById('post-office-address');
    
    if (!postCollectInput) {
        console.error('Post-collect input element not found');
        return;
    }
    
    if (!addressInput) {
        console.error('Address input element not found');
        return;
    }
    
    // Create the select element
    const select = document.createElement('select');
    select.id = 'form_field_deliveryLocation';
    select.className = 'form-select location-dropdown';
    
    // Define the locations data structure
    const locations = {
        "*My PostShop is not on this list": [
            "I will be in contact with my NZ PostShop details"
        ],
        "Ashburton": ["Ashburton Countdown"],
        "Auckland": [
            "Albany Box Lobby",
            "Botany Box Lobby",
            "Drury NZ Post Shop",
            "NZ Post Beachlands",
            "NZ Post Depot Waiheke",
            "NZ Post Hardinge Street",
            "NZ Post Highland Park",
            "NZ Post Lynfield",
            "NZ Post Meadowbank",
            "NZ Post Newmarket",
            "NZ Post North Harbour",
            "NZ Post Otara",
            "NZ Post Pakuranga",
            "NZ Post Papatoetoe",
            "NZ Post Takapuna"
        ],
        "Blenheim": ["Blenheim Parcel Collection"],
        "Cambridge": ["Woolworths Cambridge"],
        "Christchurch": [
            "Aranui NZ Post Centre",
            "Bishopdale Central NZ Post Shop",
            "Cashel Street NZ Post Shop",
            "Christchurch Cashel Box Lobby",
            "Linwood NZ Post Centre",
            "NZ Post Avonhead",
            "NZ Post Bishopdale",
            "NZ Post Cashel Street",
            "NZ Post Phillipstown",
            "NZ Post Rangiora",
            "NZ Post Woolston",
            "Parklands NZ Post Shop"
        ],
        "Dannevirke": ["NZ Post Dannevirke"],
        "Darfield": ["NZ Post Darfield"],
        "Dargaville": ["Dargaville NZ Post Shop"],
        "Drury": ["NZ Post Drury"],
        "Dunedin": [
            "Dunedin NZ Post Centre Mornington",
            "NZ Post Green Island",
            "Woolworths Dunedin Central",
            "Woolworths Dunedin South"
        ],
        "Feilding": ["NZ Post Feilding"],
        "Gisborne": ["Woolworths Gisborne"],
        "Hamilton": [
            "NZ Post Glenview Centre",
            "NZ Post Hamilton",
            "NZ Post Hillcrest",
            "Woolworths Chartwell Mall"
        ],
        "Hastings": [
            "NZ Post Flaxmere",
            "NZ Post Havelock North"
        ],
        "Hawera": ["NZ Post Hawera"],
        "Invercargill": [
            "Invercargill North NZ Post Shop",
            "NZ Post South Invercargill",
            "NZ Post Waikiwi - Invercargill"
        ],
        "Katikati": ["NZ Post Katikati - Paper Plus Katikati"],
        "Kawerau": ["NZ Post Kawerau"],
        "Kerikeri": ["Kerikeri NZ Post Shop"],
        "Lincoln": ["NZ Post Lincoln"],
        "Masterton": ["Woolworths Masterton"],
        "Motueka": ["NZ Post Motueka"],
        "Napier": ["NZ Post Marewa"],
        "Nelson": ["NZ Post Richmond - Paper Plus"],
        "New Plymouth": [
            "New Plymouth NZ Post Centre",
            "New Plymouth NZ Post Centre Vogeltown",
            "New Plymouth NZ Post Shop Westown"
        ],
        "Ngatea": ["NZ Post Ngatea"],
        "Oamaru": ["NZ Post North End"],
        "Ohakune": ["NZ Post Ohakune"],
        "Opotiki": ["Opotiki NZ Post Shop"],
        "Otaki": ["NZ Post Otaki"],
        "Paeroa": ["NZ Post Paeroa"],
        "Palmerston North": [
            "Palmerston North NZ Post Centre Awapuni",
            "Palmerston North NZ Post Centre Summerhill"
        ],
        "Queenstown": [
            "NZ Post Private Boxes Queenstown",
            "NZ Post Wakatipu"
        ],
        "Rotorua": [
            "NZ Post Rotorua Amohau Street",
            "Rotorua NZ Post Shop Ngongotaha"
        ],
        "Takaka": ["NZ Post Takaka"],
        "Taupo": ["Taupo NZ Post Operations Centre"],
        "Tauranga": [
            "NZ Post Bethlehem",
            "NZ Post Cherrywood",
            "Tauranga NZ Post"
        ],
        "Te Anau": ["NZ Post Te Anau"],
        "Timaru": [
            "NZ Post Highfield",
            "NZ Post Timaru"
        ],
        "Tuakau": ["NZ Post Tuakau"],
        "Turangi": ["Turangi NZ Post Shop Turangi"],
        "Upper Hutt": [
            "NZ Post Trentham",
            "NZ Post Upper Hutt"
        ],
        "Waimate": ["NZ Post Waimate"],
        "Waitara": ["NZ Post Waitara"],
        "Waiuku": ["NZ Post Waiuku"],
        "Wellington": [
            "NZ Post Island Bay",
            "NZ Post Johnsonville",
            "NZ Post Tawa",
            "Wellington Box Lobby",
            "Wellington NZ Post Centre Hataitai"
        ],
        "Wellsford": ["NZ Post Wellsford"],
        "Whakatane": ["Whakatane NZ Post Shop Opotiki"],
        "Whangamata": ["NZ Post Whangamata"],
        "Whanganui": ["Whanganui CourierPost Depot"],
        "Whangaparaoa": ["NZ Post Whangaparaoa"],
        "Whangarei": [
            "New Zealand Post Whangarei Depot",
            "NZ Post Te Mai West"
        ],
        "Winton": ["NZ Post Winton"]
    };
    
    // Create default option
    const defaultOption = document.createElement('option');
    defaultOption.textContent = '-- Please Select --';
    defaultOption.value = '';
    select.appendChild(defaultOption);
    
    // Create optgroups and options
    for (const [region, postShops] of Object.entries(locations)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = region;
        
        postShops.forEach(shop => {
            const option = document.createElement('option');
            option.value = shop;
            option.textContent = shop;
            optgroup.appendChild(option);
        });
        
        select.appendChild(optgroup);
    }
    
    // Add event listener to update both the original input and the address input
    select.addEventListener('change', function() {
        const selectedValue = this.value;
        
        // Update the hidden post-collect input
        postCollectInput.value = selectedValue;
        
        // Update the visible address input
        addressInput.value = selectedValue;
        
        // Trigger input events in case there are any listeners
        postCollectInput.dispatchEvent(new Event('input', { bubbles: true }));
        addressInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Trigger change events as well
        postCollectInput.dispatchEvent(new Event('change', { bubbles: true }));
        addressInput.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Replace the input with the select or insert after
    postCollectInput.parentNode.insertBefore(select, postCollectInput);
    postCollectInput.style.display = 'none'; // Hide the original post-collect input
    
    // Add custom CSS for modern styling
    const style = document.createElement('style');
    style.textContent = `
        .location-dropdown {
            width: 100%;
            padding: 12px 16px;
            font-size: 16px;
            color: #6b7280;
            background-color: #ffffff;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            outline: none;
            transition: all 0.2s ease;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 20px;
            padding-right: 40px;
        }
        
        .location-dropdown:hover {
            border-color: #9ca3af;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        .location-dropdown:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            color: #111827;
        }
        
        .location-dropdown option {
            padding: 8px 12px;
            color: #374151;
        }
        
        .location-dropdown optgroup {
            font-weight: 600;
            color: #111827;
            padding-top: 8px;
        }
        
        .location-dropdown option:hover {
            background-color: #f3f4f6;
        }
        
        /* Selected value color */
        .location-dropdown:not(:invalid) {
            color: #111827;
        }
    `;
    document.head.appendChild(style);
});
