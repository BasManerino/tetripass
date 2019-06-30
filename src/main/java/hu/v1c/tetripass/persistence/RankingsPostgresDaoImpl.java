package hu.v1c.tetripass.persistence;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import hu.v1c.tetripass.model.Ranking;

public class RankingsPostgresDaoImpl extends PostgresBaseDao implements RankingsDao {
	
	public List<Ranking> findAll() {
		return this.getRanking("select * from ranking order by code limit 20");
	}
	
	private List<Ranking> getRanking(String query) {
		List<Ranking> results = new ArrayList<Ranking>();
		
		try (Connection con = super.getConnection()) {
			PreparedStatement pstmt = con.prepareStatement(query);
			ResultSet dbResultSet = pstmt.executeQuery();
			
			while (dbResultSet.next()) {
				int id = dbResultSet.getInt("id");
				String omschrijving = dbResultSet.getString("omschrijving");
				
				Ranking c = new Ranking(id, omschrijving);
				results.add(c);
			}
		} catch (SQLException sqle) { sqle.printStackTrace(); }
		
		return results;
	}
	
	public Ranking findRankingByID(int rankingSearch) {
		Ranking result = null;
		System.out.println("xx");
		try (Connection con = super.getConnection()) {
			PreparedStatement pstmt = con.prepareStatement("select * from ranking where id = '" + rankingSearch + "'");
			ResultSet dbResultSet = pstmt.executeQuery();
			
			while (dbResultSet.next()) {
				int id = dbResultSet.getInt("id");
				String omschrijving = dbResultSet.getString("omschrijving");
				
				result = new Ranking(id, omschrijving);
			}
		} catch (SQLException sqle) { sqle.printStackTrace(); }
		
		return result;
	}
}
