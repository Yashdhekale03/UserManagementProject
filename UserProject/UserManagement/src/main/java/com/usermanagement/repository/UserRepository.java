package com.usermanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.usermanagement.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
@Query("SELECT u FROM User u WHERE " +
        "LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
        "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> searchUsers(@Param("keyword") String keyword);
    
User findByEmailAndPassword(String email, String password);

}