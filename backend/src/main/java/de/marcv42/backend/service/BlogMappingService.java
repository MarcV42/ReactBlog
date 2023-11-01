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
                throw new RuntimeException("Couldn't get Login from OAuth2User");
            }
        }
        else
        {
            throw new RuntimeException("Couldn't get Authentication or Authentication Principal was not an OAuth2User");
        }
    }
}





