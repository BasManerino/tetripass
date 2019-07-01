// Voeg een profiel toe in de database
function addProfiel() {	
    var formData = new FormData(document.querySelector("#save_form"));
	var encData = new URLSearchParams(formData.entries());
	
	let fetchoptions = {
		method: 'POST',
		body: encData
	}
	
	fetch('restservices/stuff/addProfiel', fetchoptions)
		.then((response) => {
			console.log(response.status);
			if (response.status == 402) { 
				document.querySelector("#error").innerHTML = "Dit email adres, wachtwoord of gebruikersnaam bestaat al.";
			} else if (response.status == 999) { 
				document.querySelector("#error").innerHTML = "Deze 2 wachtwoorden komen niet met elkaar overeen, probeer het opnieuw.";
			}
			else {
				window.location.href = 'index.html';
			}
		});
	
	return false;
}