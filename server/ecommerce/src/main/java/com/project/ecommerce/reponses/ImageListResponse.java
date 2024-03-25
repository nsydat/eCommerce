package com.project.ecommerce.reponses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImageListResponse {
    @JsonProperty("image_url")
    private String imageUrl;
}
