package com.project.ecommerce.repositories;

import com.project.ecommerce.models.Order;
import com.project.ecommerce.models.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(long userId);
}
