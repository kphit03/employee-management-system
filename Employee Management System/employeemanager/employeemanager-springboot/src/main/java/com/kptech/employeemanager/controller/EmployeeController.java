package com.kptech.employeemanager.controller;

import com.kptech.employeemanager.model.Employee;
import com.kptech.employeemanager.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees(); //call the employeeService (which talks to the database)
        System.out.println("Employees returned from service: " + employees);
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable("id") Long id) {
        Employee employees = employeeService.getEmployeeById(id); //call the employeeService (which talks to the database)
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Employee> addEmployee(@RequestBody Employee employee) { //get from the post request the json body, and convert to an employee object
        Employee employeeNew = employeeService.addEmployee(employee);
        return new ResponseEntity<>(employeeNew, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Employee> updateEmployee(@RequestBody Employee employee) {
        Employee currentEmployee = employeeService.updateEmployee(employee);
        return new ResponseEntity<>(currentEmployee, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable("id") Long id) {
        employeeService.deleteEmployee(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/test") //testing purposes
    @ResponseBody
    public String test() {
        System.out.println("Controller method hit");
        return "Hello World";
    }

}
