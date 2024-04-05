let isSmall = window.innerWidth <= 768;
let isSuperSmall = window.innerWidth <= 576;
window.addEventListener("resize", function () {
	isSmall = window.innerWidth <= 768;
	isSuperSmall = window.innerWidth <= 576;
});

// Get all the ".groups-item" elements
const groups = document.querySelector(".groups");
const groupItems = document.querySelectorAll(".groups-item");
const channels = document.querySelector(".channels");
// const channelsItems = document.querySelectorAll(".channels-item:not(.hidden)");
const channelsTitle = document.querySelector(".channels-title");
const channelsCount = document.querySelector(".channels-count");
const channelsBackBtn = document.querySelector(".channels-back");
const channelsSearch = document.querySelector(".channels-search");
const searchBtn = document.querySelector(".channels-search-icon");
const searchInput = document.querySelector(".channels-search-input");
const loadedJson = { popular: 20 };

// Loop through each ".groups-item" element
groupItems.forEach((groupItem) => {
	// Add a click event listener to each ".groups-item" element
	groupItem.addEventListener("click", () => {
		// Get the value of the "channels" attribute
		const channelsValue = groupItem.getAttribute("channels");

		// Get all the ".channels-list" elements and add the "hidden" class to each
		const channelsLists = document.querySelectorAll(".channels-list");
		channelsLists.forEach((channelsList) => {
			channelsList.classList.add("hidden");
		});

		// Remove the "hidden" class from the element with the class that matches the "channels" attribute value
		const channelsElement = document.querySelector(`#${channelsValue}`);
		channelsElement.classList.remove("hidden");

		// Remove the "active" class from all ".groups-item" elements
		groupItems.forEach((item) => {
			item.classList.remove("active");
		});

		// Add the "active" class to the clicked element
		groupItem.classList.add("active");

		// Load channels data from json
		if (!loadedJson.hasOwnProperty(channelsValue)) {
			//////////////////
			channels.classList.add("loading"); // Show loading spinner
			fetch(`channels_assets/channels/${channelsValue}.json`)
				.then((response) => response.json())
				.then((data) => {
					// Convert the JSON data to HTML code
					const channelItem = data
						.map(
							(channelName) => `<div class="channels-item">
                                        <img src="channels_assets/live.svg" class="channels-item-live" alt="">
                                        <span class="channels-item-name">${channelName}<\/span>
                                    <\/div>`
						)
						.join("");

					// Insert the HTML code into the div element
					channelsElement.innerHTML = channelItem;
					loadedJson[channelsValue] = data.length; // Add channel and count to the loadedJson array
					channelsCount.textContent = data.length; // Change Channel count
					channels.classList.remove("loading"); // Hide loading spinner
				})
				.catch((error) => console.error(error));
		} else {
			// Chnage channel count from loadedJson
			channelsCount.textContent = loadedJson[channelsValue]; // Change Channel count
		}

		/////////////////

		// Toggle groups and channels on small devices
		if (isSmall) {
			const groups = document.querySelector(".groups");
			const channels = document.querySelector(".channels");
			groups.classList.add("hidden");
			channels.classList.add("shown");
			setTimeout(function () {
				channels.classList.add("animation");
			}, 1);
		}
	});
});

// Toggle groups and channels when back button is clicked
channelsBackBtn.addEventListener("click", function () {
	groups.classList.remove("hidden");
	channels.classList.remove("shown");
	channels.classList.remove("animation");
});

// Channels Search
document.addEventListener("click", function (event) {
	if (event.target.closest(".channels-search-icon")) {
		channels.classList.add("search");
		channelsSearch.classList.add("active");
		searchInput.focus();
		// Remove channel name and count on super small devices
		if (isSuperSmall) {
			channelsTitle.style.display = "none";
			channelsCount.style.display = "none";
		}
	} else if (event.target.closest(".channels-search")) {
		// DO
	} else {
		channelsSearch.classList.remove("active");
		channels.classList.remove("search");
		searchInput.value = "";
		let channelsItems = document.querySelectorAll(".channels-item:not(.hidden)");
		channelsItems.forEach((item) => (item.style.display = "flex")); // Show all channels
		// Add back channel name and count on super small devices
		if (isSuperSmall) {
			channelsTitle.style.display = "block";
			channelsCount.style.display = "block";
		}
	}
});
// Add an event listener to the search bar to listen for input changes
searchInput.addEventListener("input", () => {
	let channelsItems = document.querySelectorAll(".channels-item:not(.hidden)");
	// Get the search term entered by the user
	const searchTerm = searchInput.value.toLowerCase();
	// Loop through each item to check if it contains the search term
	channelsItems.forEach((item) => {
		const itemText = item.textContent.toLowerCase();
		// If the item contains the search term, show it, otherwise hide it
		if (itemText.includes(searchTerm)) {
			item.style.display = "flex";
		} else {
			item.style.display = "none";
		}
	});
});
