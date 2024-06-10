package it.polimi.tiw.controllers;

import it.polimi.tiw.dao.UserDAO;
import it.polimi.tiw.utils.ConnectionManager;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.regex.Pattern;

/**
 * This servlet class handles the registration process.
 * It provides methods for handling HTTP GET and POST requests related to registration.
 */
@WebServlet(name = "registerServlet", value = "/CheckRegister")
@MultipartConfig
public class Register extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private Connection connection = null;

    private String message;

    /**
     * Default constructor.
     */
    public Register(){
        super();
    }

    /**
     * Initializes the servlet by establishing a database connection and configuring the template engine.
     * @throws ServletException if an error occurs during servlet initialization.
     */
    @Override
    public void init() throws ServletException {
        connection = ConnectionManager.getConnection(getServletContext());
    }

    /**
     * Handles HTTP POST requests for registration.
     * @throws ServletException if an error occurs while processing the request.
     * @throws IOException      if an I/O error occurs while handling the request.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String username = request.getParameter("username");
        String name = request.getParameter("name");
        String surname = request.getParameter("surname");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String repassword = request.getParameter("repassword");


        if(email == null || password == null || name == null || surname == null || email.isEmpty() || password.isEmpty() || name.isEmpty() || surname.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Missing parameters");
            return;
        }


        // controllo password
        if(!password.equals(repassword)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Passwords do not match");
            return;
        }

        // valida email
        Pattern emailPattern = Pattern.compile("^.+@.+\\..+$");
        if(!emailPattern.matcher(email).matches()){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Errore: Email non valida");
            return;
        }


        UserDAO userDAO = new UserDAO(connection);

        boolean isDuplicate = false;
        try {
            isDuplicate = userDAO.checkRegister(email, username);
        } catch (SQLException e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "SQL error: impossibile controllare unicità dell'email");
        }


        if(isDuplicate) {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            response.getWriter().println("Email o username gia' in uso");
        } else {
            try {
                userDAO.addUser(username, name, surname, email, password);
            } catch (SQLException e) {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Impossibile registrare l'utente");
                return;
            }
            response.setStatus(HttpServletResponse.SC_OK);
        }


    }

    /**
     * Cleans up resources used by the servlet.
     */
    @Override
    public void destroy() {
        try{
            ConnectionManager.closeConnection(connection);
        }catch(SQLException e){
            e.printStackTrace();
        }
    }
}
