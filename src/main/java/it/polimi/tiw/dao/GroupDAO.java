package it.polimi.tiw.dao;

import it.polimi.tiw.beans.Group;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class GroupDAO {

    Connection connection;
    /**
     * Constructor for the GroupDAO
     * @param connection the connection to the database
     */
    public GroupDAO(Connection connection) {
        this.connection = connection;
    }
    /**
     * Method to create a group
     * @param parts_usernames
     * @param group
     * @param username_creatore
     * @throws SQLException
     */
    public void createGroup(List<String> parts_usernames, Group group, String username_creatore) throws SQLException {

        String titolo = group.getTitle();
        int durata = group.getActivity_duration();
        int min_part = group.getMin_parts();
        int max_part = group.getMax_parts();

        java.util.Date utilDate = new java.util.Date();
        Date sqlDate = new Date(utilDate.getTime());

        PreparedStatement preparedStatement = null;
        ResultSet generatedKeys = null;
        int affectedRows = 0;

        String insertGroupQuery = "INSERT INTO gruppo (username_creatore, titolo, data_creazione, durata_att, min_part, max_part) VALUES (?, ?, ?, ?, ?, ?)";

        try {
            preparedStatement = connection.prepareStatement(insertGroupQuery, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, username_creatore);
            preparedStatement.setString(2, titolo);
            preparedStatement.setDate(3, sqlDate);
            preparedStatement.setInt(4, durata);
            preparedStatement.setInt(5, min_part);
            preparedStatement.setInt(6, max_part);

            affectedRows = preparedStatement.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Creating group failed, no rows affected.");
            }

        } catch (SQLException e) {
            throw new SQLException(e);
        }

        try {
            generatedKeys = preparedStatement.getGeneratedKeys();
            if (generatedKeys.next()) {
                group.setId(generatedKeys.getInt(1));
            } else {
                throw new SQLException("Creating group failed, no ID obtained.");
            }
        } catch (SQLException e1){
            throw new SQLException(e1);
        }


        String insertParticipationQuery = "INSERT INTO partecipazione (idpart, idgruppo) VALUES (?, ?)";

        try {
            preparedStatement = connection.prepareStatement(insertParticipationQuery);
            for (String partId : parts_usernames) {
                preparedStatement.setString(1, partId);
                preparedStatement.setInt(2, group.getId());
                preparedStatement.executeUpdate();
            }
        } catch (SQLException e2) {
            throw new SQLException(e2);

        } finally {
            try {
                generatedKeys.close();
            } catch (Exception e3) {
                throw new SQLException("cannot close result");
            }
            try {
                preparedStatement.close();
            } catch (Exception e3) {
                throw new SQLException("cannot close prepared statement");
            }
        }

    }

    public void removeUserFromGroup(int IDGroup, String username) throws SQLException {

        String query = "DELETE FROM partecipazione WHERE idpart = ? and idgruppo = ?";
        PreparedStatement preparedStatement = null;
        int affectedRows = 0;

        try {
            preparedStatement = connection.prepareStatement(query, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, username);
            preparedStatement.setInt(2, IDGroup);

            affectedRows = preparedStatement.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Removing from group failed, no rows affected.");
            }

        } catch (SQLException e) {
            throw new SQLException(e);
        }   finally {
            if (preparedStatement != null) {
                preparedStatement.close();
            }
        }

    }

    /**
     * Method to get the groups of a user
     * @param username
     * @return List<Group> the list of groups of the user
     * @throws SQLException
     */
    public List<Group> getGroupsByUsername(String username) throws SQLException {
        List<Group> groups = new ArrayList<>();
        String query = "SELECT id,titolo FROM partecipazione join gruppo on partecipazione.idgruppo = gruppo.id WHERE idpart = ? AND idpart = username_creatore";
        PreparedStatement statement = null;
        ResultSet resultSet = null;

        try {
            statement = connection.prepareStatement(query);
            statement.setString(1, username);
            resultSet = statement.executeQuery();
            while (resultSet.next()) {
                Group group = new Group();
                group.setId(resultSet.getInt("id"));
                group.setTitle(resultSet.getString("titolo"));
                groups.add(group);
            }
        } catch (SQLException e){
            throw new SQLException (e);

        } finally {
            try {
                resultSet.close();
            } catch (Exception e3) {
                throw new SQLException ("cannot close result set");
            }
            try {
                statement.close();
            } catch (Exception e3) {
                throw new SQLException ("cannot close prepared statemet");
            }
        }

        return groups;
    }

    /**
     * Method to get the groups of a user that he has been invited to
     * @param username
     * @return List<Group> the list of groups of the user that he has been invited to
     * @throws SQLException
     */
    public List<Group> getGroupsByUsernameInvited(String username) throws SQLException {
        List<Group> groups = new ArrayList<>();
        String query = "SELECT id,titolo FROM partecipazione join gruppo on partecipazione.idgruppo = gruppo.id WHERE idpart = ? AND idpart <> gruppo.username_creatore";
        PreparedStatement statement = null;
        ResultSet resultSet = null;

        try {
            statement = connection.prepareStatement(query);
            statement.setString(1, username);
            resultSet = statement.executeQuery();
            while (resultSet.next()) {
                Group group = new Group();
                group.setId(resultSet.getInt("id"));
                group.setTitle(resultSet.getString("titolo"));
                groups.add(group);
            }
        } catch (SQLException e) {
            throw new SQLException (e);

        } finally {
            try {
                resultSet.close();
            } catch (Exception e3) {
                throw new SQLException ("cannot close result set");
            }
            try {
                statement.close();
            } catch (Exception e3) {
                throw new SQLException ("cannot close prepared statemet");
            }
        }

        return groups;
    }

    /**
     * Method to get a group by its id
     * @param idgroup
     * @return Group the group with the id
     * @throws SQLException
     */
    public Group getGroupById(int idgroup) throws SQLException {
        Group group = new Group();
        String query = "SELECT * FROM gruppo WHERE id = ?";
        PreparedStatement statement = null;
        ResultSet resultSet = null;

        try {
            statement = connection.prepareStatement(query);
            statement.setInt(1, idgroup);
            resultSet = statement.executeQuery();
            if (!resultSet.isBeforeFirst()) {
                return null;
            }
            resultSet.next();
            group.setId(resultSet.getInt("id"));
            group.setTitle(resultSet.getString("titolo"));
            group.setActivity_duration(resultSet.getInt("durata_att"));
            group.setMin_parts(resultSet.getInt("min_part"));
            group.setMax_parts(resultSet.getInt("max_part"));
            group.setDate_creation(resultSet.getDate("data_creazione"));

        } catch (SQLException e) {
            throw new SQLException(e);

        } finally {
            try {
                resultSet.close();
            } catch (Exception e3) {
                throw new SQLException("cannot close result set");
            }
            try {
                statement.close();
            } catch (Exception e3) {
                throw new SQLException("cannot close prepared statemet");
            }
        }

        return group;
    }
}
