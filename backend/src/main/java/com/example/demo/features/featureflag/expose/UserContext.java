package com.example.demo.features.featureflag.expose;

import com.example.demo.shared.config.AppProperties;

/**
 * フィーチャーフラグ評価用のユーザーコンテキスト.
 *
 * <p>認証済みユーザーの情報と環境情報を保持する。
 */
public record UserContext(String userId, String email, AppProperties.Env environment) {}
