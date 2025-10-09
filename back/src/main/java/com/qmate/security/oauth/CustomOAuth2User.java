package com.qmate.security.oauth;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

@Getter
@RequiredArgsConstructor
public class CustomOAuth2User implements OAuth2User {
  private final Long userId;
  private final String email;
  private final String role; // "USER"/"ADMIN"
  private final Map<String, Object> attributes;

  @Override
  public Map<String, Object> getAttributes() { return attributes; }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority("ROLE_" + role));
  }

  @Override
  public String getName() { return String.valueOf(userId); }
}