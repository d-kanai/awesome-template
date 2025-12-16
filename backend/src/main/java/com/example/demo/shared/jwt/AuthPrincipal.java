package com.example.demo.shared.jwt;

import java.util.Date;

/**
 * 認証済みユーザーの情報を表すrecordクラス.
 *
 * @param userId ユーザーID (Auth0の場合は sub claim)
 * @param email メールアドレス
 * @param issuedAt 発行日時
 * @param expiration 有効期限
 */
public record AuthPrincipal(String userId, String email, Date issuedAt, Date expiration) {}
