package com.project.ecommerce.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    @JsonProperty("productId")
    private Long productId;

    @JsonProperty("quantity")
    private Integer quantity;
}
