package de.marcv42.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document
@Data
@Builder
@AllArgsConstructor
public class Tag
{
    @MongoId
    private String id;

    private String tagValue;

}
