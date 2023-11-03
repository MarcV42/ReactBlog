package de.marcv42.backend.service;

import de.marcv42.backend.model.BlogEntry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import de.marcv42.backend.model.BlogResponse;
import de.marcv42.backend.model.NewBlog;
import de.marcv42.backend.model.UpdatedBlogEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import java.util.List;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
class BlogServiceIntegrationTest
{
    @Autowired
    MockMvc mockMvc;

    @Autowired
    BlogRepo blogRepo;

    @MockBean
    ClientRegistrationRepository clientRegistrationRepository;

    Authentication authentication = mock(Authentication.class);
    SecurityContext securityContext = mock(SecurityContext.class);

    @BeforeEach
    void setUp()
    {
        LocalDateTime localDateTime = LocalDateTime.of(2020, 1, 1, 12, 0, 0);
        Instant fixedInstant = localDateTime.toInstant(ZoneOffset.UTC);

        BlogEntry blogEntry = new BlogEntry( "id1", "title", "content",
                List.of("tag1", "tag2"),
                fixedInstant, "author"
        );
        blogRepo.save(blogEntry);
    }

    @Test
    @DirtiesContext
    void getAllBlogTest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/blogs"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        [
                            {
                                "id": "id1",
                                "title": "title",
                                "content": "content",
                                "hashtags": [
                                    "tag1",
                                    "tag2"
                                ],
                                "timeCreated": "2020-01-01T12:00:00Z"
                            }
                        ]
                        """));
    }

    @Test
    @DirtiesContext
    void getBlogById() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/blogs/id1"))
                .andExpect(status().isOk())
                .andExpect(content().json(""" 
                            {
                                "id": "id1",
                                "title": "title",
                                "content": "content",
                                "hashtags": [
                                    "tag1",
                                    "tag2"
                                ],
                                "timeCreated": "2020-01-01T12:00:00Z"
                                
                            }
                        """));
    }

    @Test
    @DirtiesContext
    @WithMockUser
    void testDeleteEndpoint() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/blogs/id1"))
                .andExpect(status().isOk());

    }

    @Test
    @DirtiesContext
    @WithMockUser
    void postAddBlog() throws Exception {

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(new DefaultOAuth2User(List.of(), Map.of("login", "name") ,"login"));
        SecurityContextHolder.setContext(securityContext);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/blogs")
                        .with(oidcLogin().userInfoToken(token -> token.claim("login", "test")))
                .contentType("application/json")
                .content("""
                    {
                        "title": "title",
                        "content": "content",
                        "hashtags": [
                            "tag1",
                            "tag2"
                        ]
                    }"""))

                .andExpect(status().isCreated())
                .andExpect(content().json(""" 
                            {
                                "title": "title",
                                "content": "content",
                                "hashtags": [
                                    "tag1",
                                    "tag2"
                                ]
                            }"""))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.timeCreated").exists());
    }

    @Test
    @DirtiesContext
    void putUpdateBlog() throws Exception
    {
        mockMvc.perform(MockMvcRequestBuilders.put("/api/blogs/id1")
                        .contentType("application/json")
                        .content("""
                            {
                                "id": "id1",
                                "title": "title",
                                "content": "content",
                                "hashtags": [
                                    "tag1",
                                    "tag2"
                                ],
                                "timeCreated": "2020-01-01T12:00:00Z"
                            }
                        """))
                .andExpect(status().isOk())
                .andExpect(content().json(""" 
                             {
                                "id": "id1",
                                "title": "title",
                                "content": "content",
                                "hashtags": [
                                    "tag1",
                                    "tag2"
                                ],
                                "timeCreated": "2020-01-01T12:00:00Z"
                            }
                        """));
    }
}
