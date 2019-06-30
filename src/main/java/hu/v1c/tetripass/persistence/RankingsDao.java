package hu.v1c.tetripass.persistence;

import java.util.List;

import hu.v1c.tetripass.model.Ranking;

public interface RankingsDao {
	public List<Ranking> findAll();
	public Ranking findRankingByID(int rankingSearch);
}
