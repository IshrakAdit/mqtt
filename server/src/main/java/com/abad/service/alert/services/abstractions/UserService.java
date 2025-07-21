package com.abad.service.alert.services.abstractions;

import com.abad.service.alert.dtos.request.UserRequest;
import com.abad.service.alert.dtos.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
    UserResponse register(UserRequest request);
    UserResponse login(UserRequest request);
    void deleteUser(Long id);

}
