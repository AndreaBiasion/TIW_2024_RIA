package it.polimi.tiw.controllers;

import com.google.gson.Gson;
import it.polimi.tiw.beans.Group;
import it.polimi.tiw.beans.User;
import it.polimi.tiw.dao.GroupDAO;
import it.polimi.tiw.dao.UserDAO;
import it.polimi.tiw.utils.ConnectionManager;

import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet(name = "removeUser", value = "/RemoveUser")
public class RemoveUser extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection;

    /**
     * @see HttpServlet#HttpServlet()
     * Default constructor.
     */
    public RemoveUser() {
        super();
    }

    /**
     * Initializes the servlet, setting up the database connection and the Thymeleaf template engine.
     *
     * @throws ServletException if an initialization error occurs
     */
    @Override
    public void init() throws ServletException, UnavailableException {
        connection = ConnectionManager.getConnection(getServletContext());
    }

    /**
     * Handles POST requests for removing a user from a group.
     * @param request   an {@link HttpServletRequest} object that
     *                  contains the request the client has made
     *                  of the servlet
     *
     * @param response  an {@link HttpServletResponse} object that
     *                  contains the response the servlet sends
     *                  to the client
     *
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();

        String username = request.getParameter("username");
        int id_group = Integer.parseInt(request.getParameter("id"));

        GroupDAO groupDAO = new GroupDAO(connection);

        try {
            Group g = groupDAO.getGroupById(id_group);

            UserDAO userDAO = new UserDAO(connection);

            List<User> userList = userDAO.getUsersFromGroup(id_group);

            if(userList.size() - 1 < g.getMin_parts()){
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().println("Errore: Sei sotto la soglia minima");
                return;
            }

            groupDAO.removeUserFromGroup(id_group,username);

        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("SQL error: impossibile ricavare i gruppi dell'utente");
            return;
        }

    }

    /**
     * Closes the database connection when the servlet is destroyed.
     */
    @Override
    public void destroy() {
        try {
            ConnectionManager.closeConnection(connection);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
