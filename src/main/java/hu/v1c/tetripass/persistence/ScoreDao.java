package hu.v1c.tetripass.persistence;

import java.util.List;

import hu.v1c.tetripass.model.Score;

public interface ScoreDao {
	public List<Score> findAll();
	public boolean add(Score score);
	public boolean update(Score score);
	public boolean delete(Score score);
	public Score findBijProfielEnRanking(String emailSearch, int rankingSearch);
	public int calculateRanking(String emailSearch, int rankingSearch);
}
