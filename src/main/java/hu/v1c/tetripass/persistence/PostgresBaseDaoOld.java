// Deze BaseDao word gebruikt op TomCat

package hu.v1c.tetripass.persistence;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class PostgresBaseDaoOld {
	public Connection getConnection() {
		final String url = "jdbc:postgresql://localhost/tetripass";
	    final String user = "sebastiaan";
	    final String password = "Geheim123";

        Connection conn = null;
        try {
            conn = DriverManager.getConnection(url, user, password);
            System.out.println("Connected to the PostgreSQL server successfully.");
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

        return conn;
	}
}