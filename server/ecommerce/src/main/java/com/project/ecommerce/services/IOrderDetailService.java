package com.project.ecommerce.services;

import com.project.ecommerce.dtos.OrderDetailDTO;
import com.project.ecommerce.models.OrderDetail;

import java.util.List;

public interface IOrderDetailService {
    OrderDetail createOrderDetail(OrderDetailDTO orderDetailDTO) throws Exception;
    OrderDetail getOrderDetail(long id) throws Exception;
    OrderDetail updateOrderDetail(long id, OrderDetailDTO newOrderDetailData) throws Exception;
    void deleteById(long id);
    List<OrderDetail> findByOrderid(long orderId);
}
