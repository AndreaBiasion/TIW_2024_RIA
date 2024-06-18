package it.polimi.tiw.controllers;

import it.polimi.tiw.beans.Group;
import it.polimi.tiw.beans.User;
import it.polimi.tiw.dao.GroupDAO;
import it.polimi.tiw.dao.UserDAO;
import it.polimi.tiw.utils.ConnectionManager;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.datatransfer.StringSelection;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Servlet implementation class GoToAnag
 * Handles requests to navigate to the anagraphic page, where users can invite other users to groups.
 */
@WebServlet(name = "createGroupServelt", value = "/CreateGroup")
@MultipartConfig
public class CreateGroup extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection;

    /**
     * @see HttpServlet#HttpServlet()
     * Default constructor.
     */
    public CreateGroup() {
        super();
    }

    /**
     * Initializes the servlet, setting up the database connection and the Thymeleaf template engine.
     *
     * @throws ServletException if an initialization error occurs
     */
    @Override
    public void init() throws ServletException {
        connection = ConnectionManager.getConnection(getServletContext());
    }

    /**
     * Handles POST requests for selecting users to invite to a group.
     * Validates the number of selected users and processes the group creation.
     *
     * @param request  the HttpServletRequest object that contains the request the client has made to the servlet
     * @param response the HttpServletResponse object that contains the response the servlet sends to the client
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an input or output error is detected when the servlet handles the POST request
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        boolean isBadRequest = false;
        Integer durata = null;
        Integer min_part = null;
        Integer max_part = null;
        String title = null;
        Integer errorCount = null;

        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");

        try {
            title = request.getParameter("title");
            durata = Integer.parseInt(request.getParameter("durata"));
            min_part = Integer.parseInt(request.getParameter("min_part"));
            max_part = Integer.parseInt(request.getParameter("max_part"));
            errorCount = Integer.parseInt(request.getParameter("errorCount"));
        } catch (NumberFormatException | NullPointerException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("parametri scorretti");
            return;
        }

        isBadRequest = title.isEmpty() || title == null || durata <= 0 || min_part <= 1 || max_part < min_part;

        if (isBadRequest){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("parametri mancanti o scorretti");
            return;
        }
        UserDAO userDAO = new UserDAO(connection);
        String username = user.getUsername();
        List<User> users;

        try {
            users = userDAO.getAllUsers(username);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        if(min_part -1 > users.size()){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Errore: Il numero minimo di utenti è troppo alto");
            return;
        }

        if(errorCount > 2){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Troppi errori");
            return;
        }

        Group g = new Group();
        g.setUsername_creatore(user.getUsername());
        g.setTitle(title);
        g.setActivity_duration(durata);
        g.setMin_parts(min_part);
        g.setMax_parts(max_part);

        // escludo il creatore del gruppo
        min_part--;
        max_part--;

        String[] selezione = request.getParameterValues("selectedUsers");

        String selection = selezione[0];
        String[] selections = selection.split(",");

        List<String> usernames = new ArrayList<>(Arrays.asList(selections));

        if (usernames.size() < min_part) {
            request.getSession().setAttribute("selectedUsers", usernames);
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if (usernames.size() > max_part) {
            request.getSession().setAttribute("selectedUsers", usernames);
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        GroupDAO groupDAO = new GroupDAO(connection);
        try {
            usernames.add(user.getUsername());
            groupDAO.createGroup(usernames, g, user.getUsername());
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (SQLException e) {
            throw new RuntimeException(e);
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
