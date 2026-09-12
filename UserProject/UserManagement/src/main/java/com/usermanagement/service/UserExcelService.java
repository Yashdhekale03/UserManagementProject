package com.usermanagement.service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.usermanagement.entity.User;
import com.usermanagement.repository.UserRepository;

@Service
public class UserExcelService {

 private UserRepository userRepository;

 public UserExcelService(UserRepository userRepository) {
   this.userRepository = userRepository;
    }

 // Read users from Excel and save them to database
  public void saveUsersFromExcel(InputStream inputStream) throws Exception {

  Workbook workbook = new XSSFWorkbook(inputStream);

  Sheet sheet = workbook.getSheetAt(0);

  DataFormatter dataFormatter = new DataFormatter();

  // Start from 1 because row 0 contains headers
   for (int i = 1; i <= sheet.getLastRowNum(); i++) {

     Row row = sheet.getRow(i);

     if (row == null) {
     continue;
            }

    User user = new User();

      user.setName(dataFormatter.formatCellValue(row.getCell(0)));

      user.setEmail(dataFormatter.formatCellValue(row.getCell(1)));

       user.setPassword( dataFormatter.formatCellValue(row.getCell(2)));

       user.setRole(dataFormatter.formatCellValue(row.getCell(3)));

       userRepository.save(user);
        }

        workbook.close();
    }

 // Get users from database and create Excel file
    public byte[] downloadUsersAsExcel() throws Exception {

    // Get all users from database
    List<User> users = userRepository.findAll();

     // Create new Excel workbook
     Workbook workbook = new XSSFWorkbook();

     // Create sheet
     Sheet sheet = workbook.createSheet("Users");

    // Create header row
     Row headerRow = sheet.createRow(0);

        headerRow.createCell(0).setCellValue("ID");
        headerRow.createCell(1).setCellValue("Name");
        headerRow.createCell(2).setCellValue("Email");
        headerRow.createCell(3).setCellValue("Password");
        headerRow.createCell(4).setCellValue("Role");

   // Start adding data from row 1
    int rowNumber = 1;

  for (User user : users) {

     Row row = sheet.createRow(rowNumber);

        row.createCell(0).setCellValue(user.getId());
        row.createCell(1).setCellValue(user.getName());
        row.createCell(2).setCellValue(user.getEmail());
        row.createCell(3).setCellValue(user.getPassword());
        row.createCell(4).setCellValue(user.getRole());

        rowNumber++;
        }

     // Convert Excel file into byte array
      ByteArrayOutputStream outputStream =new ByteArrayOutputStream();

        workbook.write(outputStream);

        workbook.close();

        return outputStream.toByteArray();
    }
}