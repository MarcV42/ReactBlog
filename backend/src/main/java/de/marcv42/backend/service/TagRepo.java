package de.marcv42.backend.service;


import de.marcv42.backend.model.Tag;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TagRepo extends MongoRepository<Tag, String>
{
}
