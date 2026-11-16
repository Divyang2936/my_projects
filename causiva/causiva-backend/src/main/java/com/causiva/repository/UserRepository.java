package com.causiva.repository;

import com.causiva.entity.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface UserRepository extends JpaRepository<User, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<User> findWithLockById(UUID id);

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByProviderAndProviderSubject(User.Provider provider, String subject);
}
