// Get elements from DOM
const playButton = document.querySelector("[data-play-button]");
const user = document.getElementById("username");

/**
 * Event listener for the "play" button
 * when clicked calls handleClick function
 */
playButton.addEventListener("click", (e) => {
  e.preventDefault();
  handleClick();
});

/**
 * This function waits for the validateInputs answer
 * and if it is true it call the saveUser function and
 * sets the location to the wordle page
 *
 */
function handleClick() {
  if (validateInputs()) {
    saveUser();
    location = "./pages/wordle.html";
  }
}

/**
 * Saves the name of the inputed user into localStorage
 */
function saveUser() {
  localStorage.setItem("userName", user.value);
  console.log(user.value);
}

/**
 * Validates the username input
 * @returns true in case the username is valid
 */
function validateInputs() {
  if (!user.value) {
    alert("User is required");
  } else {
    return true;
  }
}
