package it.polimi.tiw.controllers;

import it.polimi.tiw.beans.Group;
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
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet(name = "createGroupServlet", value = "/createGroup")
@MultipartConfig
public class CreateGroup extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private Connection connection = null;

    private String message;

    /**
     * Default constructor.
     */
    public CreateGroup(){
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

        String title = request.getParameter("title");
        String durataStr = request.getParameter("durata_att");
        String minPartStr = request.getParameter("min_part");
        String maxPartStr = request.getParameter("max_part");


        if (title == null || title.isEmpty()) {
            return;
        }

        int min_part;
        int max_part;

        try {
            min_part = Integer.parseInt(minPartStr);
            max_part = Integer.parseInt(maxPartStr);
        } catch (NumberFormatException e) {
            return;
        }

        int durata = Integer.parseInt(durataStr);

        if(durata <= 0) {
            return;
        }

        if (min_part > max_part) {
            return;
        }

        if (min_part < 1) {
            return;
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
