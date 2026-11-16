package com.causiva.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    User user;
    String name;
    @Column(name = "address_line")
    String addressLine;
    String city;
    String state;
    @Column(name = "pin_code")
    String pinCode;
    String phone;
    @Column(name = "is_default")
    boolean defaultAddress;

    public User getUser() {
        return user;
    }

    public String getName() {
        return name;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getPinCode() {
        return pinCode;
    }

    public String getPhone() {
        return phone;
    }

    public boolean isDefaultAddress() {
        return defaultAddress;
    }

    public void setUser(User v) {
        user = v;
    }

    public void setName(String v) {
        name = v;
    }

    public void setAddressLine(String v) {
        addressLine = v;
    }

    public void setCity(String v) {
        city = v;
    }

    public void setState(String v) {
        state = v;
    }

    public void setPinCode(String v) {
        pinCode = v;
    }

    public void setPhone(String v) {
        phone = v;
    }

    public void setDefaultAddress(boolean v) {
        defaultAddress = v;
    }
}
