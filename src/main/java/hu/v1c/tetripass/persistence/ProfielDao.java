package hu.v1c.tetripass.persistence;

import java.util.List;

import hu.v1c.tetripass.model.Profiel;

public interface ProfielDao {
	public boolean add(Profiel profiel);
	public List<Profiel> findAll();
	public Profiel findByEmail(String emailSearch);
	public String checkCreditionals(String name, String pass);
}
