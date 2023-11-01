package de.marcv42.backend.model;

import lombok.Data;

import java.util.List;

@Data
public class UpdatedBlogEntry
{
    private String id;

    private String title;
    private String content;
    private List<String> hashtags;
}
