package com.project.ecommerce.services;

import com.project.ecommerce.dtos.UpdateUserDTO;
import com.project.ecommerce.dtos.UserDTO;
import com.project.ecommerce.models.User;
import org.springframework.stereotype.Service;

@Service
public interface IUserService {
    User createUser(UserDTO userDTO) throws Exception;
    String login(String phoneNumber, String password, Long roleId) throws Exception;
    User getUserDetailsFromToken(String token) throws Exception;
    User updateUser(UpdateUserDTO updatedUserDTO, Long userId) throws Exception;
}
