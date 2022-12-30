package com.dron.jsontool.jsonshema.repositiry;

import com.dron.jsontool.jsonshema.repositiry.entity.JsonSchema;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JsonSchemaRepository extends JpaRepository<JsonSchema, UUID> {

	Optional<JsonSchema> findTopByOwnerIdOrderByCreatedDateDesc(UUID ownerId);

	Optional<JsonSchema> findById(UUID id);

	List<JsonSchema> findAllByOwnerId(UUID userId, Sort by);

}
