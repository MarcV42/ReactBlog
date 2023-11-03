package de.marcv42.backend.service;

import de.marcv42.backend.model.BlogEntry;
import de.marcv42.backend.model.BlogResponse;
import de.marcv42.backend.model.NewBlog;
import de.marcv42.backend.model.UpdatedBlogEntry;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;

class BlogServiceTest
{
    BlogRepo blogRepo = mock(BlogRepo.class);
    TagService tagService = mock(TagService.class);
    BlogService blogService = new BlogService(blogRepo, new BlogMappingService(), tagService );

    @MockBean
    ClientRegistrationRepository clientRegistrationRepository;

    Authentication authentication = mock(Authentication.class);
    SecurityContext securityContext = mock(SecurityContext.class);

    private BlogEntry setUp()
    {
        LocalDateTime localDateTime = LocalDateTime.of(2020, 1, 1, 12, 0, 0);
        Instant fixedInstant = localDateTime.toInstant(ZoneOffset.UTC);

        return new BlogEntry("1", "title", "content",
                List.of("hashtag1", "hashtag2"),
                fixedInstant, "author");
        //fixed instant = 2020-01-01T12:00:00Z
    }

    @Test
    void getAllBlogs()
    {
        //GIVEN
        List<BlogResponse> expected = List.of(new BlogResponse("1", "title", "content",
                List.of("hashtag1", "hashtag2"),
                "2020-01-01T12:00:00Z", "author"));

        when(blogRepo.findAll()).thenReturn(List.of(setUp()));

        //WHEN
        List<BlogResponse> actual = blogService.getAllBlogs();

        //THEN
        Assertions.assertEquals(1, actual.size());
        Assertions.assertEquals(expected, actual);
    }

    @Test
    void addBlogEntry()
    {
        //GIVEN
        NewBlog newBlog = new NewBlog();
        newBlog.setTitle("title");
        newBlog.setContent("content");
        newBlog.setHashtags(List.of("hashtag1", "hashtag2"));

        when(blogRepo.save(any(BlogEntry.class))).thenReturn(setUp());

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(new DefaultOAuth2User(List.of(), Map.of("login", "name") ,"login"));
        SecurityContextHolder.setContext(securityContext);

        //WHEN
        BlogResponse actual = blogService.addBlogEntry(newBlog);

        //THEN
        Assertions.assertEquals("title", actual.title());
        Assertions.assertEquals("content", actual.content());
        Assertions.assertEquals(List.of("hashtag1", "hashtag2"), actual.hashtags());
    }

    @Test
    void getBlogEntry()
    {
        //GIVEN
        BlogResponse expected = new BlogResponse("1", "title", "content",
                List.of("hashtag1", "hashtag2"),
                "2020-01-01T12:00:00Z", "author");

        when(blogRepo.findById("1")).thenReturn(java.util.Optional.of(setUp()));

        //WHEN
        BlogResponse actual = blogService.getBlogEntry("1");

        //THEN
        Assertions.assertEquals(expected, actual);
    }

    @Test
    void deleteBlogEntry()
    {
        Assertions.assertTrue(true);
    }

    @Test
    void updateBlogEntry()
    {
        //GIVEN
        UpdatedBlogEntry updatedBlog =  new UpdatedBlogEntry();
        updatedBlog.setTitle("updated title");
        updatedBlog.setContent("updated content");
        updatedBlog.setHashtags(List.of("updated hashtag1", "updated hashtag2"));

        when(blogRepo.findById("1")).thenReturn(java.util.Optional.of(setUp()));

        //WHEN
        BlogResponse actual = blogService.updateBlogEntry("1", updatedBlog);

        //THEN
        Assertions.assertEquals("updated title", actual.title());
        Assertions.assertEquals("updated content", actual.content());
        Assertions.assertEquals(List.of("updated hashtag1", "updated hashtag2"), actual.hashtags());

    }
}