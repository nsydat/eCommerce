package com.project.ecommerce.services;

import com.project.ecommerce.dtos.OrderDTO;
import com.project.ecommerce.exeptions.DataNotFoundException;
import com.project.ecommerce.models.Order;
import com.project.ecommerce.repositories.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
public interface IOrderSevice {
    Order createOrder(OrderDTO orderDTO) throws Exception;
    Order getOrder(Long id);
    Order updateOrder(Long id, OrderDTO orderDTO) throws DataNotFoundException;
    void deleteOrder(Long id);
    List<Order> findByUserId(Long userId);
}
