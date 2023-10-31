package de.marcv42.backend.service;


import org.springframework.data.mongodb.repository.MongoRepository;

public interface TagRepo extends MongoRepository<Tag, String>
{
}
