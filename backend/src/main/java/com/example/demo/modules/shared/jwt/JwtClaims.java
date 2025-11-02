package com.example.demo.modules.shared.jwt;

import java.util.Date;

/**
 * JWT tokenのclaimを表すrecordクラス
 *
 * @param userId ユーザーID (subject claim)
 * @param email メールアドレス (email claim)
 * @param issuedAt 発行日時 (iat claim)
 * @param expiration 有効期限 (exp claim)
 */
public record JwtClaims(String userId, String email, Date issuedAt, Date expiration) {}
