package com.healthcare.dto;


public class CurrentUserResponse {

    private Long id;
    private String email;
    private String fullName;
    private String role;

    public CurrentUserResponse(
            Long id,
            String email,
            String fullName,
            String role
    ) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getRole() {
        return role.toString();
    }
}