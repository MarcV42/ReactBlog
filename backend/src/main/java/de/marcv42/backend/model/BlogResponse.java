package de.marcv42.backend.model;

import lombok.Builder;

import java.util.List;

@Builder
public record BlogResponse(
        String id,
        String title,
        String content,
        List<String> hashtags,
        String timeCreated,
        String author
) {
}
