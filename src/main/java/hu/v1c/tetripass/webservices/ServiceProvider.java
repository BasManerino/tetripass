package hu.v1c.tetripass.webservices;

import java.util.concurrent.atomic.AtomicInteger;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;

import hu.v1c.tetripass.model.Profiel;
import hu.v1c.tetripass.model.Ranking;
import hu.v1c.tetripass.model.Score;
import hu.v1c.tetripass.persistence.ScorePostgresDaoImpl;

@Path("/stuff")
public class ServiceProvider {
	public static final AtomicInteger scoreCount = new AtomicInteger(0);
	public static final AtomicInteger profielCount = new AtomicInteger(0);
	
	private static ScorePostgresDaoImpl scoreService = new ScorePostgresDaoImpl();

	public static ScorePostgresDaoImpl getScoreService() {
		return scoreService;
	}
	
	// Hier worden alle functies verbindbaar gemaakt met Javascript.
	// @PermitAll maakt dat de functie door alle rollen gedaan word, @RolesAllowed laat alleen bepaalde rollen toe.
	
	@PermitAll
	@GET
	@Path("/getScores")
	@Produces("application/json")
	public String getScores() {
		JsonArrayBuilder jab = Json.createArrayBuilder();
		
		for (Score c : scoreService.findAll()) {
			JsonObjectBuilder job = Json.createObjectBuilder();
			job.add("profiel", c.getProfiel().getEmail());
			job.add("ranking", c.getRanking().getID());
			job.add("scoreid", c.getScoreID());
			job.add("moeilijkheidsgraad", c.getMoeilijkheidsgraad());
			job.add("aantal", c.getAantal());
			
			jab.add(job);
		}
		
		JsonArray array = jab.build();	
		return array.toString();
    }
	
	@PermitAll
	@GET
	@Path("/getProfiels")
	@Produces("application/json")
	public String getProfiels() {
		JsonArrayBuilder jab = Json.createArrayBuilder();
		
		for (Profiel c : scoreService.profielDAO.findAll()) {
			JsonObjectBuilder job = Json.createObjectBuilder();
			job.add("id", c.getID());
			job.add("email", c.getEmail());
			job.add("gebruikersnaam", c.getGebruikersnaam());
			job.add("wachtwoord", c.getWachtwoord());
			job.add("rol", c.getRol());
			
			jab.add(job);
		}
		
		JsonArray array = jab.build();	
		return array.toString();
    }
	
	@GET
	@PermitAll
	@Path("/getRankings")
	@Produces("application/json")
	public String getRankings() {
		JsonArrayBuilder jab = Json.createArrayBuilder();
		
		for (Ranking c : scoreService.rankingDAO.findAll()) {
			JsonObjectBuilder job = Json.createObjectBuilder();
			job.add("id", c.getID());
			job.add("omschrijving", c.getOmschrijving());
			
			jab.add(job);
		}
		
		JsonArray array = jab.build();	
		return array.toString();
    }
	
	@GET
	@PermitAll
	@Path("getScore/{profiel}/{ranking}")
	@Produces("application/json")
	public String getScore(@PathParam("profiel") String emailSearch, @PathParam("ranking") int rankingSearch) {
		Score c = scoreService.findBijProfielEnRanking(emailSearch, rankingSearch);
		
		if (c == null) {
			throw new WebApplicationException("De score bestaat niet!");
		}
		
		JsonObjectBuilder job = Json.createObjectBuilder();
		job.add("profiel", c.getProfiel().getEmail());
		job.add("ranking", c.getRanking().getID());
		job.add("scoreid", c.getScoreID());
		job.add("moeilijkheidsgraad", c.getMoeilijkheidsgraad());
		job.add("aantal", c.getAantal());
		
		return job.build().toString();
	}
	
	@GET
	@PermitAll
	@Path("calculate/{profiel}/{ranking}")
	@Produces("application/json")
	public int calculate(@PathParam("profiel") String emailSearch, @PathParam("ranking") int rankingSearch) {
		int c = scoreService.calculateRanking(emailSearch, rankingSearch);
		return c;
	}
	
