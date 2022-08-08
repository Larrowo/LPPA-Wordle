const playButton = document.querySelector("[data-play-button]");
const user = document.getElementById("username");
const password = document.getElementById("password");

playButton.addEventListener("click", () => {
  preventdefault();
  handleClick();
});

function handleClick() {
  if (validateInputs()) {
    saveUser();
  }
}

function saveUser(user, password) {
  sessionStorage.user = user.value;
  sessionStorage.password = password.value;
}

function validateInputs() {
  if (!user.value) {
  }
}
