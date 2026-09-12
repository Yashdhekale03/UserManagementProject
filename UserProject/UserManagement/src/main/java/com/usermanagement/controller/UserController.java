package com.usermanagement.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.usermanagement.entity.User;
import com.usermanagement.service.UserService;
import com.usermanagement.service.UserExcelService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

  private UserService userService;
  private UserExcelService userExcelService;

  public UserController(UserService userService,UserExcelService userExcelService) {
        this.userService = userService;
        this.userExcelService = userExcelService;
    }

    // Add user
@PostMapping
public User addUser(@RequestBody User user) {
 return userService.addUser(user);
    }

// Get all users
@GetMapping
public List<User> getAllUsers() {
     return userService.getAllUsers();
   }

    // Get user by id
  @GetMapping("/{id}")
  public ResponseEntity<User> getUserById(@PathVariable Long id) {
   User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
            }

  return ResponseEntity.notFound().build();
    }

    // Update user
  @PutMapping("/{id}")
  public ResponseEntity<User> updateUser(
          @PathVariable Long id,
          @RequestBody User user) {

   User updatedUser = userService.updateUser(id, user);

    if (updatedUser != null) {
       return ResponseEntity.ok(updatedUser);
      }

     return ResponseEntity.notFound().build();
     }

    // Delete user
  @DeleteMapping("/{id}")
   public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
      boolean deleted = userService.deleteUser(id);
        if (deleted) {
        	return ResponseEntity.noContent().build();
        }

    return ResponseEntity.notFound().build();
    }

    // Upload users from Excel file
   @PostMapping("/upload")
    public ResponseEntity<String> uploadUsers(
    		@RequestParam("file") MultipartFile file) {

    try {
    	userExcelService.saveUsersFromExcel(file.getInputStream());

       return ResponseEntity.ok("Users uploaded successfully");
       } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body("Error uploading file: " + e.getMessage());
        }
    }
  @GetMapping("/download")
  public ResponseEntity<byte[]> downloadUsers() {
        try {
            byte[] excelData = userExcelService.downloadUsersAsExcel();

            return ResponseEntity.ok()
                    .header("Content-Disposition",
                            "attachment; filename=users.xlsx")
                    .body(excelData);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/search")
    public List<User> searchUsers(
    @RequestParam String keyword) {
    return userService.searchUsers(keyword);
    }
    
 @PostMapping("/login")
  public ResponseEntity<User> login(
            @RequestBody User user) {
        User loggedInUser = userService.login(
                user.getEmail(),
                user.getPassword());

        if (loggedInUser != null) {
            return ResponseEntity.ok(loggedInUser);
        }

        return ResponseEntity.badRequest().build();
    }
}