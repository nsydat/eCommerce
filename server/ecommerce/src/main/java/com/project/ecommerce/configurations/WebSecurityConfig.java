package com.project.ecommerce.configurations;

import com.project.ecommerce.filters.JwtTokenFilter;
import com.project.ecommerce.models.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Arrays;
import java.util.List;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
@EnableWebMvc
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final JwtTokenFilter jwtTokenFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(requests-> {
                    requests
                            .requestMatchers("/api/v1/users/register",
                                            "/api/v1/users/login")
                            .permitAll()

                            .requestMatchers(GET,"/api/v1/roles**").permitAll()

                            .requestMatchers(GET,"/api/v1/categories**").permitAll()
                            .requestMatchers(POST,"/api/v1/categories/**").hasAnyRole(Role.ADMIN)
                            .requestMatchers(PUT,"/api/v1/categories/**").hasAnyRole(Role.ADMIN)
                            .requestMatchers(DELETE,"/api/v1/categories/**").hasAnyRole(Role.ADMIN)

                            .requestMatchers(GET,"/api/v1/products**").permitAll()
                            .requestMatchers(GET,"/api/v1/products/images/*").permitAll()
                            .requestMatchers(GET, "/api/v1/products/{id}").permitAll()
                            .requestMatchers(GET, "/api/v1/products/{id}/images").permitAll()
                            .requestMatchers(POST,"/api/v1/products**").hasAnyRole(Role.ADMIN)
                            .requestMatchers(PUT,"/api/v1/products/**").hasAnyRole(Role.ADMIN)
                            .requestMatchers(DELETE,"/api/v1/products/**").hasAnyRole(Role.ADMIN)

                            .requestMatchers(POST,"/api/v1/orders/**").hasAnyRole(Role.USER)
                            .requestMatchers(GET,"/api/v1/orders/**").permitAll()
                            .requestMatchers(PUT,"/api/v1/orders/**").hasRole(Role.ADMIN)
                            .requestMatchers(DELETE,"/api/v1/orders/**").hasRole(Role.ADMIN)

                            .requestMatchers(POST,"/api/v1/orderdetails/**").hasAnyRole(Role.USER)
                            .requestMatchers(GET,"/api/v1/orderdetails/**").permitAll()
                            .requestMatchers(PUT,"/api/v1/orderdetails/**").hasRole(Role.ADMIN)
                            .requestMatchers(DELETE,"/api/v1/orderdetails/**").hasRole(Role.ADMIN)

                            .anyRequest().authenticated();
                })
        .csrf(AbstractHttpConfigurer::disable);

        http.cors(new Customizer<CorsConfigurer<HttpSecurity>>() {
            @Override
            public void customize(CorsConfigurer<HttpSecurity> httpSecurityCorsConfigurer) {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("*"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
                configuration.setExposedHeaders(List.of("x-auth-token"));
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                httpSecurityCorsConfigurer.configurationSource(source);
            }
        });

        return http.build();
    }
}
