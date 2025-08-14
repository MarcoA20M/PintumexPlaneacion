package com.pintumex.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pintumex.api.model.Personal;

public interface PersonalRepository extends JpaRepository<Personal, Integer> {}
