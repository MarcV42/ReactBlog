package de.marcv42.backend.service;

import de.marcv42.backend.model.BlogEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepo extends MongoRepository<BlogEntry, String>
{
}
