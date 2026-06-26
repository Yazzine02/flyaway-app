package com.voyage.common.error;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Import;

// Registers shared error handling for any service that depends on this module.
@AutoConfiguration
@Import(ApiExceptionHandler.class)
public class ErrorHandlingAutoConfiguration {
}
