package it.polimi.tiw.controllers;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
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
import java.sql.Date;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.List;

@WebServlet(name = "getGroupDetails", value = "/GetGroupDetails")
public class GetGroupDetails extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection;

    /**
     * @see HttpServlet#HttpServlet()
     * Default constructor.
     */
    public GetGroupDetails() {
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


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();

        int IDGroup;
        try {
            IDGroup = Integer.parseInt(request.getParameter("id"));
        } catch (NumberFormatException | NullPointerException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "IDGroup mancante o vuoto");
            return;
        }

        System.out.println(IDGroup);

        GroupDAO groupDAO = new GroupDAO(connection);


        try {
            Group group = groupDAO.getGroupById(IDGroup);

            User user = (User) session.getAttribute("user");


            UserDAO userDAO = new UserDAO(connection);

            // List of participants
            List<User> usersList = userDAO.getUsersFromGroup(IDGroup);

            for (User utente : usersList) {
                System.out.println(utente.getUsername());
            }

            boolean check = usersList.stream()
                    .map(User::getUsername)
                    .anyMatch(username -> username.equals(user.getUsername()));



            if (group == null || !check) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().println("Errore: gruppo non riconosciuto o inesistente");
                return;
            }

            System.out.println(group.getDate_creation());
            System.out.println(group.getActivity_duration());



            Gson gson = new Gson();
            JsonObject groupDetails = new JsonObject();
            groupDetails.add("group", gson.toJsonTree(group));
            groupDetails.add("users", gson.toJsonTree(usersList));

            String json = gson.toJson(groupDetails);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);



        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("SQL error: impossibile ricavare i gruppi dell'utente");
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
