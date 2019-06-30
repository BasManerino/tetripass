package hu.v1c.tetripass.model;

import java.util.*;

public class Ranking {

	private int ID;
	private String omschrijving;
	
	public int getID() {
		return ID;
	}
	public Ranking(int iD, String omschrijving) {
		ID = iD;
		this.omschrijving = omschrijving;
	}
	public String getOmschrijving() {
		return omschrijving;
	}
	public void setID(int iD) {
		ID = iD;
	}
	public void setOmschrijving(String omschrijving) {
		this.omschrijving = omschrijving;
	}

}