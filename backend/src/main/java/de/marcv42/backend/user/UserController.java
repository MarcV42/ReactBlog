package de.marcv42.backend.user;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/user")
public class UserController
{
    @GetMapping("me")
    public String getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth instanceof OAuth2AuthenticationToken token) {
            return token.getPrincipal().getAttributes().get("login").toString();
        }

        return auth.getName();
    }



}
