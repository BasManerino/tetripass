
// Event voor de startknoppen, stelt de moeilijkheidsgraad in
function setDifficulty(id)
{
	sessionStorage.setItem("diff", id);
}

// Word gedraaid zodra de pagina word geladen
function InitPage()
{
	// Check of er is ingelogd
	var check = sessionStorage.getItem("isLoggedIn")
	var logged = document.getElementById("LoggedInDiv");
	var notLogged = document.getElementById("NotLoggedInDiv");
	
	if(check == "true"){
		notLogged.style.display = "none";
	}
	else{
		logged.style.display = "none";
	}
	
	// Stel de login knop in
	let saveButton = document.querySelector('#login_button'); 
	saveButton.addEventListener('click', (event) => {
		var formData = new FormData(document.querySelector("#login_form"));
		console.log(formData);
		var encData = new URLSearchParams(formData.entries());
		console.log(encData);
		document.querySelector("#error").innerHTML = "";
		
		fetch('restservices/authentication', {method: 'POST', body: encData})
		.then((response) => { 
			if (response.ok) {
				return response.json();
			} else {
				document.querySelector("#error").innerHTML = "Inlog gegevens niet correct";
			}
		})
		.then((myJson) => {
			window.sessionStorage.setItem("sessionToken", myJson.JWT);
			sessionStorage.setItem("isLoggedIn", "true")
			sessionStorage.setItem("email", encData.get('email'))
			window.location.href = "index.html";
		});
	}, false);

	// Stel de logout knop in
	document.querySelector('#logout_button').addEventListener('click', (event) => {
		sessionStorage.clear();
		window.location.href = "index.html";
	});

	var email = sessionStorage.getItem("email");
	if (email == null){
		document.querySelector('#halloGebruiker').innerHTML = "Welkom gebruiker!";
	}
	
	else{
		let fetchoptions = {
				headers: {
					'Authorization': 'Bearer ' + window.sessionStorage.getItem("sessionToken")
				}
			}
			
			fetch('restservices/stuff/getProfiel/' + email, fetchoptions)
				.then((response) => {
					if (response.status == 403) {
						document.querySelector("#halloGebruiker").innerHTML = "Er is iets misgegaan, onze excuses voor het ongemak.";
					} else {
						return response.json();
					}
				})
				.then((myJson) => {
					console.log(myJson);
					document.querySelector('#halloGebruiker').innerHTML = "Welkom " + myJson.gebruikersnaam + "!";
				});
	}
}

// Stel de dropdown in om open en dicht te klappen als er op wordt geklikt
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Stel de dropdown in om te sluiten als er buiten de dropdown word geklikt
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}