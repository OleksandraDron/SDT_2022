package com.dron.jsontool.jsonshema.service;

import com.dron.jsontool.jsonshema.repositiry.entity.JsonSchema;

import java.util.List;
import java.util.UUID;

public interface JsonSchemaService {

	JsonSchema save(JsonSchema jsonSchema);

	JsonSchema findLastByUserId(UUID ownerId);

	JsonSchema findById(UUID id);

	List<JsonSchema> findAllByUserId(UUID userId);

}
