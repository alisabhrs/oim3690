
 // Array of songs
const songs = [
    "Die With A Smile - Lady Gaga & Bruno Mars",
    "Birds of a Feather - Billie Eilish",
    "Golden - Harry Styles",
    "Snooze - SZA",
    "Those Eyes - New West"
];

// Find the playlist on the webpage
const playlist = document.getElementById("playlist");

// Loop through the songs and display each one
for (let i = 0; i < songs.length; i++) {

    // Create a new list item
    const li = document.createElement("li");

    // Add the song name
    li.textContent = songs[i];

    // Display the song on the page
    playlist.appendChild(li);
}
