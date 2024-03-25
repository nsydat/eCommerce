package com.project.ecommerce.configurations;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.ResourceBundleMessageSource;

public class LanguageConfig {
    @Bean
    public MessageSource messageSource() {
        ResourceBundleMessageSource messageSource  = new ResourceBundleMessageSource();
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }
}
