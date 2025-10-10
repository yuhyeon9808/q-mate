package com.qmate.api;

import com.qmate.common.constants.auth.AuthConstants;
import com.qmate.domain.auth.JwtService;
import com.qmate.domain.auth.model.response.LoginResponse;
import com.qmate.domain.user.UserRepository;
import com.qmate.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth Exchage", description = "쿠키를 통해 로그인 response 받는 API")
public class AuthExchangeController {

  private final JwtService jwtService;
  private final UserRepository userRepository;

  @PostMapping("/exchange")
  @Operation(
      summary = "쿠키를 통해 액세스 토큰 포함 로그인 후 필요한 정보 반환",
      description = AuthConstants.REGISTER_MD
  )
  public ResponseEntity<LoginResponse> exchange(
      @CookieValue(name = "ACCESS_TOKEN", required = false) String accessCookie,
      @AuthenticationPrincipal UserPrincipal principal
  ) {
    if (accessCookie == null || !jwtService.isValid(accessCookie)) {
      return ResponseEntity.status(401).build(); // 액세스 토큰만 검사, 실패면 끝
    }

    // principal이 null이면 jwt 필터가 컨텍스트를 못 세팅한 케이스 → 401
    if (principal == null) {
      return ResponseEntity.status(401).build();
    }
    var user = userRepository.findById(principal.userId()).orElseThrow();

    long accessTtl = jwtService.getRemainingTtlSeconds(accessCookie);

    var body = LoginResponse.builder()
        .accessToken(accessCookie)
        .refreshToken(null)
        .tokenType("Bearer")
        .accessTokenExpiresIn(accessTtl)
        .refreshTokenExpiresIn(0)
        .user(LoginResponse.UserSummary.builder()
            .userId(user.getId())
            .email(user.getEmail())
            .nickname(user.getNickname())
            .birthDate(user.getBirthDate())
            .role(user.getRole().name())
            .currentMatchId(user.getCurrentMatchId())
            .pushEnabled(user.isPushEnabled())
            .build())
        .build();

    return ResponseEntity.ok(body);
  }
}