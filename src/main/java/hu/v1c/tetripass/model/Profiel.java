package hu.v1c.tetripass.model;

public class Profiel {

	private int ID;
	private String email;
	private String gebruikersnaam;
	private String wachtwoord;
	private String rol;

	public Profiel()
	{
		
	}
	
	public Profiel(int iD, String email, String gebruikersnaam, String wachtwoord, String rol) {
		this.ID = iD;
		this.email = email;
		this.gebruikersnaam = gebruikersnaam;
		this.wachtwoord = wachtwoord;
		this.rol = rol;
	}

	public String getRol() {
		return rol;
	}

	public void setRol(String rol) {
		this.rol = rol;
	}

	public int getID() {
		return ID;
	}

	public String getEmail() {
		return email;
	}

	public String getGebruikersnaam() {
		return gebruikersnaam;
	}

	public String getWachtwoord() {
		return wachtwoord;
	}
	
	public void setID(int iD) {
		ID = iD;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setGebruikersnaam(String gebruikersnaam) {
		this.gebruikersnaam = gebruikersnaam;
	}

	public void setWachtwoord(String wachtwoord) {
		this.wachtwoord = wachtwoord;
	}
}