package de.marcv42.backend.service;

import de.marcv42.backend.model.BlogEntry;
import de.marcv42.backend.model.BlogResponse;
import de.marcv42.backend.model.NewBlog;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import javax.swing.JOptionPane; // Importiere die JOptionPane-Klasse

@Service
@RequiredArgsConstructor
public class BlogMappingService
{
    public BlogResponse mapBlogToResponse(BlogEntry blogEntry)
    {
        return BlogResponse.builder()
                .id(blogEntry.getId())
                .title(blogEntry.getTitle())
                .content(blogEntry.getContent())
                .hashtags(blogEntry.getHashtags())
                .timeCreated(blogEntry.getTimeCreated().toString())
                .author(blogEntry.getAuthor())
                .build();
    }

    public BlogEntry mapNewBlogToBlogEntry(NewBlog newBlog)
    {
        return BlogEntry.builder()
                .author(getAuthor())
                .content(newBlog.getContent())
                .title(newBlog.getTitle())
                .hashtags(newBlog.getHashtags())
                .timeCreated(Instant.now())
                .build();
    }

    private String getAuthor()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

            String login = (String) oauth2User.getAttribute("login");

            if (login != null)
            {
                return login;
            } else
            {
                // Zeige einen Fehler-Popup, wenn der Login nicht gefunden wurde
                showErrorPopup("Error: Could not retrieve login from OAuth2User.");
                throw new RuntimeException("Could not retrieve login from OAuth2User.");
            }
        }
        else
        {
            // Zeige einen Fehler-Popup, wenn die Authentication oder der Principal kein OAuth2User ist
            showErrorPopup("Error: Could not get Authentication or Principal is not an OAuth2User.");
            throw new RuntimeException("Could not get Authentication or Principal is not an OAuth2User.");
        }
    }

    private void showErrorPopup(String errorMessage)
    {
        // Zeige ein Pop-up-Fenster mit der Fehlermeldung
        JOptionPane.showMessageDialog(null, errorMessage, "Error", JOptionPane.ERROR_MESSAGE);
    }
}
