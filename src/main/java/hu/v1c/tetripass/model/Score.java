package hu.v1c.tetripass.model;

public class Score {

	Profiel profiel;
	Ranking ranking;
	private int scoreID;
	private int moeilijkheidsgraad;
	private int aantal;
	
	public Score()
	{
		
	}
	
	public Score(Profiel profiel, Ranking ranking, int scoreID, int moeilijkheidsgraad, int aantal) {
		this.profiel = profiel;
		this.ranking = ranking;
		this.scoreID = scoreID; 
		this.moeilijkheidsgraad = moeilijkheidsgraad;
		this.aantal = aantal;
	}
	
	public Profiel getProfiel() {
		return profiel;
	}
	public Ranking getRanking() {
		return ranking;
	}
	public int getScoreID() {
		return scoreID;
	}
	
	public int getMoeilijkheidsgraad() {
		return moeilijkheidsgraad;
	}
	public int getAantal() {
		return aantal;
	}
	public void setProfiel(Profiel profiel) {
		this.profiel = profiel;
	}
	public void setRanking(Ranking ranking) {
		this.ranking = ranking;
	}
	public void setScoreID(int scoreID) {
		this.scoreID = scoreID;
	}
	public void setMoeilijkheidsgraad(int moeilijkheidsgraad) {
		this.moeilijkheidsgraad = moeilijkheidsgraad;
	}
	public void setAantal(int aantal) {
		this.aantal = aantal;
	}

}