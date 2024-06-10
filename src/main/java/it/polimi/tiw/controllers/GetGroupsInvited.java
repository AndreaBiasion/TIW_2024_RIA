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

@WebServlet(name = "getGroupsInvited", value = "/GetGroupsInvited")
public class GetGroupsInvited extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection;

    /**
     * @see HttpServlet#HttpServlet()
     * Default constructor.
     */
    public GetGroupsInvited() {
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
     * Handles POST requests to validate user login credentials.
     * If credentials are valid, redirects to the home page. Otherwise, reloads the login page with an error message.
     *
     * @param request  the HttpServletRequest object that contains the request the client has made to the servlet
     * @param response the HttpServletResponse object that contains the response the servlet sends to the client
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an input or output error is detected when the servlet handles the POST request
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");

        GroupDAO groupDAO = new GroupDAO(connection);

        List<Group> groups;
        try {
            groups = groupDAO.getGroupsByUsernameInvited(user.getUsername());
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("SQL error: impossibile ricavare i gruppi dell'utente");
            return;
        }

        Gson gson = new Gson();
        String json = gson.toJson(groups);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);

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

