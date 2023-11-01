package de.marcv42.backend.service;

import de.marcv42.backend.model.BlogEntry;
import de.marcv42.backend.model.BlogResponse;
import de.marcv42.backend.model.NewBlog;
import de.marcv42.backend.model.UpdatedBlogEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService
{
    private final BlogRepo blogRepo;
    private final BlogMappingService bms;
    private final TagService tagService;

    public List<BlogResponse> getAllBlogs() {

        return blogRepo.findAll().stream()
                .map(bms::mapBlogToResponse)
                .toList();
    }

    public BlogResponse addBlogEntry(NewBlog newBlog)
    {
        BlogEntry blog = bms.mapNewBlogToBlogEntry(newBlog);

        removeDuplicatedHashtags(blog);
        setHashTagsToLowerCase(blog);

        BlogEntry savedBlog = blogRepo.save(blog);

        tagService.addTags(savedBlog.getHashtags());

        return bms.mapBlogToResponse(blog);
    }

    private void setHashTagsToLowerCase(BlogEntry blog)
    {
        blog.setHashtags(blog.getHashtags().stream()
                .map(String::toLowerCase)
                .toList());
    }

    private void removeDuplicatedHashtags(BlogEntry blog)
    {
        blog.setHashtags(blog.getHashtags().stream()
                .distinct()
                .toList());
    }

    public BlogResponse getBlogEntry(String id)
    {
        BlogEntry blog = blogRepo.findById(id).orElseThrow();
        return bms.mapBlogToResponse(blog);
    }

    public void deleteBlogEntry(String id)
    {
        blogRepo.deleteById(id);
    }


    public BlogResponse updateBlogEntry(String id, UpdatedBlogEntry updatedBlog)
    {
        BlogEntry blog = blogRepo.findById(id).orElseThrow();
        blog.setTitle(updatedBlog.getTitle());
        blog.setContent(updatedBlog.getContent());
        blog.setHashtags(updatedBlog.getHashtags());

        removeDuplicatedHashtags(blog);
        setHashTagsToLowerCase(blog);

        blogRepo.save(blog);


        return bms.mapBlogToResponse(blog);
    }


}




