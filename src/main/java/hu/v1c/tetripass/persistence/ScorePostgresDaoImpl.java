package hu.v1c.tetripass.persistence;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import hu.v1c.tetripass.model.Profiel;
import hu.v1c.tetripass.model.Ranking;
import hu.v1c.tetripass.model.Score;
import hu.v1c.tetripass.persistence.ProfielPostgresDaoImpl;
import hu.v1c.tetripass.persistence.RankingsPostgresDaoImpl;

public class ScorePostgresDaoImpl extends PostgresBaseDao implements ScoreDao {
	
	public ProfielDao profielDAO = new ProfielPostgresDaoImpl();
	public RankingsDao rankingDAO = new RankingsPostgresDaoImpl();
	
	// Vind alle scores in de database
	public List<Score> findAll() {
		return this.getScores("select * from score order by scoreid limit 20");
	}
	
	// Vind alle scores in de database (werkt hetzelfde als findAll, maar met eventuele extra voorwaarden in de query)
	private List<Score> getScores(String query) {
		List<Score> results = new ArrayList<Score>();
		
		try (Connection con = super.getConnection()) {
			PreparedStatement pstmt = con.prepareStatement(query);
			ResultSet dbResultSet = pstmt.executeQuery();
			
			while (dbResultSet.next()) {
				Profiel profiel = profielDAO.findByEmail(dbResultSet.getString("profiel"));
				Ranking ranking = rankingDAO.findRankingByID(dbResultSet.getInt("ranking"));
				int scoreid = dbResultSet.getInt("scoreid");
				int moeilijkheidsgraad = dbResultSet.getInt("moeilijkheidsgraad");
				int aantal = dbResultSet.getInt("aantal");
				
				Score c = new Score(profiel, ranking, scoreid, moeilijkheidsgraad, aantal);
				results.add(c);
			}
		} catch (SQLException sqle) { sqle.printStackTrace(); }
		
		return results;
	}
	
	// Voeg een score toe aan de database
	public boolean add(Score score) {
		System.out.println("-x-x-x-x-x-");
		
		try (Connection con = super.getConnection()) {
			String q = "insert into score(profiel, ranking, scoreid, moeilijkheidsgraad, aantal) " +
					"values ('" + score.getProfiel().getEmail() + "', " + score.getRanking().getID() + ", " + score.getScoreID() + ", " + score.getMoeilijkheidsgraad() + ", " + score.getAantal() + ")";
			PreparedStatement pstmt = con.prepareStatement(q);
			pstmt.executeUpdate();
			return true;
		} catch (SQLException sqle) {
			sqle.printStackTrace();
			return false;
		}
	}
	
	// Update een score in de database (update alleen aantal)
	public boolean update(Score score) {
		try (Connection con = super.getConnection()) {
			
			String q = "update score SET aantal = " + score.getAantal() + " where scoreid = " + score.getScoreID();
			System.out.println(q);
			PreparedStatement pstmt = con.prepareStatement(q);
			pstmt.executeQuery();		
		} catch (Exception exc) {
			exc.printStackTrace();
		}
		
		return true;
	}
	
	// Verwijder een score uit de database
	public boolean delete(Score score) {
		try (Connection con = super.getConnection()) {
			PreparedStatement pstmt = con.prepareStatement("delete from score where scoreid = '" + score.getScoreID() + "'");
			pstmt.executeQuery();
			return true;
		} catch (Exception exc) {
			exc.printStackTrace();
			return false;
		}
	}
	
	public Score findBijProfielEnRanking(String emailSearch, int rankingSearch) {
		Score result = null;
		System.out.println("xx");
		try (Connection con = super.getConnection()) {
			PreparedStatement pstmt = con.prepareStatement("select * from score where profiel = '" + emailSearch + "' and ranking = " + rankingSearch);
			ResultSet dbResultSet = pstmt.executeQuery();
			
			while (dbResultSet.next()) {
				Profiel profiel = profielDAO.findByEmail(dbResultSet.getString("profiel"));
				Ranking ranking = rankingDAO.findRankingByID(dbResultSet.getInt("ranking"));
				int scoreid = dbResultSet.getInt("scoreid");
				int moeilijkheidsgraad = dbResultSet.getInt("moeilijkheidsgraad");
				int aantal = dbResultSet.getInt("aantal");
				
				result = new Score(profiel, ranking, scoreid, moeilijkheidsgraad, aantal);
			}
		} catch (SQLException sqle) { sqle.printStackTrace(); }
		
		return result;
	}

	public int calculateRanking(String emailSearch, int rankingSearch) {
		int i = 1;
		try (Connection con = super.getConnection()) {
			PreparedStatement pstmt = con.prepareStatement("select * from score where ranking = " + rankingSearch + " order by aantal DESC");
			ResultSet dbResultSet = pstmt.executeQuery();
			
			while (dbResultSet.next()) {
				if(dbResultSet.getString("profiel").equals(emailSearch)) {
					return i;
				}
				else {
					i++;
				}
			}
		} catch (SQLException sqle) { sqle.printStackTrace(); }
		return i;
	}
}
