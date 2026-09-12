package com.usermanagement.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.usermanagement.entity.User;
import com.usermanagement.repository.UserRepository;

@Service
public class UserService {

 private UserRepository userRepository;

  public UserService(UserRepository userRepository) {
  this.userRepository = userRepository;
    }

  public User addUser(User user) {
  return userRepository.save(user);
    }

 public List<User> getAllUsers() {
 return userRepository.findAll();
   }

  public User getUserById(Long id) {
  return userRepository.findById(id).orElse(null);
    }

 public User updateUser(Long id, User user) {
 User existingUser = userRepository.findById(id).orElse(null);

  if (existingUser != null) {
      existingUser.setName(user.getName());
      existingUser.setEmail(user.getEmail());
      existingUser.setPassword(user.getPassword());
      existingUser.setRole(user.getRole());

   return userRepository.save(existingUser);
        }

        return null;
    }
  public boolean deleteUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            userRepository.delete(user);
            return true;
        }

     return false;
        }
 public List<User> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword);
    }
    
 public User login(String email, String password) {

    return userRepository.findByEmailAndPassword(email, password);
    }
}