	@GET
	@PermitAll
	@Path("getProfiel/{email}")
	@Produces("application/json")
	public String getProfiel(@PathParam("email") String emailSearch) {
		Profiel c = scoreService.profielDAO.findByEmail(emailSearch);
		
		if (c == null) {
			throw new WebApplicationException("Geen profiel met dit email adres!");
		}
		
		JsonObjectBuilder job = Json.createObjectBuilder();
		job.add("id", c.getID());
		job.add("email", c.getEmail());
		job.add("gebruikersnaam", c.getGebruikersnaam());
		job.add("wachtwoord", c.getWachtwoord());
		job.add("rol", c.getRol());
		
		return job.build().toString();
	}
	
	@GET
	@PermitAll
	@Path("getRanking/{ranking}")
	@Produces("application/json")
	public String getRanking(@PathParam("ranking") int rankingSearch) {
		Ranking c = scoreService.rankingDAO.findRankingByID(rankingSearch);
		
		if (c == null) {
			throw new WebApplicationException("Geen ranking met dit ID!");
		}
		
		JsonObjectBuilder job = Json.createObjectBuilder();
		job.add("id", c.getID());
		job.add("omschrijving", c.getOmschrijving());
		
		return job.build().toString();
	}
	
	@POST
	@PermitAll
	@Path("/addProfiel")
	public Response addProfiel(@FormParam("email") String email, @FormParam("gebruikersnaam") String gebruikersnaam, @FormParam("psw") String wachtwoord, @FormParam("psw-repeat") String wachtwoordRepeat){
		if(!wachtwoord.equals(wachtwoordRepeat)) {
			return Response.status(999).build();
		}
		
		Profiel c = new Profiel();
		c.setID(profielCount.incrementAndGet());
		c.setEmail(email);
		c.setGebruikersnaam(gebruikersnaam);
		c.setWachtwoord(wachtwoord);
		c.setRol("user");
		boolean resp = scoreService.profielDAO.add(c);
		System.out.println(resp);
		
		if (resp == false) {
			return Response.status(402).build();
		}
		
		return Response.ok().build();
	}
	
	@POST
	@RolesAllowed("user")
	@Path("addScore/{profiel}/{ranking}/{moeilijkheidsgraad}/{aantal}/")
	public Response addScore(@PathParam("profiel") String email, @PathParam("ranking") int ranking, @PathParam("moeilijkheidsgraad") int moeilijkheidsgraad, @PathParam("aantal") int aantal) {
		Score c = new Score();
		c.setScoreID(scoreCount.incrementAndGet());
		c.setProfiel(scoreService.profielDAO.findByEmail(email));
		c.setRanking(scoreService.rankingDAO.findRankingByID(ranking));
		c.setMoeilijkheidsgraad(moeilijkheidsgraad);
		c.setAantal(aantal);
		boolean resp = scoreService.add(c);
		
		if (!resp) {
			return Response.status(402).build();
		}
		
		return Response.ok().build();
	}
	
	@PUT
	@RolesAllowed("user")
	@Path("updateScore/{profiel}/{ranking}/{aantal}/")
	public Response updateScore(@PathParam("profiel") String emailSearch, @PathParam("ranking") int rankingSearch, @PathParam("aantal") int aantal){
		Score c = scoreService.findBijProfielEnRanking(emailSearch, rankingSearch);
		c.setAantal(aantal);
		boolean r = scoreService.update(c);
		
		if (!r) {
			return Response.status(404).build();
		}
		
		return Response.ok().build();
	}
	
	@DELETE
	@RolesAllowed("user")
	@Path("deleteScore/{profiel}/{ranking}/")
	public Response delete(@PathParam("profiel") String emailSearch, @PathParam("ranking") int rankingSearch) {
		Score c = scoreService.findBijProfielEnRanking(emailSearch, rankingSearch);
		
		boolean resp = scoreService.delete(c);
		
		if (!resp) {
			return Response.status(402).build();
		}
		
		return Response.ok().build();
	}
}