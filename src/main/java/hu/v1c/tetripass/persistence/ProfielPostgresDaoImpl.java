package hu.v1c.tetripass.persistence;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import hu.v1c.tetripass.model.Profiel;

public class ProfielPostgresDaoImpl extends PostgresBaseDao implements ProfielDao {
	public boolean add(Profiel profiel) {
		System.out.println("-x-x-x-x-x-");
		
		try (Connection con = super.getConnection()) {
			String q = "insert into profiel(id, email, gebruikersnaam, wachtwoord, rol) " +
					"values (" + profiel.getID() + ", '" + profiel.getEmail() + "', '" + profiel.getGebruikersnaam() + "', '" + profiel.getWachtwoord() + "', 'user')";
			PreparedStatement pstmt = con.prepareStatement(q);
			pstmt.executeUpdate();
			return true;
		} catch (SQLException sqle) {
			sqle.printStackTrace();
			return false;
		}
	}
	
	public List<Profiel> findAll() {
		return this.getProfiels("select * from profiel order by code limit 20");
	}
	
	private List<Profiel> getProfiels(String query) {
		List<Profiel> results = new ArrayList<Profiel>();
		
		try (Connection con = super.getConnection()) {
			PreparedStatement pstmt = con.prepareStatement(query);
			ResultSet dbResultSet = pstmt.executeQuery();
			
			while (dbResultSet.next()) {
				int id = dbResultSet.getInt("id");
				String email = dbResultSet.getString("email"); 
				String username = dbResultSet.getString("gebruikersnaam");
				String wachtwoord = dbResultSet.getString("wachtwoord");
				String rol = dbResultSet.getString("rol");
				
				Profiel c = new Profiel(id, email, username, wachtwoord, rol);
				results.add(c);
			}
		} catch (SQLException sqle) { sqle.printStackTrace(); }
		
		return results;
	}
	
	public Profiel findByEmail(String emailSearch) {
		Profiel result = null;
		System.out.println("xx");
		try (Connection con = super.getConnection()) {
			PreparedStatement pstmt = con.prepareStatement("select * from profiel where email = '" + emailSearch + "'");
			ResultSet dbResultSet = pstmt.executeQuery();
			
			while (dbResultSet.next()) {
				int id = dbResultSet.getInt("id");
				String email = dbResultSet.getString("email"); 
				String username = dbResultSet.getString("gebruikersnaam");
				String wachtwoord = dbResultSet.getString("wachtwoord");
				String rol = dbResultSet.getString("rol");
				
				result = new Profiel(id, email, username, wachtwoord, rol);
			}
		} catch (SQLException sqle) { sqle.printStackTrace(); }
		
		return result;
	}
	
	public String checkCreditionals(String email, String pass) {
		String result = null;
		try (Connection con = super.getConnection()) {
			PreparedStatement pstmt = con.prepareStatement("select * from profiel "
					+ "where email = '" + email + "' and wachtwoord = '" + pass + "'");
			ResultSet dbResultSet = pstmt.executeQuery();
			
			while (dbResultSet.next()) {
				result = dbResultSet.getString("rol");
			}
		} catch (SQLException sqle) { sqle.printStackTrace(); }
		
		return result;
	}
}
