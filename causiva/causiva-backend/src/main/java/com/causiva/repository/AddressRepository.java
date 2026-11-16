package com.causiva.repository;

import com.causiva.entity.Address;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    @Modifying
    @Query("UPDATE Address a SET a.defaultAddress = false WHERE a.user.id = :userId AND a.defaultAddress = true")
    int clearDefaultForUser(@Param("userId") UUID userId);

    List<Address> findByUserIdOrderByDefaultAddressDescCreatedAtDesc(UUID userId);

    Optional<Address> findByIdAndUserId(UUID id, UUID userId);
}
