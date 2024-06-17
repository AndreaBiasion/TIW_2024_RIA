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

@WebServlet(name = "checkGroup", value = "/CheckGroup")
@MultipartConfig
public class CheckGroup extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private Connection connection = null;

    private String message;

    /**
     * Default constructor.
     */
    public CheckGroup(){
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


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String title = request.getParameter("title");
        String durataStr = request.getParameter("durata_att");
        String minPartStr = request.getParameter("min_part");
        String maxPartStr = request.getParameter("max_part");


        if (title == null || title.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Parametri mancanti");
            return;
        }

        int min_part;
        int max_part;
        int durata;

        try {
            min_part = Integer.parseInt(minPartStr);
            max_part = Integer.parseInt(maxPartStr);
            durata = Integer.parseInt(durataStr);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Parametri non validi");
            return;
        }

        if(durata <= 0) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Errore: durata invalida");
            return;
        }

        if (min_part > max_part || min_part <= 1) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Errore: numero partecipanti invalido");
            return;
        }

        response.setStatus(HttpServletResponse.SC_OK);


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
