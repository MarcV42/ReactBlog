package de.marcv42.backend.service;


import de.marcv42.backend.model.Tag;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


class TagServiceTest {

    TagRepo tagRepo = mock(TagRepo.class);

    TagService tagService = new TagService(tagRepo);


    @Test
    void addTags()
    {
        //GIVEN
        List<String> filteredTags = List.of("hashtag1", "hashtag2");

        //WHEN
        when(tagRepo.save(any(Tag.class))).thenReturn(new Tag( "id1", "hashtag1"));

        tagService.addTags(filteredTags);
        //THEN
        verify(tagRepo, times(filteredTags.size())).save(any(Tag.class));
    }
}