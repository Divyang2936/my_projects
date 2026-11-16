package com.causiva.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User extends BaseEntity {
    @Column(nullable = false, unique = true)
    String email;
    @Column(name = "password_hash")
    String passwordHash;
    @Column(name = "first_name", nullable = false)
    String firstName;
    @Column(name = "last_name")
    String lastName;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Provider provider = Provider.LOCAL;
    @Column(name = "provider_subject")
    String providerSubject;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Role role = Role.CUSTOMER;
    @Column(nullable = false)
    int points = 0;

    public enum Provider {
        LOCAL, GOOGLE
    }

    public enum Role {
        CUSTOMER, ADMIN
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public Provider getProvider() {
        return provider;
    }

    public Role getRole() {
        return role;
    }

    public int getPoints() {
        return points;
    }

    public void setEmail(String v) {
        email = v;
    }

    public void setPasswordHash(String v) {
        passwordHash = v;
    }

    public void setFirstName(String v) {
        firstName = v;
    }

    public void setLastName(String v) {
        lastName = v;
    }

    public void setProvider(Provider v) {
        provider = v;
    }

    public void setProviderSubject(String v) {
        providerSubject = v;
    }
}
