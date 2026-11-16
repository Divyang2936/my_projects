package com.causiva.service;

import com.causiva.dto.AddressDtos.*;
import com.causiva.dto.AuthDtos.ProfileUpdateRequest;
import com.causiva.entity.*;
import com.causiva.exception.*;
import com.causiva.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class AccountService {
    final UserRepository users;
    final AddressRepository addresses;
    final AuthService auth;

    public AccountService(UserRepository u, AddressRepository a, AuthService s) {
        users = u;
        addresses = a;
        auth = s;
    }

    public com.causiva.dto.AuthDtos.UserResponse me(UUID id) {
        return auth.toResponse(users.findById(id).orElseThrow(() -> new UnauthorizedException("User not found")));
    }

    public List<AddressResponse> addresses(UUID id) {
        return addresses.findByUserIdOrderByDefaultAddressDescCreatedAtDesc(id).stream()
                .map(a -> new AddressResponse(a.getId(), a.getName(), a.getAddressLine(), a.getCity(), a.getState(),
                        a.getPinCode(), a.getPhone(), a.isDefaultAddress()))
                .toList();
    }

    @Transactional
    public com.causiva.dto.AuthDtos.UserResponse update(UUID id, ProfileUpdateRequest x) {
        User u = users.findById(id).orElseThrow(() -> new UnauthorizedException("User not found"));
        u.setFirstName(x.firstName());
        u.setLastName(x.lastName());
        return auth.toResponse(u);
    }

    @Transactional
    public AddressResponse add(UUID id, AddressRequest x) {
        User u = users.findById(id).orElseThrow(() -> new UnauthorizedException("User not found"));
        if (x.defaultAddress()) addresses.clearDefaultForUser(id);
        Address a = new Address();
        a.setUser(u);
        a.setName(x.name());
        a.setAddressLine(x.address());
        a.setCity(x.city());
        a.setState(x.state());
        a.setPinCode(x.pinCode());
        a.setPhone(x.phone());
        a.setDefaultAddress(x.defaultAddress());
        addresses.save(a);
        return new AddressResponse(a.getId(), a.getName(), a.getAddressLine(), a.getCity(), a.getState(),
                a.getPinCode(), a.getPhone(), a.isDefaultAddress());
    }
}
