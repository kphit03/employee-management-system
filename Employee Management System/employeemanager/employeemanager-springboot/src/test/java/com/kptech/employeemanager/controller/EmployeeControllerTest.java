package com.kptech.employeemanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kptech.employeemanager.model.Employee;
import com.kptech.employeemanager.repository.EmployeeRepository;
import com.kptech.employeemanager.security.CustomUserDetailsService;
import com.kptech.employeemanager.security.JWTAuthenticationFilter;
import com.kptech.employeemanager.security.JWTGenerator;
import com.kptech.employeemanager.service.EmployeeService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = EmployeeController.class, excludeAutoConfiguration = {SecurityAutoConfiguration.class})
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class EmployeeControllerTest {


    @MockBean
    private EmployeeService employeeService;
    @MockBean
    private EmployeeRepository employeeRepository;
    @MockBean
    private CustomUserDetailsService customUserDetailsService;
    @MockBean
    private JWTGenerator jwtGenerator;
    @MockBean
    private JWTAuthenticationFilter jwtAuthenticationFilter;
    @Autowired
    private WebApplicationContext webApplicationContext;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldReturnHelloWorldFromTest() throws Exception { //test endpoint
        mockMvc.perform(get("/employee/test"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("Hello World"));
    }

    @BeforeEach
    void setUp() {
        // Create mock Employees for testing
        Employee john = new Employee("John", "Doe", "john@example.com", "1234445555", "Dev", "IT", 12333, "na", "yes", "sdfjksa222");
        john.setDateAdded(LocalDateTime.now());

        Employee jane = new Employee("Jane", "Smith", "jane@example.com", "1234445554", "QA", "Testing", 12500, "na", "yes", "sdfjksa333");
        jane.setDateAdded(LocalDateTime.now());

        // Mock the service response
        List<Employee> mockEmployees = Arrays.asList(john, jane);
        when(employeeService.getAllEmployees()).thenReturn(mockEmployees);
    }

    @Test
    public void testGetAllEmployees() throws Exception {
        mockMvc.perform(get("/employee/all")) //test endpoint
                .andDo(print()) // Prints the response for debugging
                .andExpect(status().isOk())  //http ok status
                .andExpect(jsonPath("$", hasSize(2))) // Expecting 2 employees in the response
                .andExpect(jsonPath("$[0].firstName", Matchers.is("John"))) // Verifying the first name of the first employee
                .andExpect(jsonPath("$[1].firstName", Matchers.is("Jane"))); // Verifying the first name of the second employee
    }
}