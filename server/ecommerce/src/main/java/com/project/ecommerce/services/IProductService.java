package com.project.ecommerce.services;

import com.project.ecommerce.dtos.ProductDTO;
import com.project.ecommerce.dtos.ProductImageDTO;
import com.project.ecommerce.exeptions.DataNotFoundException;
import com.project.ecommerce.models.Product;
import com.project.ecommerce.reponses.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.project.ecommerce.models.*;

import java.util.List;

@Service
public interface IProductService {
    public Product createProduct(ProductDTO productDTO) throws DataNotFoundException;
    Product getProductById(long productId) throws Exception;
    public List<Product> findProductsByIds(List<Long> productIds);
    Page<ProductResponse> getAllProducts(String keyword, Long categoryId, PageRequest pageRequest);
    Product updateProduct(long id, ProductDTO productDTO) throws Exception;
    void deleteProduct(long id);
    boolean existsByName(String name);
    public ProductImage createProductImage(Long productId, ProductImageDTO productImageDTO) throws Exception;
}
