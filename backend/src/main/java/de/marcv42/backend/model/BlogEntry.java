package de.marcv42.backend.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Instant;
import java.util.List;

//Papa Class
@Document
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class BlogEntry {
    @MongoId
    private String id;

    private String title;

    private String content;
    private List<String> hashtags;

    private Instant timeCreated;

    private String author;
}
