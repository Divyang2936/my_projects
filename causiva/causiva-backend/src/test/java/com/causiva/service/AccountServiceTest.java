package com.causiva.service;

import com.causiva.dto.AddressDtos.AddressRequest;
import com.causiva.entity.Address;
import com.causiva.entity.User;
import com.causiva.exception.UnauthorizedException;
import com.causiva.repository.AddressRepository;
import com.causiva.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AccountServiceTest {
    private static final UUID USER_ID = UUID.randomUUID();
    private UserRepository users;
    private AddressRepository addresses;
    private AuthService auth;
    private AccountService service;

    @BeforeEach
    void setUp() {
        users = mock(UserRepository.class);
        addresses = mock(AddressRepository.class);
        auth = mock(AuthService.class);
        service = new AccountService(users, addresses, auth);
    }

    @Test
    void meReturnsCurrentUser() {
        User user = user();
        when(users.findById(USER_ID)).thenReturn(Optional.of(user));
        when(auth.toResponse(user)).thenReturn(new com.causiva.dto.AuthDtos.UserResponse(
                USER_ID, "customer@example.com", "Test", "Customer", "LOCAL", "CUSTOMER", 0, null));

        var response = service.me(USER_ID);

        assertEquals(USER_ID, response.id());
        verify(auth).toResponse(user);
    }

    @Test
    void meRejectsMissingUser() {
        when(users.findById(USER_ID)).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> service.me(USER_ID));
    }

    @Test
    void updateChangesFirstAndLastName() {
        User user = user();
        when(users.findById(USER_ID)).thenReturn(Optional.of(user));
        when(auth.toResponse(user)).thenAnswer(invocation -> new com.causiva.dto.AuthDtos.UserResponse(
                USER_ID, "customer@example.com", "New", "Name", "LOCAL", "CUSTOMER", 0, null));

        var response = service.update(USER_ID, new com.causiva.dto.AuthDtos.ProfileUpdateRequest("New", "Name"));

        assertEquals("New", user.getFirstName());
        assertEquals("Name", user.getLastName());
        assertEquals("New", response.firstName());
    }

    @Test
    void updateRejectsMissingUser() {
        when(users.findById(USER_ID)).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> service.update(USER_ID,
                new com.causiva.dto.AuthDtos.ProfileUpdateRequest("New", "Name")));
    }

    @Test
    void addressesMapsAndReturnsSavedAddresses() {
        Address address = address(true);
        when(addresses.findByUserIdOrderByDefaultAddressDescCreatedAtDesc(USER_ID))
                .thenReturn(List.of(address));

        var result = service.addresses(USER_ID);

        assertEquals(1, result.size());
        assertEquals("Home", result.get(0).name());
        assertEquals("123 Main Street", result.get(0).address());
        assertTrue(result.get(0).defaultAddress());
    }

    @Test
    void addAddressClearsExistingDefaultAndSavesNewDefault() {
        User user = user();
        when(users.findById(USER_ID)).thenReturn(Optional.of(user));

        var result = service.add(USER_ID, addressRequest(true));

        verify(addresses).clearDefaultForUser(USER_ID);
        verify(addresses).save(argThat(address -> address.isDefaultAddress()
                && address.getUser() == user
                && "Home".equals(address.getName())
                && "123 Main Street".equals(address.getAddressLine())));
        assertTrue(result.defaultAddress());
        assertEquals("Home", result.name());
    }

    @Test
    void addAddressDoesNotClearDefaultForNonDefaultAddress() {
        when(users.findById(USER_ID)).thenReturn(Optional.of(user()));

        var result = service.add(USER_ID, addressRequest(false));

        verify(addresses, never()).clearDefaultForUser(any());
        verify(addresses).save(any(Address.class));
        assertFalse(result.defaultAddress());
    }

    @Test
    void addAddressRejectsMissingUser() {
        when(users.findById(USER_ID)).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class,
                () -> service.add(USER_ID, addressRequest(true)));
        verify(addresses, never()).save(any());
    }

    private User user() {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", USER_ID);
        user.setEmail("customer@example.com");
        user.setFirstName("Test");
        user.setLastName("Customer");
        return user;
    }

    private Address address(boolean defaultAddress) {
        Address address = new Address();
        ReflectionTestUtils.setField(address, "id", UUID.randomUUID());
        address.setName("Home");
        address.setAddressLine("123 Main Street");
        address.setCity("Ahmedabad");
        address.setState("Gujarat");
        address.setPinCode("380001");
        address.setPhone("9999999999");
        address.setDefaultAddress(defaultAddress);
        return address;
    }

    private AddressRequest addressRequest(boolean defaultAddress) {
        return new AddressRequest("Home", "123 Main Street", "Ahmedabad", "Gujarat",
                "380001", "9999999999", defaultAddress);
    }
}
