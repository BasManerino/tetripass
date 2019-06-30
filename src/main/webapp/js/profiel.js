function deleteScore(email, ranking) {
	document.querySelector("#error" + ranking).innerHTML = "";
	let fetchoptions = {
		method: 'DELETE',
		headers: {
			'Authorization': 'Bearer ' + window.sessionStorage.getItem("sessionToken")
		}
	}
	
	fetch('restservices/stuff/deleteScore/' + email + "/" + ranking, fetchoptions)
		.then((response) => {
			if (response.status == 403) {
				document.querySelector("#error" + ranking).innerHTML = "Log in om deze actie te doen.";
			} else {
				console.log("deleted");
				location.reload();
			}
		});
}

function InitPage()
{
	let fetchoptions = {
			headers: {
				'Authorization': 'Bearer ' + window.sessionStorage.getItem("sessionToken")
			}
		}
		
	var email = sessionStorage.getItem("email");
		
		//Laat de email en gebruikersnaam zien van het profiel
		fetch('restservices/stuff/getProfiel/' + email, fetchoptions)
			.then((response) => {
				if (response.status == 403) {
					document.querySelector("#gebruikersnaam").innerHTML = "Er is iets misgegaan, onze excuses voor het ongemak.";
					document.querySelector("#email").innerHTML = ""
				} else {
					return response.json();
				}
			})
			.then((myJson) => {
				console.log(myJson);
				document.querySelector('#gebruikersnaam').innerHTML = myJson.gebruikersnaam;
				document.querySelector('#email').innerHTML = email;
				
			});
		
		//Haal de gegevens van de score die de gebruiker heeft in de normale rankings en stel de delete button in
		fetch('restservices/stuff/getScore/' + email + "/" + 1, fetchoptions)
			.then((response) => {
				if (response.status == 403) {
					document.querySelector("#normaalAantal").innerHTML = "Er is iets misgegaan, onze excuses voor het ongemak.";
					document.querySelector("#normaalRanking").innerHTML = "";
				}
				else if(response.status == 500){
					document.querySelector("#normaalAantal").innerHTML = "U heeft nog geen score in deze rankings staan.";
					document.querySelector("#normaalRanking").innerHTML = "";
				}
				else {
					return response.json();
				}
			})
			.then((myJson) => {
				console.log(myJson);
				document.querySelector('#normaalAantal').innerHTML = myJson.aantal;
				
				fetch('restservices/stuff/calculate/' + email + "/" + 1, fetchoptions)
				.then((response) => {
					if (response.status == 403) {
						document.querySelector("#normaalAantal").innerHTML = "Er is iets misgegaan, onze excuses voor het ongemak.";
						document.querySelector("#normaalRanking").innerHTML = "";
					}
					else {
						return response.json();
					}
				})
				.then((myJson) => {
					console.log(myJson);
					document.querySelector('#normaalRanking').innerHTML = myJson;
					normaalDelete = document.querySelector('#normaalDelete');
					normaalDelete.addEventListener("click", function(){
						  deleteScore(email, 1);
				});
			});
			});
		//Haal de gegevens van de score die de gebruiker heeft in de moeilijke rankings en stel de delete button in
		fetch('restservices/stuff/getScore/' + email + "/" + 2, fetchoptions)
		.then((response) => {
			if (response.status == 403) {
				document.querySelector("#moeilijkAantal").innerHTML = "Er is iets misgegaan, onze excuses voor het ongemak.";
				document.querySelector("#moeilijkRanking").innerHTML = "";
			}
			else if(response.status == 500){
				document.querySelector("#moeilijkAantal").innerHTML = "U heeft nog geen score in deze rankings staan.";
				document.querySelector("#moeilijkRanking").innerHTML = "";
			}
			else {
				return response.json();
			}
		})
		.then((myJson) => {
			console.log(myJson);
			document.querySelector('#moeilijkAantal').innerHTML = myJson.aantal;
			
			fetch('restservices/stuff/calculate/' + email + "/" + 2, fetchoptions)
			.then((response) => {
				if (response.status == 403) {
					document.querySelector("#moeilijkAantal").innerHTML = "Er is iets misgegaan, onze excuses voor het ongemak.";
					document.querySelector("#moeilijk").innerHTML = "";
				}
				else {
					return response.json();
				}
			})
			.then((myJson) => {
				console.log(myJson);
				document.querySelector('#moeilijkRanking').innerHTML = myJson;
				moeilijkDelete = document.querySelector('#moeilijkDelete');
				moeilijkDelete.addEventListener("click", function(){
					  deleteScore(email, 2);
			});
			});
		});
		
		//Haal de gegevens van de score die de gebruiker heeft in de extreme rankings en stel de delete button in
		fetch('restservices/stuff/getScore/' + email + "/" + 3, fetchoptions)
		.then((response) => {
			if (response.status == 403) {
				document.querySelector("#extreemAantal").innerHTML = "Er is iets misgegaan, onze excuses voor het ongemak.";
				document.querySelector("#extreemRanking").innerHTML = "";
			}
			else if(response.status == 500){
				document.querySelector("#extreemAantal").innerHTML = "U heeft nog geen score in deze rankings staan.";
				document.querySelector("#extreemRanking").innerHTML = "";
			}
			else {
				return response.json();
			}
		})
		.then((myJson) => {
			console.log(myJson);
			document.querySelector('#extreemAantal').innerHTML = myJson.aantal;
			
			fetch('restservices/stuff/calculate/' + email + "/" + 3, fetchoptions)
			.then((response) => {
				if (response.status == 403) {
					document.querySelector("#extreemAantal").innerHTML = "Er is iets misgegaan, onze excuses voor het ongemak.";
					document.querySelector("#extreemRanking").innerHTML = "";
				}
				else {
					return response.json();
				}
			})
			.then((myJson) => {
				console.log(myJson);
				document.querySelector('#extreemRanking').innerHTML = myJson;
				extreemDelete = document.querySelector('#extreemDelete');
				extreemDelete.addEventListener("click", function(){
					  deleteScore(email, 3);
			});
			});
		});
}